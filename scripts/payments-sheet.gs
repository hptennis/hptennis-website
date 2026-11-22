/**
 * Records payment requests from the website's /store/ pages in this Google Sheet,
 * creates a SumUp checkout for card payments (carrying the payer's name and
 * reference), and marks rows as paid when SumUp confirms the payment.
 *
 * Setup (once) - see README.md "Payment pages" for the full steps:
 *   1. Extensions > Apps Script. Replace the code with this file and save.
 *   2. Project Settings (gear icon) > Script properties. Add:
 *        SUMUP_API_KEY        your SumUp secret API key
 *                             (me.sumup.com > Settings > For Developers > Toolkit > API Keys)
 *        SUMUP_MERCHANT_CODE  your SumUp merchant code (run findMerchantCode below if unsure)
 *        WEB_APP_URL          this script's Web app URL (ends in /exec), once deployed
 *   3. Deploy > New deployment > type "Web app". Execute as: Me. Who has access: Anyone.
 *   4. Copy the Web app URL into WEB_APP_URL (step 2) and into sheet_script_url
 *      in _data/store.yml on the website.
 *
 * After changing this code: Deploy > Manage deployments > Edit > Version: New version > Deploy,
 * so the URL stays the same.
 */

// Prices are fixed here, not taken from the web page, so they can't be changed by the payer.
// Add a line for each payment page: its "code" from the page settings, and the price in £.
var ITEMS = {
  WL: 2.00
};

var SHEET_NAME = 'Payment requests';
var HEADINGS = ['Requested at', 'Item', 'Date', 'Name', 'Amount (£)', 'Method', 'Reference', 'Status', 'SumUp checkout', 'Updated at'];
var COL = { status: 8, checkout: 9, updated: 10 };
var SUMUP_API = 'https://api.sumup.com/v0.1';

function doPost(e) {
  var body = e.postData && e.postData.type === 'application/json' ? JSON.parse(e.postData.contents || '{}') : null;
  if (body && body.event_type) {
    handleSumUpUpdate(body);
    return ContentService.createTextOutput('');
  }
  return json(handlePaymentRequest(e.parameter));
}

// A payer submitted the form on the website.
function handlePaymentRequest(p) {
  var code = String(p.code || '');
  if (!ITEMS.hasOwnProperty(code)) return { ok: false, error: 'Unknown item' };
  var amount = ITEMS[code];
  var sumup = p.method === 'SumUp';

  var row = withLock(function () {
    var sheet = getSheet();
    sheet.appendRow([
      new Date(), clean(p.item), clean(p.date), clean(p.name), amount, clean(p.method), clean(p.reference),
      sumup ? 'Starting card payment' : 'Awaiting bank transfer', '', ''
    ]);
    return sheet.getLastRow();
  });

  if (!sumup) return { ok: true };

  try {
    var checkout = createCheckout(p, amount);
    withLock(function () {
      var sheet = getSheet();
      sheet.getRange(row, COL.status).setValue('Awaiting card payment');
      sheet.getRange(row, COL.checkout).setValue(checkout.id);
      sheet.getRange(row, COL.updated).setValue(new Date());
    });
    return { ok: true, checkout_url: checkout.hosted_checkout_url };
  } catch (err) {
    withLock(function () {
      getSheet().getRange(row, COL.status).setValue('SumUp error: ' + String(err.message).slice(0, 200));
    });
    return { ok: true, checkout_url: null };
  }
}

