// Payment pages under /store/. Records each payment request in the club's
// Google Sheet (via the Apps Script web app in scripts/payments-sheet.gs),
// then shows the SumUp link or bank details with a reference to quote.
(function () {
  var form = document.getElementById('payment-form');
  if (!form) return;

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
      amount: form.dataset.amount,
      date: dateInput.value,
      name: form.elements.name.value.trim(),
      method: checked ? checked.value : ''
    };
    data.reference = makeReference(form.dataset.code, data.date, data.name);

    record(form.dataset.script, data).then(function (recorded) {
      showPayment(data, recorded);
    });
  });

  // Sends the request to the Google Sheet. Resolves true if it was saved.
  function record(url, data) {
    if (!url) return Promise.resolve(false);
    return fetch(url, { method: 'POST', body: new URLSearchParams(data) })
      .then(function (response) { return response.ok; })
      .catch(function () { return false; });
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
