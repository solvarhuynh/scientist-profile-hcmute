// Formatting utilities
function enforcePhone10Digits(el) {
  if (!el) return;
  var raw = el.value.replace(/[^0-9]/g, '');
  if (raw.length > 0 && raw[0] !== '0') {
    raw = '0' + raw;
  }
  el.value = raw.slice(0, 10);
}

function enforceCccd12Digits(el) {
  if (!el) return;
  var raw = el.value.replace(/[^0-9]/g, '');
  el.value = raw.slice(0, 12);
}

function formatDateDMY(dStr) {
  if (!dStr) return '';
  var p = dStr.replace(/[-.]/g, '/').split('/');
  if (p.length >= 3) {
    if (p[0].length === 4) return p[2].padStart(2, '0') + '/' + p[1].padStart(2, '0') + '/' + p[0];
    return p[0].padStart(2, '0') + '/' + p[1].padStart(2, '0') + '/' + p[2];
  }
  return dStr;
}
