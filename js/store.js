(function () {
  window.App = window.App || {};
  var U = App.utils;
  var KEY = 'ritm_state_v1';
  var S = {};

  S.DEFAULT_CATEGORIES = [
    { id: 'cat_health', name: 'Здоровье', icon: 'heart', color: '#12b886' },
    { id: 'cat_work', name: 'Работа', icon: 'briefcase', color: '#4c6ef5' },
    { id: 'cat_edu', name: 'Образование', icon: 'book', color: '#6c5ce7' },
    { id: 'cat_sport', name: 'Спорт', icon: 'activity', color: '#f6a623' },
    { id: 'cat_food', name: 'Питание', icon: 'apple', color: '#ff8a3d' },
    { id: 'cat_home', name: 'Дом', icon: 'home', color: '#0ea5e9' },
    { id: 'cat_bad', name: 'Вредные привычки', icon: 'ban', color: '#f05252' },
    { id: 'cat_art', name: 'Творчество', icon: 'music', color: '#e64980' },
    { id: 'cat_sleep', name: 'Сон', icon: 'moon', color: '#8b5cf6' }
  ];

  function rng(seed) {
    var s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  function newState() {
    return {
      version: 1,
      theme: 'light',
      navMode: 'bottom',
      auth: { loggedIn: false },
      user: {
        login: 'admin',
        email: 'me@ritm.app',
        name: 'Александр',
        password: 'admin',
        reminders: { push: true, email: false },
        createdAt: U.toISO(new Date())
      },
      categories: S.DEFAULT_CATEGORIES.map(function (c) { return Object.assign({}, c, { custom: false }); }),
      habits: []
    };
  }

  function seedHabits() {
    var r = rng(20261017);
    var today = new Date();
    var start = U.addDays(today, -75);
    var specs = [
      { name: 'Выпить 8 стаканов воды', icon: 'droplet', color: '#0ea5e9', categoryId: 'cat_food', unitLabel: 'стаканов', goal: 8, freq: { type: 'daily' }, reminder: '09:00', miss: 3, pr: 0.82, streak: 0 },
      { name: 'Читать 20 страниц', icon: 'book', color: '#6c5ce7', categoryId: 'cat_edu', unitLabel: 'страниц', goal: 20, freq: { type: 'daily' }, reminder: '21:00', miss: 2, pr: 0.72, streak: 0 },
      { name: 'Утренняя зарядка', icon: 'activity', color: '#f6a623', categoryId: 'cat_sport', unitLabel: 'мин', goal: 15, freq: { type: 'daily' }, reminder: '07:30', miss: 2, pr: 0.8, streak: 31 },
      { name: 'Медитация', icon: 'smile', color: '#12b886', categoryId: 'cat_health', unitLabel: 'мин', goal: 10, freq: { type: 'daily' }, reminder: '22:00', miss: 4, pr: 0.66, streak: 5 },
      { name: 'Без соцсетей до обеда', icon: 'ban', color: '#f05252', categoryId: 'cat_bad', unitLabel: 'мин сэкономлено', goal: 1, freq: { type: 'weekdays', days: [1, 2, 3, 4, 5] }, reminder: '', miss: 4, pr: 0.7, streak: 4 },
      { name: 'Английский язык', icon: 'book', color: '#4c6ef5', categoryId: 'cat_edu', unitLabel: 'урок', goal: 1, freq: { type: 'xPerWeek', timesPerWeek: 3 }, reminder: '19:00', miss: 2, pr: 0.75, streak: 0 },
      { name: 'Сон до 23:30', icon: 'moon', color: '#8b5cf6', categoryId: 'cat_sleep', unitLabel: 'раз', goal: 1, freq: { type: 'daily' }, reminder: '22:45', miss: 3, pr: 0.68, streak: 0 },
      { name: 'Генеральная уборка', icon: 'home', color: '#0ea5e9', categoryId: 'cat_home', unitLabel: 'раз', goal: 1, freq: { type: 'weekdays', days: [6] }, reminder: '11:00', miss: 1, pr: 0.85, streak: 7 }
    ];
    return specs.map(function (sp, idx) {
      var habit = {
        id: 'hab_' + (idx + 1),
        name: sp.name,
        icon: sp.icon,
        color: sp.color,
        categoryId: sp.categoryId,
        unitLabel: sp.unitLabel,
        goal: sp.goal,
        frequency: sp.freq,
        reminder: { enabled: !!sp.reminder, time: sp.reminder || '08:00' },
        missAllowance: sp.miss,
        archived: false,
        createdAt: U.toISO(start),
        completions: {}
      };
      var from = U.diffDays(start, today);
      var weekCount = {};
      for (var i = from; i >= 0; i--) {
        var d = U.addDays(today, -i);
        var iso = U.toISO(d);
        var dowNum = ((d.getDay() + 6) % 7) + 1;
        var f = sp.freq || { type: 'daily' };
        var avail = true;
        if (f.type === 'weekdays') avail = (f.days || []).indexOf(dowNum) >= 0;
        else if (f.type === 'xPerWeek') {
          var wk = U.toISO(U.startOfWeek(d));
          weekCount[wk] = weekCount[wk] || 0;
          avail = weekCount[wk] < (f.timesPerWeek || 3);
        }
        if (!avail) continue;
        var forced = sp.streak > 0 && i < sp.streak;
        var done = forced ? true : (i === 0 ? r() < sp.pr - 0.05 : r() < sp.pr);
        if (done) {
          var val = sp.goal;
          if (!forced && sp.goal > 1 && r() < 0.4) val = Math.max(1, Math.round(sp.goal * (0.45 + r() * 0.5)));
          habit.completions[iso] = val;
          if (f.type === 'xPerWeek') weekCount[U.toISO(U.startOfWeek(d))]++;
        }
      }
      return habit;
    });
  }

  S.state = null;

  S.load = function () {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { raw = null; }
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.habits) { S.state = parsed; S.normalize(); return; }
      } catch (e) { /* ignore corrupt */ }
    }
    S.state = newState();
    S.state.habits = seedHabits();
    S.save();
  };

  S.normalize = function () {
    var st = S.state;
    st.theme = st.theme || 'light';
    st.navMode = st.navMode || 'bottom';
    st.auth = st.auth || { loggedIn: false };
    if (!st.categories || !st.categories.length) st.categories = newState().categories;
    st.habits = st.habits || [];
    st.habits.forEach(function (h) {
      h.completions = h.completions || {};
      h.frequency = h.frequency || { type: 'daily' };
      h.reminder = h.reminder || { enabled: false, time: '08:00' };
      if (h.missAllowance == null) h.missAllowance = 2;
      if (h.goal == null) h.goal = 1;
      if (!h.unitLabel) h.unitLabel = 'раз';
      if (h.archived == null) h.archived = false;
      if (!h.createdAt) h.createdAt = U.todayISO();
    });
  };

  S.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(S.state)); } catch (e) { /* storage may be full */ }
  };

  S.reset = function () {
    S.state = newState();
    S.state.habits = seedHabits();
    S.save();
  };

  S.wipe = function () {
    S.state = newState();
    S.state.habits = [];
    S.save();
  };

  /* ---------- accessors ---------- */
  S.categories = function () { return S.state.categories.slice(); };
  S.category = function (id) { return S.state.categories.filter(function (c) { return c.id === id; })[0] || null; };
  S.habits = function (includeArchived) {
    return S.state.habits.filter(function (h) { return includeArchived ? true : !h.archived; });
  };
  S.allHabits = function () { return S.state.habits.slice(); };
  S.habit = function (id) { return S.state.habits.filter(function (h) { return h.id === id; })[0] || null; };
  S.addHabit = function (data) {
    var h = Object.assign({
      id: U.uid('hab'), icon: 'circleDot', color: '#6c5ce7', categoryId: null,
      unitLabel: 'раз', goal: 1, frequency: { type: 'daily' }, reminder: { enabled: false, time: '08:00' },
      missAllowance: 2, archived: false, createdAt: U.todayISO(), completions: {}
    }, data);
    S.state.habits.push(h);
    S.save();
    return h;
  };
  S.updateHabit = function (id, patch) {
    var h = S.habit(id);
    if (h) { Object.assign(h, patch); S.save(); }
    return h;
  };
  S.deleteHabit = function (id) {
    S.state.habits = S.state.habits.filter(function (h) { return h.id !== id; });
    S.save();
  };
  S.addCategory = function (data) {
    var c = Object.assign({ id: U.uid('cat'), icon: 'tag', color: '#6c5ce7', custom: true }, data);
    S.state.categories.push(c);
    S.save();
    return c;
  };
  S.updateCategory = function (id, patch) {
    var c = S.category(id);
    if (c) { Object.assign(c, patch); S.save(); }
    return c;
  };
  S.deleteCategory = function (id) {
    S.state.categories = S.state.categories.filter(function (c) { return c.id !== id; });
    S.state.habits.forEach(function (h) { if (h.categoryId === id) h.categoryId = null; });
    S.save();
  };
  S.categoryUsage = function (id) {
    return S.state.habits.filter(function (h) { return h.categoryId === id; }).length;
  };

  /* ---------- scheduling ---------- */
  function dow(iso) { var d = U.fromISO(iso); return ((d.getDay() + 6) % 7) + 1; }

  S.isDone = function (habit, iso) {
    var v = habit.completions[iso];
    return v != null && v >= (habit.goal || 1);
  };
  S.value = function (habit, iso) { return habit.completions[iso] || 0; };
  S.setValue = function (habit, iso, value) {
    if (value > 0) habit.completions[iso] = value;
    else delete habit.completions[iso];
    S.save();
  };
  S.toggle = function (habit, iso) {
    if (S.isDone(habit, iso)) S.setValue(habit, iso, 0);
    else S.setValue(habit, iso, habit.goal || 1);
    return S.isDone(habit, iso);
  };

  S.weeklyDoneCount = function (habit, iso) {
    var start = U.startOfWeek(iso);
    var c = 0;
    for (var i = 0; i < 7; i++) if (S.isDone(habit, U.toISO(U.addDays(start, i)))) c++;
    return c;
  };

  S.isRequired = function (habit, iso) {
    if (iso < habit.createdAt) return false;
    var f = habit.frequency || { type: 'daily' };
    if (f.type === 'daily') return true;
    if (f.type === 'weekdays') return (f.days || []).indexOf(dow(iso)) >= 0;
    var target = f.timesPerWeek || 3;
    var start = U.startOfWeek(iso);
    var doneBefore = 0;
    var cursor = new Date(start);
    while (U.toISO(cursor) < iso) {
      if (S.isDone(habit, U.toISO(cursor))) doneBefore++;
      cursor = U.addDays(cursor, 1);
    }
    var need = target - doneBefore;
    if (need <= 0) return false;
    var idx = (U.fromISO(iso).getDay() + 6) % 7;
    var remainingInclusive = 7 - idx;
    return remainingInclusive <= need;
  };

  S.isAvailable = function (habit, iso) {
    if (iso < habit.createdAt) return false;
    var f = habit.frequency || { type: 'daily' };
    if (f.type === 'daily') return true;
    if (f.type === 'weekdays') return (f.days || []).indexOf(dow(iso)) >= 0;
    return S.weeklyDoneCount(habit, iso) < (f.timesPerWeek || 3);
  };

  S.availableHabits = function (iso) {
    return S.state.habits.filter(function (h) { return !h.archived && S.isAvailable(h, iso); });
  };

  S.freqLabel = function (habit) {
    var f = habit.frequency || { type: 'daily' };
    if (f.type === 'daily') return 'Ежедневно';
    if (f.type === 'weekdays') {
      var days = f.days || [];
      if (days.length === 7) return 'Ежедневно';
      if (days.length === 5 && days.every(function (d) { return d <= 5; })) return 'По будням';
      return days.slice().sort().map(function (d) { return U.DOW[d - 1]; }).join(', ');
    }
    return U.times(f.timesPerWeek || 3) + ' в неделю';
  };

  /* ---------- stats ---------- */
  S.currentStreak = function (habit, refIso) {
    refIso = refIso || U.todayISO();
    var today = U.todayISO();
    var streak = 0;
    var d = U.fromISO(refIso);
    var guard = 0;
    while (guard++ < 500) {
      var iso = U.toISO(d);
      if (iso < habit.createdAt) break;
      if (S.isRequired(habit, iso)) {
        if (S.isDone(habit, iso)) {
          streak++;
        } else if (iso !== today) {
          break;
        }
      }
      d = U.addDays(d, -1);
    }
    return streak;
  };

  S.bestStreak = function (habit) {
    var best = 0, run = 0;
    var today = U.todayISO();
    var d = U.fromISO(habit.createdAt);
    var guard = 0;
    while (guard++ < 900) {
      var iso = U.toISO(d);
      if (iso > today) break;
      if (S.isRequired(habit, iso)) {
        if (S.isDone(habit, iso)) { run++; if (run > best) best = run; }
        else if (iso !== today) { run = 0; }
      }
      d = U.addDays(d, 1);
    }
    return best;
  };

  S.rate = function (habit, days, refIso) {
    refIso = refIso || U.todayISO();
    var d = U.fromISO(refIso);
    var required = 0, done = 0;
    for (var i = 0; i < days; i++) {
      var iso = U.toISO(d);
      if (iso >= habit.createdAt && S.isRequired(habit, iso)) {
        required++;
        if (S.isDone(habit, iso)) done++;
      }
      d = U.addDays(d, -1);
    }
    return required ? Math.round((done / required) * 100) : 0;
  };

  S.weekStatus = function (habit, refIso) {
    var start = U.startOfWeek(refIso || U.todayISO());
    var today = U.todayISO();
    var out = [];
    for (var i = 0; i < 7; i++) {
      var d = U.addDays(start, i);
      var iso = U.toISO(d);
      out.push({
        iso: iso, label: U.DOW[i], future: iso > today,
        required: S.isRequired(habit, iso), done: S.isDone(habit, iso)
      });
    }
    return out;
  };

  S.missesInMonth = function (habit, refIso) {
    refIso = refIso || U.todayISO();
    var ref = U.fromISO(refIso);
    var today = U.todayISO();
    var first = new Date(ref.getFullYear(), ref.getMonth(), 1);
    var used = 0;
    var d = first;
    while (U.toISO(d) <= refIso) {
      var iso = U.toISO(d);
      if (iso >= habit.createdAt && S.isRequired(habit, iso) && !S.isDone(habit, iso)) used++;
      d = U.addDays(d, 1);
    }
    return used;
  };

  S.dayStats = function (iso) {
    var habits = S.availableHabits(iso);
    var total = habits.length;
    var done = habits.filter(function (h) { return S.isDone(h, iso); }).length;
    var required = habits.filter(function (h) { return S.isRequired(h, iso); }).length;
    var requiredDone = habits.filter(function (h) { return S.isRequired(h, iso) && S.isDone(h, iso); }).length;
    return {
      iso: iso, total: total, done: done,
      ratio: total ? done / total : 0,
      required: required, requiredDone: requiredDone,
      requiredRatio: required ? requiredDone / required : (total ? done / total : 0)
    };
  };

  S.todayStats = function () { return S.dayStats(U.todayISO()); };

  S.heatmap = function (fromIso, toIso) {
    var out = [];
    var d = U.fromISO(fromIso);
    var end = U.fromISO(toIso);
    var today = U.todayISO();
    while (d <= end) {
      var iso = U.toISO(d);
      var st = S.dayStats(iso);
      out.push({ iso: iso, ratio: iso > today ? -1 : st.ratio, done: st.done, total: st.total });
      d = U.addDays(d, 1);
    }
    return out;
  };

  S.series = function (days, refIso) {
    refIso = refIso || U.todayISO();
    var out = [];
    var d = U.fromISO(refIso);
    for (var i = days - 1; i >= 0; i--) {
      var day = U.addDays(d, -i);
      var iso = U.toISO(day);
      var st = S.dayStats(iso);
      out.push({ iso: iso, label: U.fmtShort(day), value: st.ratio * 100, done: st.done, total: st.total });
    }
    return out;
  };

  S.categoryBreakdown = function (days) {
    var since = U.toISO(U.addDays(new Date(), -(days || 30)));
    var map = {};
    S.state.categories.forEach(function (c) { map[c.id] = 0; });
    map['__none'] = 0;
    S.state.habits.forEach(function (h) {
      Object.keys(h.completions).forEach(function (iso) {
        if (iso >= since && S.isDone(h, iso)) {
          var k = h.categoryId && map[h.categoryId] != null ? h.categoryId : '__none';
          map[k] = (map[k] || 0) + 1;
        }
      });
    });
    var out = [];
    S.state.categories.forEach(function (c) { if (map[c.id]) out.push({ id: c.id, name: c.name, color: c.color, value: map[c.id] }); });
    if (map['__none']) out.push({ id: '__none', name: 'Без категории', color: '#94a3b8', value: map['__none'] });
    out.sort(function (a, b) { return b.value - a.value; });
    return out;
  };

  S.overallStats = function () {
    var today = U.todayISO();
    var totalDone = 0;
    var dayCount = {};
    var activeDays = {};
    var maxStreak = 0;
    var firstIso = today;
    S.state.habits.forEach(function (h) {
      if (h.createdAt < firstIso) firstIso = h.createdAt;
      if (S.currentStreak(h) > maxStreak) maxStreak = S.currentStreak(h);
      Object.keys(h.completions).forEach(function (iso) {
        if (S.isDone(h, iso)) {
          totalDone++;
          dayCount[iso] = (dayCount[iso] || 0) + 1;
          activeDays[iso] = true;
        }
      });
    });
    var bestDay = null;
    Object.keys(dayCount).forEach(function (iso) {
      if (!bestDay || dayCount[iso] > dayCount[bestDay]) bestDay = iso;
    });
    var weekTotals = {}, monthTotals = {};
    Object.keys(dayCount).forEach(function (iso) {
      var wk = U.toISO(U.startOfWeek(iso));
      weekTotals[wk] = (weekTotals[wk] || 0) + dayCount[iso];
      var mk = iso.slice(0, 7);
      monthTotals[mk] = (monthTotals[mk] || 0) + dayCount[iso];
    });
    var bestWeek = null, bestMonth = null;
    Object.keys(weekTotals).forEach(function (k) { if (!bestWeek || weekTotals[k] > weekTotals[bestWeek]) bestWeek = k; });
    Object.keys(monthTotals).forEach(function (k) { if (!bestMonth || monthTotals[k] > monthTotals[bestMonth]) bestMonth = k; });

    var ranked = S.state.habits.map(function (h) {
      return { habit: h, rate30: S.rate(h, 30), streak: S.currentStreak(h), best: S.bestStreak(h) };
    }).sort(function (a, b) { return b.rate30 - a.rate30 || b.streak - a.streak; });

    var perfect = 0;
    Object.keys(activeDays).forEach(function (iso) {
      var st = S.dayStats(iso);
      if (st.required > 0 && st.requiredDone === st.required) perfect++;
    });

    return {
      totalDone: totalDone,
      activeDaysCount: Object.keys(activeDays).length,
      totalDaysTracked: U.diffDays(firstIso, today) + 1,
      firstIso: firstIso,
      bestDay: bestDay, bestDayCount: bestDay ? dayCount[bestDay] : 0,
      bestWeek: bestWeek, bestWeekCount: bestWeek ? weekTotals[bestWeek] : 0,
      bestMonth: bestMonth, bestMonthCount: bestMonth ? monthTotals[bestMonth] : 0,
      maxStreak: maxStreak, ranked: ranked, perfectDays: perfect,
      activeHabits: S.state.habits.filter(function (h) { return !h.archived; }).length,
      archivedHabits: S.state.habits.filter(function (h) { return h.archived; }).length
    };
  };

  S.benefits = function (days) {
    days = days || 30;
    var since = U.toISO(U.addDays(new Date(), -(days - 1)));
    var totals = {};
    S.state.habits.forEach(function (h) {
      Object.keys(h.completions).forEach(function (iso) {
        if (iso >= since && S.isDone(h, iso)) {
          var key = h.unitLabel || 'раз';
          totals[key] = (totals[key] || 0) + (h.completions[iso] || 0);
        }
      });
    });
    var out = [];
    Object.keys(totals).forEach(function (unit) {
      var val = totals[unit];
      var u = unit.toLowerCase();
      if (u.indexOf('страниц') >= 0) {
        out.push({ icon: 'book', color: '#6c5ce7', value: U.fmtNum(val), unit: 'страниц', text: 'за месяц — это примерно ' + U.fmtNum(Math.max(1, val / 250)) + ' ' + U.plural(Math.max(1, Math.round(val / 250)), ['книга', 'книги', 'книг']) });
      } else if (u.indexOf('стакан') >= 0) {
        out.push({ icon: 'droplet', color: '#0ea5e9', value: U.fmtNum(val), unit: 'стаканов воды', text: 'за месяц — около ' + U.fmtNum(val * 0.25) + ' л' });
      } else if (u.indexOf('мин сэкономлено') >= 0) {
        out.push({ icon: 'clock', color: '#12b886', value: U.fmtNum(val), unit: 'минут сэкономлено', text: 'это ' + U.fmtNum(val / 60) + ' ч на важное' });
      } else if (u.indexOf('мин') >= 0) {
        out.push({ icon: 'activity', color: '#f6a623', value: U.fmtNum(val), unit: 'минут практики', text: 'за месяц внимания к себе' });
      } else if (u.indexOf('урок') >= 0) {
        out.push({ icon: 'book', color: '#4c6ef5', value: U.fmtNum(val), unit: 'уроков', text: 'регулярные занятия языком' });
      } else {
        out.push({ icon: 'checkCircle', color: '#6c5ce7', value: U.fmtNum(val), unit: unit, text: 'за последние ' + U.days(days) });
      }
    });
    return out.slice(0, 4);
  };

  S.compareYesterday = function () {
    var today = S.dayStats(U.todayISO());
    var y = S.dayStats(U.toISO(U.addDays(new Date(), -1)));
    return { today: today, yesterday: y, delta: today.done - y.done };
  };

  S.exportData = function () { return JSON.stringify(S.state, null, 2); };
  S.importData = function (json) {
    var parsed = JSON.parse(json);
    if (!parsed || !parsed.habits) throw new Error('Неверный формат файла');
    S.state = parsed;
    S.normalize();
    S.save();
  };

  S.login = function (login, password) {
    var u = S.state.user;
    if ((login === u.login || login === u.email) && password === u.password) {
      S.state.auth.loggedIn = true;
      S.save();
      return true;
    }
    return false;
  };
  S.logout = function () { S.state.auth.loggedIn = false; S.save(); };

  App.Store = S;
})();