function createCheckout(p, amount) {
  var props = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('SUMUP_API_KEY');
  var merchantCode = props.getProperty('SUMUP_MERCHANT_CODE');
  if (!apiKey || !merchantCode) throw new Error('SUMUP_API_KEY or SUMUP_MERCHANT_CODE not set');

  // Must be unique per checkout, so add a short random suffix to the payer's reference.
  var reference = String(p.reference || 'PAYMENT').replace(/[^A-Za-z0-9]+/g, '-') + '-' + Utilities.getUuid().slice(0, 8);
  var payload = {
    checkout_reference: reference.slice(0, 64),
    amount: amount,
    currency: 'GBP',
    merchant_code: merchantCode,
    description: [p.item, p.date, p.name].map(function (v) { return String(v || '').slice(0, 60); }).join(' - '),
    hosted_checkout: { enabled: true }
  };
  var webAppUrl = props.getProperty('WEB_APP_URL');
  if (webAppUrl) payload.return_url = webAppUrl;
  if (/^https?:\/\//.test(p.return_page || '')) payload.redirect_url = p.return_page;

  var response = UrlFetchApp.fetch(SUMUP_API + '/checkouts', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + apiKey },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  var result = JSON.parse(response.getContentText() || '{}');
  if (response.getResponseCode() >= 300 || !result.hosted_checkout_url) {
    throw new Error(response.getResponseCode() + ' ' + (result.error_code || result.message || result.title || 'no checkout URL'));
  }
  return result;
}

// SumUp tells us a checkout changed. Never trust the message itself: ask SumUp for the real status.
function handleSumUpUpdate(body) {
  if (body.event_type !== 'CHECKOUT_STATUS_CHANGED' || !body.id) return;
  updateFromSumUp(String(body.id));
}

function updateFromSumUp(checkoutId) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('SUMUP_API_KEY');
  var response = UrlFetchApp.fetch(SUMUP_API + '/checkouts/' + encodeURIComponent(checkoutId), {
    headers: { Authorization: 'Bearer ' + apiKey },
    muteHttpExceptions: true
  });
  if (response.getResponseCode() !== 200) return;
  var checkout = JSON.parse(response.getContentText());

  var labels = { PAID: 'Paid', FAILED: 'Card payment failed', EXPIRED: 'Expired (not paid)', PENDING: 'Awaiting card payment' };
  var status = labels[checkout.status] || checkout.status;
  if (checkout.status === 'PAID') status = 'Paid £' + Number(checkout.amount).toFixed(2);

  withLock(function () {
    var sheet = getSheet();
    var found = sheet.getRange(1, COL.checkout, sheet.getLastRow(), 1)
      .createTextFinder(checkoutId).matchEntireCell(true).findNext();
    if (!found) return;
    var row = found.getRow();
    if (sheet.getRange(row, COL.status).getValue() === status) return;
    sheet.getRange(row, COL.status).setValue(status);
    sheet.getRange(row, COL.updated).setValue(new Date());
  });
}

/**
 * Optional safety net: re-checks every card payment still awaiting payment.
 * Run it by hand, or add a time-driven trigger (Triggers > Add trigger > checkPendingPayments, hourly).
 */
function checkPendingPayments() {
  var sheet = getSheet();
  var last = sheet.getLastRow();
  if (last < 2) return;
  var values = sheet.getRange(2, 1, last - 1, HEADINGS.length).getValues();
  values.forEach(function (row) {
    var status = row[COL.status - 1];
    var checkoutId = row[COL.checkout - 1];
    if (checkoutId && (status === 'Awaiting card payment' || status === 'Starting card payment')) {
      updateFromSumUp(String(checkoutId));
    }
  });
}

/** Run this once from the editor (select it, click Run) and look in the log for your merchant_code. */
function findMerchantCode() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('SUMUP_API_KEY');
  var response = UrlFetchApp.fetch(SUMUP_API + '/me', {
    headers: { Authorization: 'Bearer ' + apiKey },
    muteHttpExceptions: true
  });
  var text = response.getContentText();
  var match = text.match(/"merchant_code"\s*:\s*"([^"]+)"/);
  Logger.log(match ? 'Your merchant code is: ' + match[1] : 'Not found. Full response: ' + text);
}

function getSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADINGS);
    sheet.setFrozenRows(1);
  } else if (sheet.getRange(1, COL.updated).getValue() !== HEADINGS[COL.updated - 1]) {
    sheet.getRange(1, 1, 1, HEADINGS.length).setValues([HEADINGS]); // upgrade older headings
  }
  return sheet;
}

function withLock(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// Limits length and stops anything typed into the form being treated as a formula.
function clean(value) {
  var text = String(value || '').slice(0, 100);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
