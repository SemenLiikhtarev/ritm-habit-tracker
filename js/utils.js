(function () {
  window.App = window.App || {};
  var U = {};

  U.$ = function (sel, root) { return (root || document).querySelector(sel); };
  U.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  U.uid = function (p) { return (p || 'id') + '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4); };
  U.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  U.escapeHtml = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  U.pad = function (n) { return String(n).padStart(2, '0'); };

  U.toISO = function (d) {
    var x = d instanceof Date ? d : new Date(d);
    return x.getFullYear() + '-' + U.pad(x.getMonth() + 1) + '-' + U.pad(x.getDate());
  };
  U.fromISO = function (s) {
    var p = String(s).split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  };
  U.todayISO = function () { return U.toISO(new Date()); };
  U.addDays = function (date, n) {
    var d = date instanceof Date ? new Date(date) : U.fromISO(date);
    d.setDate(d.getDate() + n);
    return d;
  };
  U.diffDays = function (a, b) {
    var x = a instanceof Date ? a : U.fromISO(a);
    var y = b instanceof Date ? b : U.fromISO(b);
    x = new Date(x.getFullYear(), x.getMonth(), x.getDate());
    y = new Date(y.getFullYear(), y.getMonth(), y.getDate());
    return Math.round((y - x) / 86400000);
  };
  U.startOfWeek = function (d) {
    var x = d instanceof Date ? new Date(d) : U.fromISO(d);
    var day = (x.getDay() + 6) % 7;
    x.setDate(x.getDate() - day);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  U.MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  U.MONTHS_NOM = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  U.MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  U.DOW = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  U.DOW_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

  U.fmtDate = function (iso, withYear) {
    var d = U.fromISO(iso);
    return d.getDate() + ' ' + U.MONTHS[d.getMonth()] + (withYear ? ' ' + d.getFullYear() : '');
  };
  U.fmtDateFull = function (d0) {
    var d = d0 instanceof Date ? d0 : U.fromISO(d0);
    return U.DOW_FULL[(d.getDay() + 6) % 7] + ', ' + d.getDate() + ' ' + U.MONTHS[d.getMonth()];
  };
  U.fmtShort = function (d0) {
    var d = d0 instanceof Date ? d0 : U.fromISO(d0);
    return d.getDate() + ' ' + U.MONTHS_SHORT[d.getMonth()];
  };
  U.fmtMonthYear = function (d0) {
    var d = d0 instanceof Date ? d0 : U.fromISO(d0);
    return U.MONTHS_NOM[d.getMonth()] + ' ' + d.getFullYear();
  };

  U.plural = function (n, forms) {
    var a = Math.abs(n) % 100;
    var b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5) return forms[1];
    if (b === 1) return forms[0];
    return forms[2];
  };
  U.days = function (n) { return n + ' ' + U.plural(n, ['день', 'дня', 'дней']); };
  U.times = function (n) { return n + ' ' + U.plural(n, ['раз', 'раза', 'раз']); };

  U.fmtNum = function (n) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(n * 10) / 10);
  };

  U.relativeDay = function (iso) {
    var diff = U.diffDays(U.todayISO(), iso);
    if (diff === 0) return 'Сегодня';
    if (diff === -1) return 'Вчера';
    if (diff === 1) return 'Завтра';
    if (diff < 0) return U.days(-diff) + ' назад';
    return 'через ' + U.days(diff);
  };

  U.debounce = function (fn, ms) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms || 200);
    };
  };

  U.PALETTE = ['#6c5ce7', '#4c6ef5', '#12b886', '#2dd4bf', '#f6a623', '#ff6b6b', '#e64980', '#8b5cf6', '#0ea5e9', '#14b8a6', '#f59e0b', '#64748b'];

  U.initials = function (name) {
    var parts = String(name || '?').trim().split(/\s+/);
    return ((parts[0] || '?')[0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  };

  var toastRoot = null;
  U.toast = function (msg, type, ms) {
    toastRoot = toastRoot || U.$('#toast-root');
    if (!toastRoot) return;
    var t = document.createElement('div');
    t.className = 'toast ' + (type || 'info');
    var ic = type === 'success' ? 'checkCircle' : type === 'error' ? 'alert' : 'info';
    t.innerHTML = App.icon(ic) + '<span>' + U.escapeHtml(msg) + '</span>';
    toastRoot.appendChild(t);
    setTimeout(function () {
      t.classList.add('out');
      setTimeout(function () { t.remove(); }, 240);
    }, ms || 2600);
  };

  var scrimHandler = null;
  U.modal = function (html, opts) {
    opts = opts || {};
    var root = U.$('#modal-root');
    root.innerHTML = '<div class="modal-scrim"><div class="modal" role="dialog" aria-modal="true">' + html + '</div></div>';
    document.body.classList.add('no-scroll');
    var scrim = U.$('.modal-scrim', root);
    scrim.addEventListener('click', function (e) {
      if (e.target === scrim) U.closeModal();
    });
    U.$$('[data-close]', root).forEach(function (b) {
      b.addEventListener('click', function () { U.closeModal(); });
    });
    if (opts.onMount) opts.onMount(U.$('.modal', root));
    return U.$('.modal', root);
  };
  U.closeModal = function () {
    var root = U.$('#modal-root');
    if (!root || !root.innerHTML) return;
    root.innerHTML = '';
    document.body.classList.remove('no-scroll');
  };
  U.confirm = function (opts) {
    var o = typeof opts === 'string' ? { message: opts } : (opts || {});
    return new Promise(function (resolve) {
      var m = U.modal(
        '<div class="modal-head"><h3>' + U.escapeHtml(o.title || 'Подтвердите действие') + '</h3>' +
        '<button class="icon-btn sm" data-close="1" aria-label="Закрыть">' + App.icon('x', 'icon-sm') + '</button></div>' +
        '<p class="text-muted mb-0">' + U.escapeHtml(o.message || '') + '</p>' +
        '<div class="modal-foot"><button class="btn btn-ghost" data-cancel>Отмена</button>' +
        '<button class="btn ' + (o.danger ? 'btn-danger' : 'btn-primary') + '" data-ok>' + U.escapeHtml(o.ok || 'Подтвердить') + '</button></div>'
      );
      m.querySelector('[data-ok]').addEventListener('click', function () { U.closeModal(); resolve(true); });
      m.querySelector('[data-cancel]').addEventListener('click', function () { U.closeModal(); resolve(false); });
      m.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { resolve(false); }); });
    });
  };

  U.download = function (filename, text, mime) {
    var blob = new Blob([text], { type: mime || 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  };

  U.hexToRgba = function (hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  };

  U.lighten = function (hex, amt) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    var r = U.clamp(((n >> 16) & 255) + amt, 0, 255);
    var g = U.clamp(((n >> 8) & 255) + amt, 0, 255);
    var b = U.clamp((n & 255) + amt, 0, 255);
    return '#' + [r, g, b].map(function (v) { return v.toString(16).padStart(2, '0'); }).join('');
  };

  U.gradient = function (hex) {
    return 'linear-gradient(135deg, ' + U.lighten(hex, 26) + ', ' + hex + ')';
  };

  U.option = function (val, label, selected) {
    return '<option value="' + U.escapeHtml(val) + '"' + (String(val) === String(selected) ? ' selected' : '') + '>' + U.escapeHtml(label) + '</option>';
  };

  App.utils = U;
})();
