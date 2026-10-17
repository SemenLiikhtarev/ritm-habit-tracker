(function () {
  window.App = window.App || {};
  var U = App.utils;
  var I = App.icon;
  var C = {};

  C.PRIMARY_NAV = [
    { href: '#/today', label: 'Сегодня', icon: 'checkCircle', short: 'Сегодня' },
    { href: '#/habits', label: 'Привычки', icon: 'list', short: 'Привычки' },
    { href: '#/calendar', label: 'Календарь', icon: 'calendar', short: 'Календарь' },
    { href: '#/stats', label: 'Статистика', icon: 'chart', short: 'Статистика' },
    { href: '#/categories', label: 'Категории', icon: 'tag', short: 'Категории' }
  ];
  C.BOTTOM_NAV = [
    { href: '#/today', label: 'Сегодня', icon: 'checkCircle' },
    { href: '#/habits', label: 'Привычки', icon: 'list' },
    { fab: true },
    { href: '#/calendar', label: 'Календарь', icon: 'calendar' },
    { href: '#/stats', label: 'Статистика', icon: 'chart' }
  ];

  var HABIT_ICONS = ['circleDot', 'checkCircle', 'flame', 'zap', 'target', 'star', 'trophy', 'heart', 'activity', 'dumbbell', 'droplet', 'apple', 'coffee', 'book', 'music', 'palette', 'briefcase', 'home', 'moon', 'sun', 'smile', 'bed', 'clock', 'wallet', 'gift', 'shield', 'ban', 'sparkles', 'users', 'tag', 'repeat', 'play'];
  var CAT_ICONS = ['tag', 'heart', 'briefcase', 'book', 'activity', 'apple', 'home', 'ban', 'music', 'moon', 'smile', 'target', 'star', 'wallet', 'users', 'gift', 'shield', 'coffee'];
  C.HABIT_ICONS = HABIT_ICONS;
  C.CAT_ICONS = CAT_ICONS;

  C.brand = function (tag) {
    return '<a class="brand" href="#/">' +
      '<span class="brand-mark"><img class="brand-logo" src="assets/logo_ritm.jpeg" alt="" width="40" height="40"></span>' +
      '<span class="brand-text"><span class="brand-name">Ритм</span>' + (tag === false ? '' : '<span class="brand-sub">личный трекер привычек</span>') + '</span>' +
      '</a>';
  };

  C.navLink = function (item, active) {
    return '<a class="nav-link' + (active === item.href ? ' is-active' : '') + '" href="' + item.href + '">' +
      I(item.icon) + '<span>' + item.label + '</span></a>';
  };

  C.sidebar = function (active) {
    var st = App.Store.state;
    var nav = C.PRIMARY_NAV.map(function (i) { return C.navLink(i, active); }).join('');
    return '<aside class="sidebar">' +
      C.brand() +
      '<nav class="nav"><div class="nav-label">Главное</div>' + nav + '</nav>' +
      '<nav class="nav"><div class="nav-label">Аккаунт</div>' +
        C.navLink({ href: '#/profile', label: 'Профиль и настройки', icon: 'settings' }, active) +
      '</nav>' +
      '<div class="sidebar-foot">' +
        '<div class="sidebar-card">' +
          '<div class="row-between mb-1"><strong>Приватный режим</strong>' + I('shield', 'icon-sm text-muted') + '</div>' +
          '<div class="text-muted" style="font-size:.8rem">Трекер создан только для меня. Регистрация других недоступна.</div>' +
        '</div>' +
        '<button class="btn btn-ghost btn-block" data-action="theme-toggle">' + C.themeIcon() + '<span data-theme-label>Тёмная тема</span></button>' +
      '</div>' +
      '</aside>';
  };

  C.themeIcon = function () {
    return App.Store.state.theme === 'dark' ? I('sun') : I('moon');
  };

  C.drawer = function (active) {
    var nav = C.PRIMARY_NAV.map(function (i) { return C.navLink(i, active); }).join('');
    return '<div class="drawer-scrim" data-action="drawer-close"></div>' +
      '<aside class="drawer" role="dialog" aria-label="Меню">' +
        '<div class="drawer-head">' + C.brand() + '<button class="icon-btn sm" data-action="drawer-close" aria-label="Закрыть">' + I('x', 'icon-sm') + '</button></div>' +
        '<nav class="nav">' + nav + '</nav>' +
        '<div class="divider"></div>' +
        '<nav class="nav">' +
          C.navLink({ href: '#/profile', label: 'Профиль и настройки', icon: 'settings' }, active) +
          '<a class="nav-link" href="#/login" data-action="logout">' + I('logout') + '<span>Выйти</span></a>' +
        '</nav>' +
        '<div class="sidebar-foot">' +
          '<button class="btn btn-ghost btn-block" data-action="theme-toggle">' + C.themeIcon() + '<span data-theme-label>Тёмная тема</span></button>' +
        '</div>' +
      '</aside>';
  };

  C.topbar = function (title, sub) {
    var u = App.Store.state.user;
    return '<header class="topbar">' +
      '<button class="icon-btn" id="burger" data-action="drawer-open" aria-label="Открыть меню">' + I('menu') + '</button>' +
      '<div class="grow"><h1>' + U.escapeHtml(title) + '</h1>' + (sub ? '<div class="page-sub">' + U.escapeHtml(sub) + '</div>' : '') + '</div>' +
      '<div class="topbar-actions">' +
        '<button class="icon-btn" data-action="theme-toggle" aria-label="Сменить тему" title="Сменить тему">' + C.themeIcon() + '</button>' +
        '<button class="btn btn-primary" data-action="quick-add">' + I('plus') + '<span class="hide-xs">Добавить</span></button>' +
        '<div class="dropdown" data-dropdown>' +
          '<button class="icon-btn" data-action="dropdown" aria-label="Профиль">' + I('user') + '</button>' +
          '<div class="dropdown-menu hidden" data-menu>' +
            '<div class="row" style="padding:.4rem .7rem"><span class="avatar">' + U.initials(u.name) + '</span><div class="grow"><strong style="display:block;font-size:.9rem">' + U.escapeHtml(u.name) + '</strong><span class="text-muted" style="font-size:.75rem">' + U.escapeHtml(u.email) + '</span></div></div>' +
            '<div class="divider" style="margin:.3rem 0"></div>' +
            '<a href="#/profile">' + I('settings', 'icon-sm') + 'Профиль и настройки</a>' +
            '<button data-action="theme-toggle">' + I('moon', 'icon-sm') + 'Сменить тему</button>' +
            '<button class="danger" data-action="logout">' + I('logout', 'icon-sm') + 'Выйти</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</header>';
  };

  C.bottomnav = function (active) {
    var st = App.Store.state;
    var items = C.BOTTOM_NAV.map(function (i) {
      if (i.fab) return '<div class="fab-slot"><button class="bottomnav-fab" data-action="quick-add" aria-label="Добавить привычку">' + I('plus', 'icon-lg') + '</button></div>';
      return '<a href="' + i.href + '" class="' + (active === i.href ? 'is-active' : '') + '">' + I(i.icon) + '<span>' + i.label + '</span></a>';
    }).join('');
    return '<nav class="bottomnav" data-enabled="' + (st.navMode === 'bottom' ? 'true' : 'false') + '">' + items + '</nav>';
  };

  C.appShell = function (active, title, sub, contentHtml) {
    var st = App.Store.state;
    document.body.classList.toggle('has-bottomnav', st.navMode === 'bottom');
    return '<div class="shell">' +
      C.sidebar(active) +
      '<div class="main" id="main">' +
        C.topbar(title, sub) +
        '<div class="container">' + contentHtml + '</div>' +
        '<footer class="app-foot">Ритм · личный трекер привычек · данные хранятся только на этом устройстве</footer>' +
      '</div>' +
    '</div>' +
    C.bottomnav(active);
  };

  C.themeLabelUpdate = function () {
    var dark = App.Store.state.theme === 'dark';
    U.$$('[data-theme-label]').forEach(function (el) { el.textContent = dark ? 'Светлая тема' : 'Тёмная тема'; });
  };

  /* ---------- pickers ---------- */
  C.iconPicker = function (id, name, selected) {
    return '<div class="icon-grid" data-picker="' + id + '">' + name.map(function (n) {
      return '<button type="button" class="icon-pick' + (n === selected ? ' is-active' : '') + '" data-icon="' + n + '" aria-label="' + n + '">' + I(n) + '</button>';
    }).join('') + '</div>';
  };

  C.colorPicker = function (id, selected) {
    return '<div class="swatch-row" data-picker="' + id + '">' + U.PALETTE.map(function (c) {
      return '<button type="button" class="swatch' + (c === selected ? ' is-active' : '') + '" data-color="' + c + '" style="background:' + U.gradient(c) + '" aria-label="' + c + '">' + (c === selected ? I('check', 'icon-sm') : '') + '</button>';
    }).join('') + '</div>';
  };

  C.wirePicker = function (root, kind, attr) {
    U.$$('[data-picker]', root).forEach(function (wrap) {
      wrap.addEventListener('click', function (e) {
        var btn = e.target.closest('[' + attr + ']');
        if (!btn || !wrap.contains(btn)) return;
        U.$$('[' + attr + ']', wrap).forEach(function (b) { b.classList.remove('is-active'); b.innerHTML = b.innerHTML.replace(I('check', 'icon-sm'), ''); });
        btn.classList.add('is-active');
        if (kind === 'color') btn.innerHTML = I('check', 'icon-sm');
      });
    });
  };

  C.pickerValue = function (root, id, attr) {
    var el = root.querySelector('[data-picker="' + id + '"] [data-' + attr + '].is-active');
    return el ? el.getAttribute('data-' + attr) : null;
  };

  /* ---------- habit form ---------- */
  C.habitForm = function (habit) {
    var h = habit || {};
    var freq = h.frequency || { type: 'daily', days: [1, 2, 3, 4, 5], timesPerWeek: 3 };
    var days = freq.days || [1, 2, 3, 4, 5];
    var cats = App.Store.categories();
    var catOpts = '<option value="">Без категории</option>' + cats.map(function (c) {
      return U.option(c.id, c.name, h.categoryId || '');
    }).join('');
    var daysChips = U.DOW.map(function (d, i) {
      var on = days.indexOf(i + 1) >= 0;
      return '<button type="button" class="chip' + (on ? ' is-active' : '') + '" data-day="' + (i + 1) + '">' + d + '</button>';
    }).join('');
    return '' +
      '<div class="field"><label for="h-name">Название привычки</label>' +
        '<input class="input" id="h-name" data-f="name" maxlength="60" placeholder="Например, выпить стакан воды" value="' + U.escapeHtml(h.name || '') + '"></div>' +
      '<div class="field-row">' +
        '<div class="field"><label for="h-cat">Категория</label><select class="select" id="h-cat" data-f="categoryId">' + catOpts + '</select></div>' +
        '<div class="field"><label for="h-miss">Пропусков в месяц</label><select class="select" id="h-miss" data-f="missAllowance">' +
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 10].map(function (n) { return U.option(n, n === 0 ? 'Без поблажек' : n, h.missAllowance == null ? 2 : h.missAllowance); }).join('') +
        '</select></div>' +
      '</div>' +
      '<div class="field"><label>Периодичность</label>' +
        '<div class="segmented" data-freq>' +
          ['daily|Ежедневно', 'weekdays|По дням', 'xPerWeek|X раз в неделю'].map(function (o) {
            var p = o.split('|');
            return '<button type="button" data-ftype="' + p[0] + '" class="' + (freq.type === p[0] ? 'is-active' : '') + '">' + p[1] + '</button>';
          }).join('') +
        '</div>' +
        '<div class="mt-2' + (freq.type === 'weekdays' ? '' : ' hidden') + '" data-fblock="weekdays"><div class="row wrap" data-days>' + daysChips + '</div></div>' +
        '<div class="mt-2' + (freq.type === 'xPerWeek' ? '' : ' hidden') + '" data-fblock="xPerWeek"><div class="field-row"><div class="field"><label for="h-times">Сколько раз в неделю</label>' +
          '<input class="input" id="h-times" type="number" min="1" max="7" data-f="timesPerWeek" value="' + (freq.timesPerWeek || 3) + '"></div></div></div>' +
      '</div>' +
      '<div class="field-row">' +
        '<div class="field"><label for="h-unit">Единица измерения</label><input class="input" id="h-unit" data-f="unitLabel" placeholder="раз, мин, страниц" value="' + U.escapeHtml(h.unitLabel || 'раз') + '"></div>' +
        '<div class="field"><label for="h-goal">Цель за день</label><input class="input" id="h-goal" type="number" min="1" max="9999" data-f="goal" value="' + (h.goal || 1) + '"></div>' +
      '</div>' +
      '<div class="field"><label>Напоминание</label>' +
        '<div class="row-between" style="gap:.75rem">' +
          '<label class="switch"><input type="checkbox" data-f="reminderOn"' + (h.reminder && h.reminder.enabled ? ' checked' : '') + '><span class="track"></span><span>Включить пуш-напоминание</span></label>' +
          '<input class="input" type="time" data-f="reminderTime" style="max-width:140px" value="' + ((h.reminder && h.reminder.time) || '08:00') + '">' +
        '</div></div>' +
      '<div class="field"><label>Иконка</label>' + C.iconPicker('h-icon', HABIT_ICONS, h.icon || 'circleDot') + '</div>' +
      '<div class="field"><label>Цвет</label>' + C.colorPicker('h-color', h.color || '#6c5ce7') + '</div>';
  };

  C.wireHabitForm = function (root, habit) {
    var freq = (habit && habit.frequency) || { type: 'daily' };
    var seg = root.querySelector('[data-freq]');
    if (seg) {
      seg.addEventListener('click', function (e) {
        var b = e.target.closest('[data-ftype]');
        if (!b) return;
        U.$$('[data-ftype]', seg).forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        var t = b.getAttribute('data-ftype');
        U.$$('[data-fblock]', root).forEach(function (fb) { fb.classList.toggle('hidden', fb.getAttribute('data-fblock') !== t); });
      });
    }
    var daysWrap = root.querySelector('[data-days]');
    if (daysWrap) daysWrap.addEventListener('click', function (e) {
      var b = e.target.closest('[data-day]');
      if (b) b.classList.toggle('is-active');
    });
    C.wirePicker(root, 'icon', 'data-icon');
    C.wirePicker(root, 'color', 'data-color');
    return function read() {
      var v = function (f) { var el = root.querySelector('[data-f="' + f + '"]'); return el ? el.value : ''; };
      var type = (root.querySelector('[data-ftype].is-active') || { getAttribute: function () { return 'daily'; } }).getAttribute('data-ftype');
      var dayList = U.$$('[data-days] [data-day].is-active', root).map(function (b) { return Number(b.getAttribute('data-day')); });
      var name = (v('name') || '').trim();
      if (!name) return { error: 'Укажите название привычки', field: 'name' };
      if (type === 'weekdays' && !dayList.length) return { error: 'Выберите хотя бы один день недели' };
      var goal = Math.max(1, parseInt(v('goal'), 10) || 1);
      var times = Math.min(7, Math.max(1, parseInt(v('timesPerWeek'), 10) || 3));
      return {
        data: {
          name: name,
          categoryId: v('categoryId') || null,
          unitLabel: (v('unitLabel') || 'раз').trim() || 'раз',
          goal: goal,
          missAllowance: parseInt(v('missAllowance'), 10) || 0,
          frequency: type === 'daily' ? { type: 'daily' } : type === 'weekdays' ? { type: 'weekdays', days: dayList } : { type: 'xPerWeek', timesPerWeek: times },
          reminder: { enabled: root.querySelector('[data-f="reminderOn"]').checked, time: v('reminderTime') || '08:00' },
          icon: C.pickerValue(root, 'h-icon', 'icon') || 'circleDot',
          color: C.pickerValue(root, 'h-color', 'color') || '#6c5ce7'
        }
      };
    };
  };

  /* ---------- category form ---------- */
  C.categoryForm = function (cat) {
    var c = cat || {};
    return '' +
      '<div class="field"><label for="c-name">Название категории</label>' +
        '<input class="input" id="c-name" data-f="name" maxlength="40" placeholder="Например, Финансы" value="' + U.escapeHtml(c.name || '') + '"></div>' +
      '<div class="field"><label>Иконка</label>' + C.iconPicker('c-icon', CAT_ICONS, c.icon || 'tag') + '</div>' +
      '<div class="field"><label>Цвет</label>' + C.colorPicker('c-color', c.color || '#6c5ce7') + '</div>';
  };

  C.wireCategoryForm = function (root) {
    C.wirePicker(root, 'icon', 'data-icon');
    C.wirePicker(root, 'color', 'data-color');
    return function read() {
      var name = (root.querySelector('[data-f="name"]').value || '').trim();
      if (!name) return { error: 'Укажите название категории' };
      return { data: { name: name, icon: C.pickerValue(root, 'c-icon', 'icon') || 'tag', color: C.pickerValue(root, 'c-color', 'color') || '#6c5ce7' } };
    };
  };

  /* ---------- habit render helpers ---------- */
  C.habitIcon = function (habit, size) {
    var st = 'width:' + (size || 44) + 'px;height:' + (size || 44) + 'px;border-radius:' + Math.round((size || 44) / 3.4) + 'px;background:' + U.gradient(habit.color);
    return '<span class="habit-icon" style="' + st + '">' + I(habit.icon) + '</span>';
  };

  C.streakBadge = function (habit) {
    var s = App.Store.currentStreak(habit);
    if (!s) return '<span class="badge badge-outline">' + I('flame') + '0</span>';
    return '<span class="badge badge-flame">' + I('flame') + s + '</span>';
  };

  C.habitRow = function (habit, iso, opts) {
    opts = opts || {};
    var done = App.Store.isDone(habit, iso);
    var cat = App.Store.category(habit.categoryId);
    var value = App.Store.value(habit, iso);
    var meta = [];
    if (cat) meta.push('<span style="color:' + cat.color + ';font-weight:700">' + U.escapeHtml(cat.name) + '</span>');
    meta.push('Цель: ' + habit.goal + ' ' + U.escapeHtml(habit.unitLabel));
    if (habit.reminder && habit.reminder.enabled) meta.push(I('bell', 'icon-sm') + ' ' + habit.reminder.time);
    meta.push(App.Store.freqLabel(habit));
    return '<div class="habit-row' + (done ? ' is-done' : '') + '" data-habit="' + habit.id + '" data-date="' + iso + '">' +
      C.habitIcon(habit) +
      '<div class="habit-body">' +
        '<div class="habit-name"><span class="txt">' + U.escapeHtml(habit.name) + '</span>' + C.streakBadge(habit) + '</div>' +
        '<div class="habit-meta">' + meta.join('<span class="text-muted">·</span>') + (value > 0 && !done ? '<span class="text-muted">·</span><span>отмечено ' + value + '</span>' : '') + '</div>' +
      '</div>' +
      '<button type="button" class="check-round' + (done ? ' is-done' : '') + '" data-action="toggle-habit" aria-label="Отметить выполнение"' + (opts.disabled ? ' disabled' : '') + '>' + I('check') + '</button>' +
    '</div>';
  };

  App.Components = C;
})();
