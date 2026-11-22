// Payment pages under /store/. Records each payment request in the club's
// Google Sheet (via the Apps Script web app in scripts/payments-sheet.gs).
// Card payments go to a SumUp checkout the script creates with the payer's
// name and reference; bank transfers show the bank details and reference.
(function () {
  var form = document.getElementById('payment-form');
  if (!form) return;

  // Back from SumUp's payment page.
  if (/[?&]paid=1\b/.test(location.search)) {
    form.hidden = true;
    document.getElementById('pay-done').hidden = false;
    return;
  }

  var dateInput = form.elements.date;
  var dateDisplay = document.getElementById('date-display');
  var methods = form.querySelectorAll('input[name="method"]');

  dateInput.value = toIsoDate(new Date());
  showDate();
  dateInput.addEventListener('change', showDate);

  if (methods.length === 1) methods[0].checked = true;
  if (methods.length === 0) form.querySelector('button').disabled = true;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var button = form.querySelector('button');
    button.disabled = true;
    button.textContent = 'Please wait…';

    var checked = form.querySelector('input[name="method"]:checked');
    var data = {
      item: form.dataset.item,
      code: form.dataset.code,
      amount: form.dataset.amount,
      date: dateInput.value,
      name: form.elements.name.value.trim(),
      method: checked ? checked.value : '',
      return_page: location.origin + location.pathname + '?paid=1'
    };
    data.reference = makeReference(data.code, data.date, data.name);

    record(form.dataset.script, data).then(function (result) {
      if (data.method === 'SumUp' && result && result.checkout_url) {
        button.textContent = 'Taking you to SumUp…';
        location.href = result.checkout_url;
        return;
      }
      showPayment(data, Boolean(result && result.ok));
    });
  });

  // Sends the request to the Google Sheet. Resolves with the script's reply, or null.
  function record(url, data) {
    if (!url) return Promise.resolve(null);
    return fetch(url, { method: 'POST', body: new URLSearchParams(data) })
      .then(function (response) { return response.ok ? response.json() : null; })
      .catch(function () { return null; });
  }
  function showPayment(data, recorded) {
    var box = document.getElementById(data.method === 'SumUp' ? 'pay-sumup' : 'pay-bank');
    var values = {
      name: data.name,
      dateText: longDate(data.date),
      reference: data.reference,
      recordNote: recorded
        ? 'Your payment request has been recorded.'
        : 'We couldn\'t record your request automatically, so please make sure you use the reference.'
    };
    box.querySelectorAll('[data-fill]').forEach(function (el) {
      el.textContent = values[el.dataset.fill];
    });
    form.hidden = true;
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showDate() {
    dateDisplay.textContent = dateInput.value ? longDate(dateInput.value) : '';
  }

  // e.g. WL, 2026-11-25, Jane Smith -> WL2511 JANESMITH (bank references max 18 characters)
  function makeReference(code, isoDate, name) {
    var parts = isoDate.split('-');
    var letters = name.toUpperCase().replace(/[^A-Z]/g, '');
    return (code + parts[2] + parts[1] + ' ' + letters).slice(0, 18);
  }

  function longDate(isoDate) {
    var parts = isoDate.split('-');
    var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function toIsoDate(date) {
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
  }
})();
