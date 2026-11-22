/**
 * Records payment requests from the website's /store/ pages in this Google Sheet.
 *
 * Setup (once):
 *   1. In the Google Sheet: Extensions > Apps Script. Replace the code with this file and save.
 *   2. Deploy > New deployment > type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *   3. Click Deploy, allow the permissions, and copy the "Web app URL" (ends in /exec).
 *   4. Paste that URL into sheet_script_url in _data/store.yml on the website.
 *
 * If you change this code later, use Deploy > Manage deployments > Edit > New version,
 * so the URL stays the same.
 */

var SHEET_NAME = 'Payment requests';
var HEADINGS = ['Requested at', 'Item', 'Date', 'Name', 'Amount (£)', 'Method', 'Reference', 'Paid?'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var p = e.parameter;
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADINGS);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      new Date(),
      clean(p.item),
      clean(p.date),
      clean(p.name),
      Number(p.amount) || '',
      clean(p.method),
      clean(p.reference),
      ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Limits length and stops anything typed into the form being treated as a formula.
function clean(value) {
  var text = String(value || '').slice(0, 100);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
