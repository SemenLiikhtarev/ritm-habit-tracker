(function () {
  window.App = window.App || {};
  var U = App.utils;
  var I = App.icon;
  var C = App.Components;
  var Ch = App.charts;
  var Store = App.Store;
  var P = {};

  function esc(s) { return U.escapeHtml(s); }

  function greeting() {
    var h = new Date().getHours();
    if (h < 5) return 'Доброй ночи';
    if (h < 12) return 'Доброе утро';
    if (h < 18) return 'Добрый день';
    return 'Добрый вечер';
  }

  function statCard(icon, color, value, label, stat) {
    return '<div class="card stat-card' + (stat ? ' is-clickable' : '') + '"' + (stat ? ' data-stat="' + stat + '" role="button" tabindex="0"' : '') + '>' +
      '<span class="stat-icon" style="background:' + U.hexToRgba(color, .16) + ';color:' + color + '">' + I(icon) + '</span>' +
      '<span class="stat-value">' + value + '</span><span class="stat-label">' + esc(label) + '</span></div>';
  }

  /* =================== LANDING =================== */
  P.landing = function () {
    var logged = Store.state.auth.loggedIn;
    var openHref = logged ? '#/today' : '#/login';
    var nav = [
      { label: 'Как это работает', href: '#how', action: 'how-it-works' },
      { label: 'Возможности', href: '#features' },
      { label: 'Дашборд', href: '#dashboard' },
      { label: 'Преимущества', href: '#advantages' }
    ].map(function (n) {
      return '<a href="' + n.href + '"' + (n.action ? ' data-action="' + n.action + '"' : '') + '>' + n.label + '</a>';
    }).join('');

    var steps = [
      ['Добавляю привычку', 'Создаю привычку за 20 секунд: название, иконка, цвет, периодичность и напоминание.'],
      ['Отмечаю каждый день', 'Ставлю галочки на дашборде за текущий и прошлые дни — ничего не забуду.'],
      ['Слежу за серией', 'Огненный стрик не даёт сорваться. «30 дней подряд!» — это про меня.']
    ].map(function (s) {
      return '<div class="step"><div class="step-num"></div><h3>' + s[0] + '</h3><p class="text-muted">' + s[1] + '</p></div>';
    }).join('');

    var features = [
      ['checkCircle', '#6c5ce7', 'Дашборд «Сегодня»', 'Приветствие, прогресс-бар «выполнено X из Y» и список привычек с чекбоксами.'],
      ['flame', '#ff6b6b', 'Стрики и серии', 'Крупные цифры и огоньки: текущая и лучшая серия, неделя 7/7.'],
      ['calendarCheck', '#0ea5e9', 'Календарь и хитмап', 'Тепловая карта выполнения, отметки и исправления за прошлые дни.'],
      ['chart', '#f6a623', 'Статистика в виде пользы', '«320 страниц — это 2 книги», «40 стаканов воды», «сэкономлено 500 минут».'],
      ['tag', '#12b886', 'Категории', 'Здоровье, спорт, работа, питание, сон и свои собственные категории.'],
      ['bell', '#8b5cf6', 'Напоминания', 'Пуши в нужное время, чтобы привычка не выпадала из дня.']
    ].map(function (f) {
      return '<div class="feature"><span class="feature-icon" style="background:' + U.gradient(f[1]) + '">' + I(f[0]) + '</span>' +
        '<h3>' + f[2] + '</h3><p>' + f[3] + '</p></div>';
    }).join('');

    var advantages = [
      ['lock', 'Только для меня', 'Это личный трекер. Регистрация для других закрыта — данные не делятся ни с кем.'],
      ['trendingUp', 'Дисциплина по дням', 'Мягкие сравнения «сегодня лучше, чем вчера» мотивируют без давления.'],
      ['shield', 'Данные на устройстве', 'Прогресс хранится локально. Никаких серверов и лишних глаз.'],
      ['sun', 'Светлая и тёмная тема', 'Переключаю тему в настройках под любое настроение и время суток.']
    ].map(function (a) {
      return '<div class="advantage"><span class="icon-lead" style="background:' + U.hexToRgba('#12b886', .15) + ';color:#12b886">' + I(a[0]) + '</span>' +
        '<div><strong>' + a[1] + '</strong><p class="text-muted">' + a[2] + '</p></div></div>';
    }).join('');

    return {
      public: true,
      content: '' +
      '<div class="landing">' +
        '<header class="landing-nav">' + C.brand() +
          '<nav class="nav-links">' + nav + '</nav>' +
          '<div class="landing-actions">' +
            '<button class="icon-btn" data-action="theme-toggle" aria-label="Тема">' + C.themeIcon() + '</button>' +
            '<a class="btn btn-ghost hide-xs" href="#/login">Войти</a>' +
            '<a class="btn btn-primary" href="' + openHref + '">Открыть трекер</a>' +
            '<button class="icon-btn landing-menu-btn" data-action="landing-menu" aria-label="Меню">' + I('menu') + '</button>' +
          '</div>' +
        '</header>' +

        '<section class="hero" id="hero"><div class="hero-grid">' +
          '<div>' +
            '<span class="hero-badge">' + I('shield', 'icon-sm') + 'Приватный трекер — только для меня</span>' +
            '<h1>Выстраиваю дисциплину <span style="color:var(--primary)">каждый день</span></h1>' +
            '<p class="lead">Ритм — мой личный трекер привычек. Помогает укреплять полезные привычки, держать серии и видеть прогресс в понятных цифрах. Никакой регистрации для других — это пространство только для меня.</p>' +
            '<div class="hero-cta"><a class="btn btn-primary btn-lg" href="' + openHref + '">' + I('play') + 'Начать сегодня</a>' +
              '<button type="button" class="btn btn-ghost btn-lg" data-action="how-it-works">' + I('sparkles') + 'Как это работает</button></div>' +
            '<div class="hero-trust">' +
              '<span>' + I('flame', 'icon-sm') + 'Серии до 30+ дней</span>' +
              '<span>' + I('chart', 'icon-sm') + 'Статистика пользы</span>' +
              '<span>' + I('moon', 'icon-sm') + 'Светлая и тёмная темы</span>' +
            '</div>' +
          '</div>' +
          '<div class="hero-visual"><div class="mock">' +
            '<div class="mock-top"><span class="mock-dots"><i></i><i></i><i></i></span><span class="text-muted" style="font-size:.8rem;font-weight:700">Сегодня · прогресс 3 из 5</span></div>' +
            '<div class="mock-progress"><div class="progress"><span style="width:60%"></span></div></div>' +
            ['#0ea5e9|Выпить 8 стаканов воды|1', '#6c5ce7|Читать 20 страниц|1', '#f6a623|Утренняя зарядка|1', '#8b5cf6|Сон до 23:30|0', '#12b886|Медитация|0'].map(function (r) {
              var p = r.split('|'); var done = p[2] === '1';
              return '<div class="mock-row"><span class="dot" style="background:' + U.gradient(p[0]) + '"></span>' +
                '<span class="mock-lines"><i></i><i></i></span>' +
                '<span class="mock-check' + (done ? '' : ' off') + '">' + I('check', 'icon-sm') + '</span></div>';
            }).join('') +
            '</div>' +
            '<div class="float-card a">' + I('flame', 'icon-sm') + '<span style="color:#ff6b6b">31 день подряд!</span></div>' +
            '<div class="float-card b">' + I('trendingUp', 'icon-sm') + '<span style="color:#12b886">Лучше, чем вчера</span></div>' +
          '</div>' +
        '</div></section>' +

        '<section class="landing-section" id="how"><div class="section-head"><span class="eyebrow">Как это работает</span><h2>Три шага до новой привычки</h2><p>Просто, ежедневно и без лишнего.</p></div><div class="steps">' + steps + '</div></section>' +

        '<section class="landing-section" id="features"><div class="section-head"><span class="eyebrow">Ключевые возможности</span><h2>Всё для дисциплины в одном месте</h2><p>Функционал, который реально помогает не бросить начатое.</p></div><div class="grid grid-3">' + features + '</div></section>' +

        '<section class="landing-section" id="dashboard"><div class="section-head"><span class="eyebrow">Дашборд</span><h2>Один экран — вся картина дня</h2><p>Приветствие, прогресс, привычки и мотивация на сегодня.</p></div>' +
          '<div class="dash-preview">' +
            '<div class="card card-flat" style="border-radius:20px">' +
              '<div class="row-between mb-2"><div><h3 class="mb-0">' + greeting() + ', Александр</h3><span class="text-muted">' + esc(U.fmtDateFull(new Date())) + '</span></div><span class="badge badge-flame">' + I('flame') + '31</span></div>' +
              '<div class="progress progress-lg mb-1"><span style="width:60%"></span></div>' +
              '<div class="text-muted mb-3" style="font-size:.85rem">Выполнено 3 из 5 привычек</div>' +
              ['#0ea5e9|Выпить 8 стаканов воды|1', '#6c5ce7|Читать 20 страниц|1', '#f6a623|Утренняя зарядка|1'].map(function (r) {
                var p = r.split('|'); var done = p[2] === '1';
                return '<div class="habit-row' + (done ? ' is-done' : '') + '"><span class="habit-icon" style="width:40px;height:40px;background:' + U.gradient(p[0]) + '">' + I('circleDot') + '</span><div class="habit-body"><div class="habit-name"><span class="txt">' + p[1] + '</span></div></div><span class="check-round' + (done ? ' is-done' : '') + '">' + I('check') + '</span></div>';
              }).join('') +
            '</div>' +
            '<div class="stack">' +
              '<div class="card aside-card"><div class="quote">Прочитано <span class="em">320 страниц</span> за месяц — это примерно <span class="em">2 книги</span>.</div></div>' +
              '<div class="card"><div class="card-title">' + I('trendingUp') + 'Лучше, чем вчера</div><p class="text-muted mb-0" style="font-size:.9rem">Вчера 3 из 5, сегодня 4 из 5 — держите темп!</p></div>' +
              '<div class="card"><div class="card-title">' + I('droplet') + 'Статистика пользы</div><p class="text-muted mb-0" style="font-size:.9rem">40 стаканов воды — на 2 литра больше нормы.</p></div>' +
            '</div>' +
          '</div>' +
        '</section>' +

        '<section class="landing-section" id="advantages"><div class="section-head"><span class="eyebrow">Преимущества</span><h2>Почему именно так</h2></div><div class="grid grid-2">' + advantages + '</div></section>' +

        '<div class="cta-band"><h2>Готов укрепить привычки?</h2><p>Открой личный трекер и поставь первую галочку сегодня.</p><a class="btn btn-white btn-lg" href="' + openHref + '">' + I('arrowRight') + 'Открыть трекер</a></div>' +

        '<footer class="landing-footer"><div class="footer-grid">' +
          '<div class="footer-col">' + C.brand() + '<p class="text-muted mt-1" style="font-size:.86rem;max-width:320px">Личный трекер привычек для дисциплины и укрепления полезных привычек. Только для меня.</p></div>' +
          '<div class="footer-col"><h4>Продукт</h4><a href="' + openHref + '">Дашборд</a><a href="#features">Возможности</a><a href="#how" data-action="how-it-works">Как это работает</a></div>' +
          '<div class="footer-col"><h4>Аккаунт</h4><a href="#/login">Вход</a><a href="#/register">Регистрация</a><a href="#/forgot">Восстановление пароля</a></div>' +
        '</div><div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' Ритм. Личный проект.</span><span>Данные хранятся на устройстве</span></div></footer>' +
      '</div>',
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var how = e.target.closest('[data-action="how-it-works"]');
          if (how) { e.preventDefault(); openHowItWorks(); return; }
          var a = e.target.closest('a[href^="#"]');
          if (!a) return;
          var href = a.getAttribute('href');
          if (!href || href === '#' || href.indexOf('#/') === 0) return;
          var el = root.querySelector(href);
          if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
      }
    };
  };

  function openHowItWorks() {
    var openHref = Store.state.auth.loggedIn ? '#/today' : '#/login';
    U.modal(
      '<div class="modal-head"><div><h3>Как это работает</h3>' +
        '<span class="text-muted" style="font-size:.85rem">Коротко о трекере «Ритм»</span></div>' +
        '<button type="button" class="icon-btn sm" data-close="1" aria-label="Закрыть">' + I('x', 'icon-sm') + '</button></div>' +
      '<div class="how-body">' +
        '<p class="text-muted">«Ритм» — личный трекер привычек. Он помогает превращать намерения в ежедневную дисциплину: вы отмечаете выполнение, а приложение считает серии, рисует тепловую карту и переводит прогресс в понятные цифры.</p>' +
        '<ul class="how-list">' +
          '<li><b>Создайте привычку</b> — название, иконка, цвет, цель и периодичность: ежедневно, по будням или N раз в неделю.</li>' +
          '<li><b>Отмечайте каждый день</b> — галочки на дашборде «Сегодня» за текущий и прошлые дни, чтобы ничего не забыть.</li>' +
          '<li><b>Держите серию</b> — огонёк стрика не даёт сорваться, а мягкое сравнение «сегодня лучше, чем вчера» мотивирует без давления.</li>' +
          '<li><b>Смотрите картину</b> — календарь с тепловой картой, статистика по каждой привычке, по категориям и общая.</li>' +
          '<li><b>Видьте пользу</b> — прогресс в понятных единицах: «320 страниц ≈ 2 книги», «40 стаканов воды», «сэкономлено 500 минут».</li>' +
          '<li><b>Всё приватно</b> — данные хранятся локально на устройстве, регистрация для других закрыта: это пространство только для вас.</li>' +
        '</ul>' +
      '</div>' +
      '<div class="modal-foot"><a class="btn btn-primary" href="' + openHref + '" data-close="1">' + I('play') + 'Открыть трекер</a>' +
      '<button type="button" class="btn btn-ghost" data-close="1">Закрыть</button></div>'
    );
  }

  /* =================== AUTH =================== */
  function authAside(title, text) {
    return '<div class="auth-aside">' +
      C.brand() +
      '<div><h2>' + title + '</h2><p>' + text + '</p>' +
        '<div class="auth-quote">' + I('flame') + ' «30 дней подряд — и привычка становится частью меня»</div></div>' +
      '<span class="text-muted" style="color:rgba(255,255,255,.7);font-size:.82rem">Приватно · локально · без лишних глаз</span>' +
    '</div>';
  }

  P.login = function () {
    return {
      public: true,
      content: '<div class="auth-wrap">' + authAside('Рад снова видеть', 'Войди в свой личный трекер и отметь привычки за сегодня.') +
        '<div class="auth-main"><div class="auth-card">' +
          '<h1>Вход в трекер</h1>' +
          '<p class="text-muted mb-3">Это личный кабинет — доступ только у меня.</p>' +
          '<div class="auth-note mb-3">' + I('info', 'icon-sm') + '<span>Демо-доступ: логин <b>admin</b>, пароль <b>admin</b></span></div>' +
          '<form data-form="login" novalidate>' +
            '<div class="field"><label for="l-login">Логин или email</label><div class="input-group">' + I('user', 'icon-sm') + '<input class="input" id="l-login" name="login" autocomplete="username" placeholder="admin" value="admin"></div></div>' +
            '<div class="field"><label for="l-pass">Пароль</label><div class="input-group">' + I('lock', 'icon-sm') + '<input class="input" id="l-pass" name="password" type="password" autocomplete="current-password" placeholder="••••••" value="admin"><button type="button" class="toggle-pass" data-toggle-pass aria-label="Показать пароль">' + I('eye', 'icon-sm') + '</button></div>' +
              '<div data-error class="field-error hidden"></div></div>' +
            '<div class="row-between mb-3"><label class="checkbox"><input type="checkbox" checked><span class="box">' + I('check') + '</span>Запомнить меня</label><a href="#/forgot" style="font-size:.85rem">Забыли пароль?</a></div>' +
            '<button class="btn btn-primary btn-block btn-lg" type="submit">Войти</button>' +
          '</form>' +
          '<div class="auth-alt">Нет аккаунта? <a href="#/register">Регистрация</a> · <a href="#/">На главную</a></div>' +
        '</div></div></div>',
      mount: function (root) {
        wirePasswordToggles(root);
        var form = root.querySelector('[data-form="login"]');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var loginEl = form.querySelector('[name="login"]');
          var passEl = form.querySelector('[name="password"]');
          var login = loginEl.value.trim();
          var pass = passEl.value;
          var err = form.querySelector('[data-error]');
          if (Store.login(login, pass)) {
            U.toast('С возвращением, ' + Store.state.user.name + '!', 'success');
            App.Router.go('#/today');
          } else {
            err.textContent = 'Неверный логин или пароль';
            err.classList.remove('hidden');
            loginEl.classList.add('is-invalid');
            passEl.classList.add('is-invalid');
          }
        });
      }
    };
  };

  P.register = function () {
    return {
      public: true,
      content: '<div class="auth-wrap">' + authAside('Личный трекер', 'Регистрация открыта только для владельца. Остальные не могут создать аккаунт.') +
        '<div class="auth-main"><div class="auth-card">' +
          '<h1>Регистрация</h1>' +
          '<p class="text-muted mb-3">Это приватный трекер — новый аккаунт здесь не создаётся.</p>' +
          '<div class="auth-note mb-3">' + I('shield', 'icon-sm') + '<span>По техническому заданию регистрация для посторонних закрыта. Форма сохранена как макет.</span></div>' +
          '<form data-form="register" novalidate>' +
            '<div class="field"><label for="r-login">Логин</label><div class="input-group">' + I('user', 'icon-sm') + '<input class="input" id="r-login" placeholder="mylogin"></div></div>' +
            '<div class="field"><label for="r-email">Email</label><div class="input-group">' + I('mail', 'icon-sm') + '<input class="input" id="r-email" type="email" placeholder="me@example.com"></div></div>' +
            '<div class="field"><label for="r-pass">Пароль</label><div class="input-group">' + I('lock', 'icon-sm') + '<input class="input" id="r-pass" type="password" placeholder="Минимум 6 символов"><button type="button" class="toggle-pass" data-toggle-pass aria-label="Показать">' + I('eye', 'icon-sm') + '</button></div></div>' +
            '<div class="field"><label for="r-pass2">Подтверждение пароля</label><div class="input-group">' + I('lock', 'icon-sm') + '<input class="input" id="r-pass2" type="password" placeholder="Повторите пароль"></div></div>' +
            '<button class="btn btn-primary btn-block btn-lg" type="submit">Зарегистрироваться</button>' +
          '</form>' +
          '<div class="auth-alt">Уже есть аккаунт? <a href="#/login">Войти</a></div>' +
        '</div></div></div>',
      mount: function (root) {
        wirePasswordToggles(root);
        var form = root.querySelector('[data-form="register"]');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          U.modal('<div class="modal-head"><h3>Регистрация закрыта</h3><button class="icon-btn sm" data-close="1">' + I('x', 'icon-sm') + '</button></div>' +
            '<p class="text-muted mb-0">Это личный трекер — аккаунт существует только один. Войдите с ним или сбросьте пароль.</p>' +
            '<div class="modal-foot"><a class="btn btn-ghost" href="#/forgot" data-close="1">Забыли пароль?</a><a class="btn btn-primary" href="#/login" data-close="1">Ко входу</a></div>');
        });
      }
    };
  };

  P.forgot = function () {
    return {
      public: true,
      content: '<div class="auth-wrap">' + authAside('Восстановление', 'Пришлём инструкцию для сброса пароля на твой email.') +
        '<div class="auth-main"><div class="auth-card">' +
          '<h1>Восстановление пароля</h1>' +
          '<p class="text-muted mb-3">Укажите email — отправим ссылку для сброса.</p>' +
          '<form data-form="forgot" novalidate>' +
            '<div class="field"><label for="f-email">Email</label><div class="input-group">' + I('mail', 'icon-sm') + '<input class="input" id="f-email" type="email" placeholder="me@example.com" value="' + esc(Store.state.user.email) + '"></div>' +
              '<div data-error class="field-error hidden"></div></div>' +
            '<button class="btn btn-primary btn-block btn-lg" type="submit">Отправить инструкцию</button>' +
          '</form>' +
          '<div data-sent class="hidden mt-3"></div>' +
          '<div class="auth-alt"><a href="#/login">← Вернуться ко входу</a></div>' +
        '</div></div></div>',
      mount: function (root) {
        var form = root.querySelector('[data-form="forgot"]');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var email = form.querySelector('#f-email').value.trim();
          var err = form.querySelector('[data-error]');
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            err.textContent = 'Введите корректный email';
            err.classList.remove('hidden');
            return;
          }
          err.classList.add('hidden');
          root.querySelector('[data-sent]').innerHTML =
            '<div class="card aside-card"><div class="card-title">' + I('checkCircle') + 'Письмо отправлено</div>' +
            '<p class="text-muted mb-1" style="font-size:.9rem">Инструкция по сбросу пароля отправлена на <b>' + esc(email) + '</b>.</p>' +
            '<p class="text-muted mb-0" style="font-size:.85rem">Проверьте входящие и папку «Спам». Ссылка действует 30 минут.</p></div>';
          root.querySelector('[data-sent]').classList.remove('hidden');
          form.classList.add('hidden');
          U.toast('Инструкция отправлена на ' + email, 'success');
        });
      }
    };
  };

  function wirePasswordToggles(root) {
    U.$$('[data-toggle-pass]', root).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = btn.parentNode.querySelector('input');
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = show ? I('eyeOff', 'icon-sm') : I('eye', 'icon-sm');
      });
    });
  }

  /* =================== TODAY =================== */
  P.today = function (params) {
    return {
      active: '#/today',
      build: function () {
        var iso = (params && params.date) || U.todayISO();
        var today = U.todayISO();
        var isFuture = iso > today;
        var stats = Store.dayStats(iso);
        var pct = Math.round(stats.ratio * 100);
        var habits = Store.availableHabits(iso);
        var u = Store.state.user;

        var dateNav = '<div class="date-nav">' +
          '<button data-date-step="-1" aria-label="Предыдущий день">' + I('chevronLeft', 'icon-sm') + '</button>' +
          '<span class="date-label">' + (iso === today ? 'Сегодня · ' + esc(U.fmtShort(iso)) : esc(U.fmtDateFull(iso))) + '</span>' +
          '<button data-date-step="1"' + (isFuture ? ' disabled' : '') + ' aria-label="Следующий день">' + I('chevronRight', 'icon-sm') + '</button></div>' +
          (iso !== today ? '<button class="btn btn-ghost btn-sm" data-date-today>Сегодня</button>' : '');

        var list = habits.length ? habits.map(function (h) { return C.habitRow(h, iso); }).join('') :
          '<div class="empty"><span class="empty-icon">' + I('sparkles') + '</span><h3>Привычек на этот день нет</h3><p>Добавьте первую привычку, чтобы начать.</p><button class="btn btn-primary" data-action="quick-add">' + I('plus') + 'Добавить привычку</button></div>';

        return {
          title: 'Сегодня',
          sub: U.fmtDateFull(iso),
          content: '' +
            '<div class="greet"><div class="grow"><h2>' + greeting() + ', ' + esc(u.name) + '!</h2>' +
              '<span class="text-muted">' + esc(U.fmtDateFull(iso)) + ' · ' + U.relativeDay(iso) + '</span></div>' +
              dateNav + '</div>' +

            '<div class="card card-pad-lg mb-3"><div class="hero-progress">' +
              '<div>' +
                '<div class="pnl">' + stats.done + '<small> / ' + stats.total + ' привычек</small></div>' +
                '<p class="text-muted mb-2">Прогресс за ' + (iso === today ? 'сегодня' : esc(U.fmtDate(iso))) + '</p>' +
                '<div class="progress progress-lg" style="max-width:420px"><span style="width:' + pct + '%"></span></div>' +
              '</div>' +
              '<div class="ring-wrap">' + Ch.ring(pct, { size: 130 }) +
                '<span class="ring-label"><b>' + pct + '%</b><span>выполнено</span></span></div>' +
            '</div></div>' +

            '<div class="section">' +
              '<div class="row-between mb-2"><div class="section-title"><h3>Привычки на ' + (iso === today ? 'сегодня' : esc(U.fmtShort(iso))) + '</h3><span class="badge">' + habits.length + '</span></div>' +
                '<button class="btn btn-ghost btn-sm" data-action="quick-add">' + I('plus') + 'Привычка</button></div>' +
              (isFuture ? '<div class="card text-center text-muted mb-2">' + I('calendar', 'icon-lg') + '<p class="mb-0 mt-1">Отметки на будущее недоступны</p></div>' : '') +
              list +
            '</div>' +

            '<div class="grid grid-2">' + compareCard() + benefitsCard() + '</div>' +
            '<div class="mt-3 grid grid-2">' + quoteCard(stats) + goalCard(stats) + '</div>'
        };
      },
      mount: function (root) {
        var today = U.todayISO();
        U.$$('[data-date-step]', root).forEach(function (b) {
          b.addEventListener('click', function () {
            var cur = ((App.Router.currentParams() || {}).date) || today;
            var next = U.toISO(U.addDays(cur, Number(b.getAttribute('data-date-step'))));
            if (next > today) next = today;
            App.Router.go('#/today/' + next);
          });
        });
        var tBtn = root.querySelector('[data-date-today]');
        if (tBtn) tBtn.addEventListener('click', function () { App.Router.go('#/today'); });
      }
    };
  };

  function compareCard() {
    var cmp = Store.compareYesterday();
    var delta = cmp.delta;
    var line;
    if (cmp.today.total === 0) line = 'Добавьте привычку, и сравнение появится.';
    else if (cmp.today.done === 0) line = 'Ты пропустил сегодня — аяяй! Завтра не пропускаем.';
    else if (delta > 0) line = 'Сегодня вы уже сделали на ' + delta + ' больше, чем вчера. Так держать!';
    else if (delta === 0) line = 'Вы идёте вровень со вчерашним днём — не сбавляйте темп.';
    else line = 'Вчера было ' + cmp.yesterday.done + ' из ' + cmp.yesterday.total + ', сегодня ' + cmp.today.done + ' из ' + cmp.today.total + ' — подтянитесь!';

    var consecutive = bestRunning();
    var secondLine = consecutive >= 2
      ? 'Вы держитесь уже <b>' + U.days(consecutive) + '</b> подряд — дольше прошлых попыток.'
      : 'Начните серию сегодня — уже завтра будет «лучше, чем вчера».';

    return '<div class="card compare-card"><div class="card-title">' + I('trendingUp') + 'Лучше, чем вчера</div>' +
      '<div class="row" style="gap:1.4rem">' +
        '<div><div class="stat-value" style="color:' + (delta >= 0 ? 'var(--success)' : 'var(--danger)') + '">' + (delta >= 0 ? '+' : '') + delta + '</div><div class="stat-label">привычек vs вчера</div></div>' +
        '<div><div class="stat-value">' + cmp.yesterday.done + '/' + cmp.yesterday.total + '</div><div class="stat-label">вчера</div></div>' +
        '<div><div class="stat-value">' + cmp.today.done + '/' + cmp.today.total + '</div><div class="stat-label">сегодня</div></div>' +
      '</div>' +
      '<div class="compare-line" style="color:' + (delta >= 0 ? 'var(--success)' : 'var(--danger)') + '">' + I(delta >= 0 ? 'trendingUp' : 'trendingDown') + '<span>' + line + '</span></div>' +
      '<div class="compare-line text-muted">' + I('flame') + '<span>' + secondLine + '</span></div>' +
    '</div>';
  }

  function bestRunning() {
    var m = 0;
    Store.allHabits().forEach(function (h) { var s = Store.currentStreak(h); if (s > m) m = s; });
    return m;
  }

  function benefitsCard() {
    var items = Store.benefits(30);
    if (!items.length) items = [{ icon: 'sparkles', color: '#6c5ce7', value: '0', unit: 'отметок', text: 'за последние 30 дней' }];
    var rows = items.map(function (b) {
      return '<div class="benefit"><span class="icon-lead" style="background:' + U.hexToRgba(b.color, .15) + ';color:' + b.color + '">' + I(b.icon) + '</span>' +
        '<div><strong>' + b.value + ' ' + esc(b.unit) + '</strong><p class="text-muted">' + esc(b.text) + '</p></div></div>';
    }).join('');
    return '<div class="card"><div class="card-title">' + I('gift') + 'Статистика в виде пользы</div>' + rows + '</div>';
  }

  function quoteCard(stats) {
    var q = stats.ratio >= 0.8 ? 'Отличный день! Дисциплина растёт.' :
      stats.ratio >= 0.5 ? 'Хороший темп — закройте оставшиеся привычки.' :
      stats.total ? 'Ещё есть время. Маленький шаг тоже считается.' : 'Начните с одной привычки.';
    return '<div class="card aside-card"><div class="quote">' + esc(q) + '</div>' +
      '<p class="text-muted mb-0 mt-1" style="font-size:.85rem">Прогресс: ' + stats.done + ' из ' + stats.total + ' за день.</p></div>';
  }

  function goalCard(stats) {
    var allow = Store.habits().reduce(function (s, h) { return s + (h.missAllowance || 0); }, 0);
    var used = Store.habits().reduce(function (s, h) { return s + Store.missesInMonth(h); }, 0);
    var left = Math.max(0, allow - used);
    return '<div class="card"><div class="card-title">' + I('target') + 'Поблажки в этом месяце</div>' +
      '<div class="stat-big"><div><div class="val">' + left + '</div><div class="stat-label">пропусков осталось</div></div>' +
      '<span class="stat-icon" style="width:52px;height:52px;background:' + U.hexToRgba('#12b886', .15) + ';color:#12b886">' + I('shield') + '</span></div>' +
      '<p class="text-muted mb-0 mt-1" style="font-size:.85rem">Использовано ' + used + ' из ' + allow + ' допустимых пропусков.</p></div>';
  }

  /* =================== HABITS LIST =================== */
  var habitsFilter = { status: 'active', cat: 'all', q: '' };

  P.habits = function () {
    return {
      active: '#/habits',
      build: function () {
        var cats = Store.categories();

        var statusSeg = '<div class="segmented" data-fstatus>' +
          ['active|Активные', 'archived|Архив', 'all|Все'].map(function (o) {
            var p = o.split('|'); return '<button data-v="' + p[0] + '" class="' + (habitsFilter.status === p[0] ? 'is-active' : '') + '">' + p[1] + '</button>';
          }).join('') + '</div>';

        var catChips = '<button class="chip' + (habitsFilter.cat === 'all' ? ' is-active' : '') + '" data-cat="all">Все категории</button>' +
          cats.map(function (c) {
            return '<button class="chip' + (habitsFilter.cat === c.id ? ' is-active' : '') + '" data-cat="' + c.id + '">' + I(c.icon, 'icon-sm') + esc(c.name) + '</button>';
          }).join('') + '<button class="chip' + (habitsFilter.cat === 'none' ? ' is-active' : '') + '" data-cat="none">Без категории</button>';

        var body = habitsListHtml();

        return {
          title: 'Привычки',
          sub: Store.habits().length + ' активных · ' + Store.allHabits().filter(function (h) { return h.archived; }).length + ' в архиве',
          content: '' +
            '<div class="row-between mb-2 wrap" style="gap:.6rem">' +
              '<div class="row wrap" style="gap:.5rem">' + statusSeg +
                '<div class="input-group" style="max-width:240px"><span style="display:contents">' + I('search', 'icon-sm') + '</span><input class="input" data-search placeholder="Поиск привычек" value="' + esc(habitsFilter.q) + '"></div>' +
              '</div>' +
              '<a class="btn btn-primary" href="#/habits/new">' + I('plus') + 'Новая привычка</a>' +
            '</div>' +
            '<div class="row wrap mb-3" style="gap:.5rem">' + catChips + '</div>' +
            '<div data-habits-list>' + body + '</div>'
        };
      },
      mount: function (root) {
        var seg = root.querySelector('[data-fstatus]');
        seg.addEventListener('click', function (e) {
          var b = e.target.closest('[data-v]'); if (!b) return;
          habitsFilter.status = b.getAttribute('data-v');
          App.Router.refresh();
        });
        root.addEventListener('click', function (e) {
          var chip = e.target.closest('[data-cat]'); if (chip) { habitsFilter.cat = chip.getAttribute('data-cat'); App.Router.refresh(); }
        });
        var search = root.querySelector('[data-search]');
        search.addEventListener('input', U.debounce(function () {
          habitsFilter.q = search.value;
          var box = root.querySelector('[data-habits-list]');
          if (box) box.innerHTML = habitsListHtml();
        }, 150));
        wireHabitMenus(root);
      }
    };
  };

  function habitsListHtml() {
    var list = Store.allHabits().filter(function (h) {
      if (habitsFilter.status === 'active' && h.archived) return false;
      if (habitsFilter.status === 'archived' && !h.archived) return false;
      if (habitsFilter.cat !== 'all' && (h.categoryId || 'none') !== habitsFilter.cat) return false;
      if (habitsFilter.q && h.name.toLowerCase().indexOf(habitsFilter.q.toLowerCase()) < 0) return false;
      return true;
    });
    return list.length ? list.map(habitCard).join('') :
      '<div class="empty"><span class="empty-icon">' + I('list') + '</span><h3>Привычки не найдены</h3><p>Измените фильтр или добавьте новую привычку.</p></div>';
  }

  function habitCard(h) {
    var streak = Store.currentStreak(h);
    var best = Store.bestStreak(h);
    var week = Store.weekStatus(h);
    var allowed = h.missAllowance || 0;
    var used = Store.missesInMonth(h);
    var left = Math.max(0, allowed - used);
    var cat = Store.category(h.categoryId);
    var catLabel = cat ? cat.name : 'Без категории';
    var dots = week.map(function (d) {
      var cls = d.done ? 'on' : (!d.future && d.required ? 'miss' : '');
      return '<i class="' + cls + '" title="' + esc(U.fmtDate(d.iso)) + '">' + d.label[0] + '</i>';
    }).join('');
    return '<div class="habit-card' + (h.archived ? ' is-archived' : '') + '" data-row="' + h.id + '">' +
      C.habitIcon(h, 48) +
      '<div class="grow" style="min-width:0">' +
        '<div class="habit-name"><span class="txt">' + esc(h.name) + '</span>' + (h.archived ? '<span class="badge badge-outline">Архив</span>' : '') + '</div>' +
        '<div class="habit-meta"><span style="color:' + (cat ? cat.color : 'var(--muted)') + ';font-weight:700">' + esc(catLabel) + '</span>' +
          '<span class="text-muted">·</span>' + esc(Store.freqLabel(h)) + '<span class="text-muted">·</span>до ' + h.goal + ' ' + esc(h.unitLabel) +
          (allowed ? '<span class="text-muted">·</span>поблажки ' + left + '/' + allowed : '') + '</div>' +
        '<div class="week-dots mt-1">' + dots + '</div>' +
      '</div>' +
      '<div class="streak-box"><b style="color:' + (streak ? '#ff6b6b' : 'var(--muted)') + '">' + streak + '</b><span>' + I('flame', 'icon-sm') + ' серия</span><span class="text-muted">рекорд ' + best + '</span></div>' +
      '<div class="dropdown" data-dropdown>' +
        '<button class="icon-btn sm" data-action="dropdown" aria-label="Действия">' + I('more', 'icon-sm') + '</button>' +
        '<div class="dropdown-menu hidden" data-menu>' +
          '<a href="#/habits/' + h.id + '/stats">' + I('chart', 'icon-sm') + 'Статистика</a>' +
          '<a href="#/habits/' + h.id + '/edit">' + I('edit', 'icon-sm') + 'Редактировать</a>' +
          '<button data-archive="' + h.id + '">' + I('archive', 'icon-sm') + (h.archived ? 'Вернуть из архива' : 'В архив') + '</button>' +
          '<button class="danger" data-delete="' + h.id + '">' + I('trash', 'icon-sm') + 'Удалить</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function wireHabitMenus(root) {
    root.addEventListener('click', function (e) {
      var arch = e.target.closest('[data-archive]');
      if (arch) {
        var id = arch.getAttribute('data-archive');
        var h = Store.habit(id);
        Store.updateHabit(id, { archived: !h.archived });
        U.toast(h.archived ? 'Привычка возвращена' : 'Привычка в архиве', 'success');
        App.Router.refresh();
        return;
      }
      var del = e.target.closest('[data-delete]');
      if (del) {
        var did = del.getAttribute('data-delete');
        var hh = Store.habit(did);
        U.confirm({ title: 'Удалить привычку?', message: '«' + hh.name + '» и вся её история будут удалены безвозвратно.', ok: 'Удалить', danger: true }).then(function (ok) {
          if (!ok) return;
          Store.deleteHabit(did);
          U.toast('Привычка удалена', 'success');
          App.Router.refresh();
        });
      }
    });
  }

  /* =================== HABIT FORM =================== */
  P.habitNew = function () {
    return habitFormPage(null);
  };
  P.habitEdit = function (params) {
    return habitFormPage(Store.habit(params.id));
  };

  function habitFormPage(habit) {
    if (habit === undefined) habit = null;
    var isEdit = !!habit;
    return {
      active: '#/habits',
      build: function () {
        if (isEdit && !habit) return notFoundPage();
        return {
          title: isEdit ? 'Редактирование привычки' : 'Новая привычка',
          sub: isEdit ? esc(habit.name) : 'Заполните форму — привычка появится на дашборде',
          content: '<div class="container-narrow" style="max-width:720px;margin:0 auto">' +
            '<a class="btn btn-ghost btn-sm mb-3" href="#/habits">' + I('arrowLeft', 'icon-sm') + 'К списку привычек</a>' +
            '<div class="card card-pad-lg">' +
              '<div class="card-title">' + I(isEdit ? 'edit' : 'plus') + (isEdit ? 'Редактирование привычки' : 'Создание привычки') + '</div>' +
              '<form data-habit-form>' + C.habitForm(habit) +
                '<div class="row-between mt-3 wrap" style="gap:.6rem">' +
                  '<button type="button" class="btn btn-ghost" data-cancel>' + I('x', 'icon-sm') + 'Отмена</button>' +
                  '<button type="submit" class="btn btn-primary btn-lg">' + I('check') + (isEdit ? 'Сохранить' : 'Создать привычку') + '</button>' +
                '</div>' +
                '<div data-error class="field-error mt-2 hidden"></div>' +
              '</form>' +
            '</div></div>'
        };
      },
      mount: function (root) {
        var form = root.querySelector('[data-habit-form]');
        var read = C.wireHabitForm(form, habit);
        root.querySelector('[data-cancel]').addEventListener('click', function () { App.Router.go('#/habits'); });
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var res = read();
          var err = root.querySelector('[data-error]');
          if (res.error) { err.textContent = res.error; err.classList.remove('hidden'); return; }
          if (isEdit) {
            Store.updateHabit(habit.id, res.data);
            U.toast('Привычка обновлена', 'success');
            App.Router.go('#/habits');
          } else {
            Store.addHabit(res.data);
            U.toast('Привычка создана', 'success');
            App.Router.go('#/today');
          }
        });
      }
    };
  }

  P.openHabitModal = function (habit) {
    var isEdit = !!habit;
    var m = U.modal(
      '<div class="modal-head"><h3>' + (isEdit ? 'Редактировать привычку' : 'Быстрое добавление') + '</h3>' +
      '<button class="icon-btn sm" data-close="1" aria-label="Закрыть">' + I('x', 'icon-sm') + '</button></div>' +
      '<form data-habit-form>' + C.habitForm(habit) +
        '<div class="modal-foot"><button type="button" class="btn btn-ghost" data-close="1">Отмена</button>' +
        '<button type="submit" class="btn btn-primary">' + I('check') + (isEdit ? 'Сохранить' : 'Создать') + '</button></div>' +
        '<div data-error class="field-error mt-2 hidden"></div>' +
      '</form>');
    var form = m.querySelector('[data-habit-form]');
    var read = C.wireHabitForm(form, habit);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var res = read();
      var err = m.querySelector('[data-error]');
      if (res.error) { err.textContent = res.error; err.classList.remove('hidden'); return; }
      if (isEdit) Store.updateHabit(habit.id, res.data); else Store.addHabit(res.data);
      U.closeModal();
      U.toast(isEdit ? 'Привычка обновлена' : 'Привычка создана', 'success');
      App.Router.refresh();
    });
  };

  /* =================== HABIT STATS =================== */
  P.habitStats = function (params) {
    return {
      active: '#/habits',
      build: function () {
        var h = Store.habit(params.id);
        if (!h) return notFoundPage();
        var streak = Store.currentStreak(h);
        var best = Store.bestStreak(h);
        var r7 = Store.rate(h, 7), r15 = Store.rate(h, 15), r30 = Store.rate(h, 30);
        var cat = Store.category(h.categoryId);
        var totalDone = Object.keys(h.completions).filter(function (iso) { return Store.isDone(h, iso); }).length;
        var series = Store.series(30).map(function (d) { return { label: d.label, value: Store.isDone(h, d.iso) ? 100 : 0 }; });
        var hm = Store.heatmap(U.toISO(U.addDays(U.startOfWeek(new Date()), -7 * 16)), U.todayISO());
        var week = Store.weekStatus(h);
        var weekDots = week.map(function (d) {
          var cls = d.done ? 'on' : (!d.future && d.required ? 'miss' : '');
          return '<i class="' + cls + '" style="width:34px;height:34px;border-radius:10px;font-size:.8rem">' + d.label + '</i>';
        }).join('');

        return {
          title: 'Статистика привычки',
          sub: h.name,
          content: '' +
            '<a class="btn btn-ghost btn-sm mb-3" href="#/habits">' + I('arrowLeft', 'icon-sm') + 'К списку привычек</a>' +
            '<div class="card card-pad-lg mb-3"><div class="row wrap" style="gap:1rem">' +
              C.habitIcon(h, 60) +
              '<div class="grow" style="min-width:0"><h2 class="mb-0">' + esc(h.name) + '</h2>' +
                '<div class="habit-meta"><span style="color:' + (cat ? cat.color : 'var(--muted)') + ';font-weight:700">' + esc(cat ? cat.name : 'Без категории') + '</span>' +
                  '<span class="text-muted">·</span>' + esc(Store.freqLabel(h)) + '<span class="text-muted">·</span>цель ' + h.goal + ' ' + esc(h.unitLabel) + '</div></div>' +
              '<div class="row" style="gap:.5rem">' +
                '<a class="btn btn-ghost btn-sm" href="#/habits/' + h.id + '/edit">' + I('edit', 'icon-sm') + 'Изменить</a>' +
              '</div>' +
            '</div></div>' +

            '<div class="grid grid-4 mb-3">' +
              statCard('flame', '#ff6b6b', streak, 'Текущая серия') +
              statCard('trophy', '#f6a623', best, 'Лучшая серия') +
              statCard('checkCircle', '#12b886', totalDone, 'Всего отметок') +
              statCard('target', '#6c5ce7', r30 + '%', 'Выполнение 30 дней') +
            '</div>' +

            '<div class="grid grid-3 mb-3">' +
              rateCard('Неделя', r7, 7) + rateCard('15 дней', r15, 15) + rateCard('30 дней', r30, 30) +
            '</div>' +

            '<div class="card chart-card mb-3"><div class="card-title">' + I('chart') + 'Выполнение по дням (30 дней)</div>' +
              Ch.line(series, { color: h.color, max: 100 }) + '</div>' +

            '<div class="grid grid-2">' +
              '<div class="card"><div class="card-title">' + I('calendar') + 'Эта неделя</div><div class="row wrap" style="gap:.4rem">' + weekDots + '</div>' +
                '<p class="text-muted mb-0 mt-2" style="font-size:.85rem">Выполнено ' + week.filter(function (d) { return d.done; }).length + ' из 7 дней недели.</p></div>' +
              '<div class="card"><div class="card-title">' + I('calendarCheck') + 'Тепловая карта (17 недель)</div>' +
                heatmapHtml(hm) + heatLegend() + '</div>' +
            '</div>'
        };
      },
      mount: function (root) {
        U.$$('.heatmap [data-day]', root).forEach(function (b) {
          b.addEventListener('click', function () { openDayModal(b.getAttribute('data-day')); });
        });
      }
    };
  };

  function rateCard(label, pct, days) {
    var cls = pct >= 80 ? 'success' : pct >= 50 ? '' : 'warn';
    return '<div class="card"><div class="row-between mb-1"><span class="stat-label">' + esc(label) + '</span><b>' + pct + '%</b></div>' +
      '<div class="progress ' + cls + '"><span style="width:' + pct + '%"></span></div>' +
      '<p class="text-muted mb-0 mt-1" style="font-size:.8rem">за последние ' + U.days(days) + '</p></div>';
  }

  function heatColor(ratio, alpha) {
    var r = U.clamp(ratio, 0, 1);
    var hue = Math.round(r * 135);
    var light = Math.round(48 - r * 6);
    return 'hsla(' + hue + ', 72%, ' + light + '%, ' + (alpha == null ? 1 : alpha) + ')';
  }

  function heatLegend() {
    var stops = [0, 0.25, 0.5, 0.75, 1];
    return '<div class="heat-legend mt-2"><span>0%</span>' +
      '<i style="background:var(--surface-3)"></i>' +
      stops.map(function (s) { return '<i style="background:' + heatColor(s) + '"></i>'; }).join('') +
      '<span>100%</span></div>';
  }

  function heatmapHtml(cells) {
    return '<div class="heatmap">' + cells.map(function (c) {
      var style = c.ratio < 0 ? 'opacity:.35' : (c.total ? 'background:' + heatColor(c.ratio) : '');
      return '<button type="button" class="heat-cell" style="' + style + '" data-day="' + c.iso + '" title="' + esc(U.fmtDate(c.iso)) + ' · ' + c.done + '/' + c.total + '" aria-label="' + esc(U.fmtDate(c.iso)) + ': ' + c.done + ' из ' + c.total + '"></button>';
    }).join('') + '</div>';
  }

  /* =================== CATEGORIES =================== */
  P.categories = function () {
    return {
      active: '#/categories',
      build: function () {
        var cats = Store.categories();
        var cards = cats.map(function (c) {
          var used = Store.categoryUsage(c.id);
          return '<div class="card"><div class="row-between">' +
            '<div class="row" style="gap:.8rem;min-width:0">' +
              '<span class="cat-icon" style="background:' + U.gradient(c.color) + '">' + I(c.icon) + '</span>' +
              '<div style="min-width:0"><div class="habit-name"><span class="txt">' + esc(c.name) + '</span></div>' +
                '<div class="habit-meta"><span class="text-muted">' + used + ' ' + U.plural(used, ['привычка', 'привычки', 'привычек']) + '</span>' + (c.custom ? '<span class="badge badge-outline">своя</span>' : '<span class="badge badge-primary">по умолчанию</span>') + '</div></div>' +
            '</div>' +
            '<div class="dropdown" data-dropdown><button class="icon-btn sm" data-action="dropdown" aria-label="Действия">' + I('more', 'icon-sm') + '</button>' +
              '<div class="dropdown-menu hidden" data-menu>' +
                '<a href="#/categories/' + c.id + '/edit">' + I('edit', 'icon-sm') + 'Редактировать</a>' +
                '<button class="danger" data-delcat="' + c.id + '">' + I('trash', 'icon-sm') + 'Удалить</button>' +
              '</div></div>' +
          '</div></div>';
        }).join('');
        return {
          title: 'Категории',
          sub: cats.length + ' категорий · привычки распределяются по смыслу',
          content: '<div class="row-between mb-3 wrap" style="gap:.6rem"><p class="text-muted mb-0" style="max-width:520px">Сгруппируйте привычки по категориям: здоровье, спорт, работа, питание и другие.</p>' +
            '<a class="btn btn-primary" href="#/categories/new">' + I('plus') + 'Новая категория</a></div>' +
            '<div class="grid grid-2">' + cards + '</div>'
        };
      },
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var del = e.target.closest('[data-delcat]'); if (!del) return;
          var id = del.getAttribute('data-delcat');
          var c = Store.category(id);
          var used = Store.categoryUsage(id);
          U.confirm({ title: 'Удалить категорию?', message: used ? 'Категория «' + c.name + '» используется в ' + used + ' привычках — они останутся без категории.' : 'Категория «' + c.name + '» будет удалена.', ok: 'Удалить', danger: true }).then(function (ok) {
            if (!ok) return;
            Store.deleteCategory(id);
            U.toast('Категория удалена', 'success');
            App.Router.refresh();
          });
        });
      }
    };
  };

  P.categoryNew = function () { return categoryFormPage(null); };
  P.categoryEdit = function (params) { return categoryFormPage(Store.category(params.id)); };

  function categoryFormPage(cat) {
    var isEdit = !!cat;
    return {
      active: '#/categories',
      build: function () {
        if (isEdit && !cat) return notFoundPage();
        return {
          title: isEdit ? 'Редактирование категории' : 'Новая категория',
          sub: 'Иконка, цвет и название',
          content: '<div class="container-narrow" style="max-width:620px;margin:0 auto">' +
            '<a class="btn btn-ghost btn-sm mb-3" href="#/categories">' + I('arrowLeft', 'icon-sm') + 'К категориям</a>' +
            '<div class="card card-pad-lg"><div class="card-title">' + I('tag') + (isEdit ? 'Редактирование категории' : 'Создание категории') + '</div>' +
              '<form data-cat-form>' + C.categoryForm(cat) +
                '<div class="row-between mt-3 wrap" style="gap:.6rem">' +
                  '<button type="button" class="btn btn-ghost" data-cancel>' + I('x', 'icon-sm') + 'Отмена</button>' +
                  '<button type="submit" class="btn btn-primary btn-lg">' + I('check') + (isEdit ? 'Сохранить' : 'Создать категорию') + '</button></div>' +
                '<div data-error class="field-error mt-2 hidden"></div>' +
              '</form></div></div>'
        };
      },
      mount: function (root) {
        var form = root.querySelector('[data-cat-form]');
        var read = C.wireCategoryForm(form);
        root.querySelector('[data-cancel]').addEventListener('click', function () { App.Router.go('#/categories'); });
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var res = read();
          var err = root.querySelector('[data-error]');
          if (res.error) { err.textContent = res.error; err.classList.remove('hidden'); return; }
          if (isEdit) Store.updateCategory(cat.id, res.data); else Store.addCategory(res.data);
          U.toast(isEdit ? 'Категория обновлена' : 'Категория создана', 'success');
          App.Router.go('#/categories');
        });
      }
    };
  }

  /* =================== CALENDAR =================== */
  var calState = { month: null };
  P.calendar = function () {
    return {
      active: '#/calendar',
      build: function () {
        if (!calState.month) { var n = new Date(); calState.month = new Date(n.getFullYear(), n.getMonth(), 1); }
        var m = calState.month;
        var today = U.todayISO();
        var first = new Date(m.getFullYear(), m.getMonth(), 1);
        var offset = (first.getDay() + 6) % 7;
        var daysInMonth = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();

        var cells = '';
        U.DOW.forEach(function (d) { cells += '<div class="dow">' + d + '</div>'; });
        for (var i = 0; i < offset; i++) cells += '<div class="day-cell empty"></div>';
        for (var d = 1; d <= daysInMonth; d++) {
          var iso = U.toISO(new Date(m.getFullYear(), m.getMonth(), d));
          var st = Store.dayStats(iso);
          var future = iso > today;
          var tint = (future || !st.total) ? '' : 'color-mix(in srgb, ' + heatColor(st.ratio) + ' 34%, var(--surface))';
          cells += '<button type="button" class="day-cell' + (iso === today ? ' today' : '') + (future ? ' future' : '') + '"' +
            (tint ? ' style="background:' + tint + '"' : '') + ' data-day="' + iso + '" aria-label="' + esc(U.fmtDateFull(iso)) + '">' +
            '<span>' + d + '</span>' + (st.total ? '<span class="ratio">' + st.done + '/' + st.total + '</span>' : '') + '</button>';
        }
        var trail = (7 - ((offset + daysInMonth) % 7)) % 7;
        for (var t = 0; t < trail; t++) cells += '<div class="day-cell empty"></div>';

        var hm = Store.heatmap(U.toISO(U.addDays(U.startOfWeek(new Date()), -7 * 25)), U.todayISO());

        return {
          title: 'Календарь и история',
          sub: 'Отмечайте и исправляйте выполнение за прошлые дни',
          content: '' +
            '<div class="grid grid-2" style="align-items:start">' +
              '<div class="card">' +
                '<div class="row-between mb-2"><button class="icon-btn sm" data-month="-1" aria-label="Предыдущий месяц">' + I('chevronLeft', 'icon-sm') + '</button>' +
                  '<strong>' + esc(U.fmtMonthYear(m)) + '</strong>' +
                  '<button class="icon-btn sm" data-month="1" aria-label="Следующий месяц">' + I('chevronRight', 'icon-sm') + '</button></div>' +
                '<div class="month-cal">' + cells + '</div>' +
              '</div>' +
              '<div class="stack">' +
                '<div class="card"><div class="card-title">' + I('calendarCheck') + 'Тепловая карта (26 недель)</div>' +
                  heatmapHtml(hm) +
                  heatLegend() +
                '</div>' +
                '<div class="card"><div class="card-title">' + I('info') + 'Как читать карту</div>' +
                  '<p class="text-muted mb-0" style="font-size:.88rem">Насыщенность клетки показывает, сколько привычек выполнено в этот день. Нажмите на день в календаре, чтобы отметить или исправить выполнение за прошлое.</p></div>' +
              '</div>' +
            '</div>'
        };
      },
      mount: function (root) {
        U.$$('[data-month]', root).forEach(function (b) {
          b.addEventListener('click', function () {
            calState.month = new Date(calState.month.getFullYear(), calState.month.getMonth() + Number(b.getAttribute('data-month')), 1);
            App.Router.refresh();
          });
        });
        U.$$('[data-day]', root).forEach(function (b) {
          b.addEventListener('click', function () { openDayModal(b.getAttribute('data-day')); });
        });
      }
    };
  };

  function openDayModal(iso) {
    var future = iso > U.todayISO();
    function renderInner() {
      var habits = Store.availableHabits(iso);
      var stats = Store.dayStats(iso);
      var pct = Math.round(stats.ratio * 100);
      var head = '<div class="row-between mb-1"><span class="text-muted" style="font-size:.85rem">Выполнено ' + stats.done + ' из ' + stats.total + '</span>' +
        '<span class="badge ' + (pct >= 100 ? 'badge-success' : 'badge-primary') + '">' + pct + '%</span></div>' +
        '<div class="progress progress-sm mb-3"><span style="width:' + pct + '%"></span></div>';
      var note = future ? '<div class="auth-note mb-2">' + I('info', 'icon-sm') + '<span>Это будущий день — отметки появятся, когда он наступит.</span></div>' : '';
      var body = habits.length ? habits.map(function (h) { return C.habitRow(h, iso, { disabled: future }); }).join('') :
        '<div class="empty"><span class="empty-icon">' + I('sparkles') + '</span><p class="mb-0">На этот день привычек нет.</p></div>';
      return head + note + body;
    }
    function render() {
      return '<div class="modal-head"><div><h3>Задачи на ' + esc(U.fmtDate(iso)) + '</h3>' +
        '<span class="text-muted" style="font-size:.85rem">' + esc(U.fmtDateFull(iso)) + ' · ' + esc(U.relativeDay(iso)) + '</span></div>' +
        '<button type="button" class="icon-btn sm" data-close="1" aria-label="Закрыть">' + I('x', 'icon-sm') + '</button></div>' +
        '<div data-day-body>' + renderInner() + '</div>' +
        '<div class="modal-foot"><button type="button" class="btn btn-primary" data-close="1">Готово</button></div>';
    }
    var m = U.modal(render());
    m.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action="toggle-habit"]');
      if (!btn) return;
      e.stopPropagation();
      if (btn.hasAttribute('disabled')) return;
      var row = btn.closest('[data-habit]');
      var h = Store.habit(row.getAttribute('data-habit'));
      Store.toggle(h, row.getAttribute('data-date'));
      var dayBody = m.querySelector('[data-day-body]');
      var keepTop = m.scrollTop;
      dayBody.innerHTML = renderInner();
      m.scrollTop = keepTop;
      App.Router.refresh();
    });
  }

  /* =================== STATS DETAIL HELPERS =================== */
  function statRow(attrs, inner) {
    return '<button type="button" class="rank-row row-link" ' + attrs + '>' + inner + '</button>';
  }
  function emptyNote() { return '<div class="empty"><p class="mb-0">Нет данных.</p></div>'; }
  function habitTotalDone(h) {
    return Object.keys(h.completions).filter(function (iso) { return Store.isDone(h, iso); }).length;
  }
  function dayStatRow(iso) {
    var st = Store.dayStats(iso);
    var pct = Math.round(st.ratio * 100);
    return statRow('data-open-day="' + iso + '"',
      '<span class="rank-num" style="background:' + heatColor(st.ratio) + ';color:#fff">' + U.fromISO(iso).getDate() + '</span>' +
      '<div class="grow" style="min-width:0"><div class="habit-name"><span class="txt">' + esc(U.fmtDateFull(iso)) + '</span></div>' +
      '<div class="habit-meta">' + st.done + ' из ' + st.total + ' привычек</div></div>' +
      '<b>' + pct + '%</b>');
  }
  function habitStatRow(h, right, sub) {
    return statRow('data-open-habit="' + h.id + '"',
      C.habitIcon(h, 38) +
      '<div class="grow" style="min-width:0"><div class="habit-name"><span class="txt">' + esc(h.name) + '</span></div>' +
      '<div class="habit-meta">' + esc(sub || '') + '</div></div>' +
      '<b>' + esc(String(right)) + '</b>');
  }
  function activeDayList() {
    var set = {};
    Store.allHabits().forEach(function (h) {
      Object.keys(h.completions).forEach(function (iso) { if (Store.isDone(h, iso)) set[iso] = true; });
    });
    return Object.keys(set).sort().reverse();
  }
  function perfectDayList() {
    var out = [];
    activeDayList().forEach(function (iso) {
      var st = Store.dayStats(iso);
      if (st.required > 0 && st.requiredDone === st.required) out.push(iso);
    });
    return out;
  }
  function openStatsModal(title, sub, body) {
    var m = U.modal(
      '<div class="modal-head"><div><h3>' + esc(title) + '</h3>' +
        (sub ? '<span class="text-muted" style="font-size:.85rem">' + esc(sub) + '</span>' : '') + '</div>' +
        '<button type="button" class="icon-btn sm" data-close="1" aria-label="Закрыть">' + I('x', 'icon-sm') + '</button></div>' +
      '<div data-stats-body>' + body + '</div>' +
      '<div class="modal-foot"><button type="button" class="btn btn-primary" data-close="1">Готово</button></div>'
    );
    m.addEventListener('click', function (e) {
      var d = e.target.closest('[data-open-day]');
      if (d) { U.closeModal(); openDayModal(d.getAttribute('data-open-day')); return; }
      var h = e.target.closest('[data-open-habit]');
      if (h) { U.closeModal(); App.Router.go('#/habits/' + h.getAttribute('data-open-habit') + '/stats'); }
    });
  }
  function openStat(key) {
    var s = Store.overallStats();
    if (key === 'total') {
      var rows = Store.allHabits().map(function (h) { return { h: h, n: habitTotalDone(h) }; })
        .sort(function (a, b) { return b.n - a.n; });
      openStatsModal('Всего выполнено', 'Всего отметок: ' + s.totalDone,
        rows.length ? rows.map(function (r) { return habitStatRow(r.h, r.n, 'всего отметок'); }).join('') : emptyNote());
      return;
    }
    if (key === 'days') {
      var days = activeDayList();
      openStatsModal('Активные дни', 'Дней с отметками: ' + days.length,
        days.length ? days.map(dayStatRow).join('') : emptyNote());
      return;
    }
    if (key === 'streak') {
      var rk = Store.allHabits().map(function (h) { return { h: h, v: Store.currentStreak(h), b: Store.bestStreak(h) }; })
        .sort(function (a, b) { return b.v - a.v || b.b - a.b; });
      openStatsModal('Текущие серии', 'Лучшая серия сейчас: ' + s.maxStreak,
        rk.length ? rk.map(function (r) { return habitStatRow(r.h, r.v + ' дн', 'рекорд ' + r.b); }).join('') : emptyNote());
      return;
    }
    if (key === 'perfect') {
      var pd = perfectDayList();
      openStatsModal('Идеальные дни', 'Все привычки выполнены: ' + pd.length,
        pd.length ? pd.map(dayStatRow).join('') : emptyNote());
      return;
    }
    if (key === 'bestday') {
      if (s.bestDay) openDayModal(s.bestDay); else U.toast('Пока нет данных', 'info');
      return;
    }
    if (key === 'bestweek') {
      if (!s.bestWeek) { U.toast('Пока нет данных', 'info'); return; }
      var ws = U.fromISO(s.bestWeek);
      var items = [];
      for (var i = 0; i < 7; i++) items.push(U.toISO(U.addDays(ws, i)));
      openStatsModal('Лучшая неделя', 'Неделя ' + U.fmtDate(s.bestWeek) + ' · отметок ' + s.bestWeekCount,
        items.map(dayStatRow).join(''));
      return;
    }
    if (key === 'bestmonth') {
      if (!s.bestMonth) { U.toast('Пока нет данных', 'info'); return; }
      var y = Number(s.bestMonth.slice(0, 4)), mo = Number(s.bestMonth.slice(5, 7));
      var dim = new Date(y, mo, 0).getDate();
      var todayIso = U.todayISO();
      var mItems = [];
      for (var d2 = 1; d2 <= dim; d2++) {
        var iso2 = U.toISO(new Date(y, mo - 1, d2));
        if (Store.dayStats(iso2).total > 0 && iso2 <= todayIso) mItems.push(iso2);
      }
      openStatsModal('Лучший месяц', U.MONTHS_NOM[mo - 1] + ' ' + y + ' · отметок ' + s.bestMonthCount,
        mItems.length ? mItems.map(dayStatRow).join('') : emptyNote());
      return;
    }
    if (key === 'habits') {
      var act = Store.habits();
      var arc = Store.allHabits().filter(function (h) { return h.archived; });
      var body = '<div class="card-title">' + I('checkCircle', 'icon-sm') + 'Активные [' + act.length + ']</div>' +
        (act.length ? act.map(function (h) { var c = Store.category(h.categoryId); return habitStatRow(h, Store.currentStreak(h) + ' дн', c ? c.name : 'Без категории'); }).join('') : emptyNote()) +
        '<div class="card-title mt-3">' + I('archive', 'icon-sm') + 'В архиве [' + arc.length + ']</div>' +
        (arc.length ? arc.map(function (h) { return habitStatRow(h, '—', 'архив'); }).join('') : '<p class="text-muted mt-1">Пусто</p>');
      openStatsModal('Привычки', 'Активных ' + act.length + ' · в архиве ' + arc.length, body);
      return;
    }
  }
  function openWeekModal(startIso, count) {
    var items = [];
    for (var i = 0; i < 7; i++) items.push(U.toISO(U.addDays(U.fromISO(startIso), i)));
    openStatsModal('Неделя ' + U.fmtDate(startIso), 'Отметок за неделю: ' + (count != null ? count : 0), items.map(dayStatRow).join(''));
  }
  function openCategoryStats(catId) {
    var cat = catId === '__none' ? null : Store.category(catId);
    var since = U.toISO(U.addDays(new Date(), -29));
    var rows = Store.allHabits().filter(function (h) { return (h.categoryId || '__none') === catId; }).map(function (h) {
      var n = Object.keys(h.completions).filter(function (iso) { return iso >= since && Store.isDone(h, iso); }).length;
      return { h: h, n: n };
    }).sort(function (a, b) { return b.n - a.n; });
    var total = rows.reduce(function (t, r) { return t + r.n; }, 0);
    openStatsModal('Категория: ' + (cat ? cat.name : 'Без категории'), 'Отметок за 30 дней: ' + total,
      rows.length ? rows.map(function (r) { return habitStatRow(r.h, r.n, 'за 30 дней'); }).join('') : emptyNote());
  }

  /* =================== OVERALL STATS =================== */
  P.stats = function () {
    return {
      active: '#/stats',
      build: function () {
        var s = Store.overallStats();
        var series = Store.series(30);
        var cats = Store.categoryBreakdown(30);
        var weekly = weeklyTotals(8);

        var ranked = s.ranked.slice(0, 6).map(function (r, idx) {
          return '<a class="rank-row row-link" href="#/habits/' + r.habit.id + '/stats"><span class="rank-num">' + (idx + 1) + '</span>' +
            C.habitIcon(r.habit, 38) +
            '<div class="grow" style="min-width:0"><div class="habit-name"><span class="txt">' + esc(r.habit.name) + '</span></div>' +
              '<div class="habit-meta">серия ' + r.streak + ' · рекорд ' + r.best + '</div></div>' +
            '<b>' + r.rate30 + '%</b></a>';
        }).join('');

        var catLegend = cats.map(function (c) {
          return '<span class="cat-pick" data-cat="' + c.id + '"><i style="background:' + c.color + '"></i>' + esc(c.name) + ' · ' + c.value + '</span>';
        }).join('');

        return {
          title: 'Общая статистика',
          sub: 'Нажмите на плашку или график, чтобы посмотреть детали',
          content: '' +
            '<div class="grid grid-4 mb-3">' +
              statCard('checkCircle', '#6c5ce7', s.totalDone, 'Всего выполнено', 'total') +
              statCard('calendar', '#0ea5e9', s.activeDaysCount, 'Активных дней', 'days') +
              statCard('flame', '#ff6b6b', s.maxStreak, 'Лучшая серия сейчас', 'streak') +
              statCard('star', '#f6a623', s.perfectDays, 'Идеальных дней', 'perfect') +
            '</div>' +

            '<div class="grid grid-2 mb-3">' +
              '<div class="card chart-card" data-chart="line"><div class="card-title">' + I('trendingUp') + 'Активность за 30 дней</div>' +
                Ch.line(series, { color: '#6c5ce7', max: 100 }) +
                '<div class="legend mt-1"><span><i style="background:#6c5ce7"></i>Доля выполненных привычек за день · нажмите на день</span></div></div>' +
              '<div class="card chart-card" data-chart="bars"><div class="card-title">' + I('chart') + 'Активность по неделям</div>' +
                Ch.bars(weekly.data.map(function (w) { return { label: w.label, value: w.value, color: '#12b886' }; }), { color: '#12b886', max: weekly.max }) +
                '<div class="legend mt-1"><span><i style="background:#12b886"></i>Отметок за неделю · нажмите на столбец</span></div></div>' +
            '</div>' +

            '<div class="grid grid-2 mb-3">' +
              '<div class="card" data-chart="donut"><div class="card-title">' + I('pie') + 'По категориям (30 дней)</div>' +
                (cats.length ? '<div class="row wrap" style="gap:1.2rem;align-items:center"><div>' + Ch.donut(cats, { size: 170 }) + '</div><div class="legend" style="flex-direction:column;gap:.5rem">' + catLegend + '</div></div>' :
                '<div class="empty"><p>Ещё нет данных за период.</p></div>') + '</div>' +
              '<div class="card"><div class="card-title">' + I('trophy') + 'Самые успешные привычки</div>' + (ranked || '<div class="empty"><p>Пока нет данных.</p></div>') + '</div>' +
            '</div>' +

            '<div class="grid grid-4">' +
              statCard('target', '#6c5ce7', s.bestDay ? s.bestDayCount : 0, 'Лучший день (' + (s.bestDay ? esc(U.fmtShort(s.bestDay)) : '—') + ')', 'bestday') +
              statCard('calendar', '#0ea5e9', s.bestWeekCount, 'Лучшая неделя', 'bestweek') +
              statCard('award', '#f6a623', s.bestMonthCount, 'Лучший месяц (' + (s.bestMonth ? esc(U.MONTHS_SHORT[Number(s.bestMonth.slice(5, 7)) - 1]) : '—') + ')', 'bestmonth') +
              statCard('list', '#12b886', s.activeHabits + ' / ' + s.archivedHabits, 'Активных / в архиве', 'habits') +
            '</div>'
        };
      },
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var card = e.target.closest('[data-stat]');
          if (card) { openStat(card.getAttribute('data-stat')); return; }
          var chart = e.target.closest('[data-chart]');
          if (!chart) return;
          var type = chart.getAttribute('data-chart');
          var hit = e.target.closest('[data-i]');
          if (type === 'line' && hit) {
            var series = Store.series(30);
            var si = Number(hit.getAttribute('data-i'));
            if (series[si]) openDayModal(series[si].iso);
            return;
          }
          if (type === 'bars' && hit) {
            var weekly = weeklyTotals(8);
            var w = weekly.data[Number(hit.getAttribute('data-i'))];
            if (w && w.start) openWeekModal(w.start, w.value);
            return;
          }
          if (type === 'donut') {
            var catEl = e.target.closest('[data-cat]');
            if (catEl) { openCategoryStats(catEl.getAttribute('data-cat')); return; }
            if (hit) {
              var cats = Store.categoryBreakdown(30);
              var c = cats[Number(hit.getAttribute('data-i'))];
              if (c) openCategoryStats(c.id);
            }
          }
        });
      }
    };
  };

  function weeklyTotals(n) {
    var out = [];
    var start = U.startOfWeek(new Date());
    var max = 1;
    for (var w = n - 1; w >= 0; w--) {
      var ws = U.addDays(start, -7 * w);
      var total = 0;
      for (var i = 0; i < 7; i++) {
        var st = Store.dayStats(U.toISO(U.addDays(ws, i)));
        total += st.done;
      }
      if (total > max) max = total;
      out.push({ label: U.fmtShort(ws), value: total, start: U.toISO(ws) });
    }
    return { data: out, max: Math.max(1, max) };
  }

  /* =================== PROFILE =================== */
  P.profile = function () {
    return {
      active: '#/profile',
      build: function () {
        var u = Store.state.user;
        var st = Store.state;
        var notif = u.reminders || {};
        return {
          title: 'Профиль и настройки',
          sub: 'Аккаунт, тема, уведомления и данные',
          content: '' +
            '<div class="card card-pad-lg mb-3"><div class="profile-head">' +
              '<span class="avatar avatar-lg">' + U.initials(u.name) + '</span>' +
              '<div class="grow"><h2 class="mb-0">' + esc(u.name) + '</h2><div class="text-muted">' + esc(u.email) + ' · логин ' + esc(u.login) + '</div></div>' +
              '<button class="btn btn-ghost" data-action="logout">' + I('logout') + 'Выйти</button>' +
            '</div></div>' +

            '<div class="grid grid-2" style="align-items:start">' +
              '<div class="stack">' +
                '<div class="card"><div class="card-title">' + I('user') + 'Данные аккаунта</div>' +
                  '<form data-account>' +
                    '<div class="field"><label for="p-name">Имя</label><input class="input" id="p-name" name="name" value="' + esc(u.name) + '"></div>' +
                    '<div class="field"><label for="p-login">Логин</label><input class="input" id="p-login" name="login" value="' + esc(u.login) + '"></div>' +
                    '<div class="field"><label for="p-email">Email</label><input class="input" id="p-email" name="email" type="email" value="' + esc(u.email) + '"></div>' +
                    '<button class="btn btn-primary" type="submit">' + I('check') + 'Сохранить изменения</button>' +
                  '</form></div>' +
                '<div class="card"><div class="card-title">' + I('lock') + 'Смена пароля</div>' +
                  '<form data-password>' +
                    '<div class="field"><label for="pw-old">Текущий пароль</label><input class="input" id="pw-old" name="old" type="password" placeholder="••••••"></div>' +
                    '<div class="field"><label for="pw-new">Новый пароль</label><input class="input" id="pw-new" name="new" type="password" placeholder="Минимум 6 символов"></div>' +
                    '<div class="field"><label for="pw-new2">Повтор нового пароля</label><input class="input" id="pw-new2" name="new2" type="password" placeholder="Повторите"></div>' +
                    '<button class="btn btn-primary" type="submit">' + I('lock') + 'Обновить пароль</button>' +
                  '</form></div>' +
              '</div>' +

              '<div class="stack">' +
                '<div class="card"><div class="card-title">' + I('palette') + 'Оформление</div>' +
                  '<p class="text-muted" style="font-size:.87rem">Тема применяется ко всему приложению.</p>' +
                  '<div class="segmented" data-theme-pick>' +
                    '<button data-v="light" class="' + (st.theme === 'light' ? 'is-active' : '') + '">' + I('sun', 'icon-sm') + 'Светлая</button>' +
                    '<button data-v="dark" class="' + (st.theme === 'dark' ? 'is-active' : '') + '">' + I('moon', 'icon-sm') + 'Тёмная</button>' +
                  '</div></div>' +

                '<div class="card"><div class="card-title">' + I('menu') + 'Мобильная навигация</div>' +
                  '<p class="text-muted" style="font-size:.87rem">Два варианта меню для мобильной версии: нижняя панель (PWA) или бургер.</p>' +
                  '<div class="segmented" data-nav-pick>' +
                    '<button data-v="bottom" class="' + (st.navMode === 'bottom' ? 'is-active' : '') + '">' + I('grid', 'icon-sm') + 'Нижняя (PWA)</button>' +
                    '<button data-v="burger" class="' + (st.navMode === 'burger' ? 'is-active' : '') + '">' + I('menu', 'icon-sm') + 'Бургер</button>' +
                  '</div></div>' +

                '<div class="card"><div class="card-title">' + I('bell') + 'Уведомления</div>' +
                  '<label class="switch mb-2" style="width:100%;justify-content:space-between"><span>' + I('bell', 'icon-sm') + ' PWA-пуши о привычках</span><span class="row" style="gap:.6rem"><input type="checkbox" data-notif="push"' + (notif.push ? ' checked' : '') + '><span class="track"></span></span></label>' +
                  '<label class="switch" style="width:100%;justify-content:space-between"><span>' + I('mail', 'icon-sm') + ' Email-напоминания</span><span class="row" style="gap:.6rem"><input type="checkbox" data-notif="email"' + (notif.email ? ' checked' : '') + '><span class="track"></span></span></label>' +
                '</div>' +

                '<div class="card"><div class="card-title">' + I('download') + 'Данные</div>' +
                  '<div class="stack">' +
                    '<button class="btn btn-ghost btn-block" data-export>' + I('download') + 'Экспорт данных в JSON</button>' +
                    '<label class="btn btn-ghost btn-block" style="cursor:pointer">' + I('upload') + 'Импорт из файла<input type="file" accept="application/json" data-import class="hidden"></label>' +
                    '<button class="btn btn-ghost btn-block" data-reset>' + I('refresh') + 'Сбросить к демо-данным</button>' +
                    '<button class="btn btn-danger btn-block" data-wipe>' + I('trash') + 'Удалить все данные</button>' +
                  '</div></div>' +
              '</div>' +
            '</div>'
        };
      },
      mount: function (root) {
        var st = Store.state;
        root.querySelector('[data-theme-pick]').addEventListener('click', function (e) {
          var b = e.target.closest('[data-v]'); if (!b) return;
          App.setTheme(b.getAttribute('data-v'));
          App.Router.refresh();
        });
        root.querySelector('[data-nav-pick]').addEventListener('click', function (e) {
          var b = e.target.closest('[data-v]'); if (!b) return;
          Store.state.navMode = b.getAttribute('data-v');
          Store.save();
          U.toast('Мобильная навигация обновлена', 'success');
          App.Router.refresh();
        });
        U.$$('[data-notif]', root).forEach(function (cb) {
          cb.addEventListener('change', function () {
            Store.state.user.reminders[cb.getAttribute('data-notif')] = cb.checked;
            Store.save();
            U.toast('Настройки уведомлений сохранены', 'success');
          });
        });
        var acc = root.querySelector('[data-account]');
        acc.addEventListener('submit', function (e) {
          e.preventDefault();
          var val = function (n) { var el = acc.querySelector('[name="' + n + '"]'); return el ? el.value : ''; };
          var name = val('name').trim() || st.user.name;
          var login = val('login').trim() || st.user.login;
          var email = val('email').trim() || st.user.email;
          Object.assign(st.user, { name: name, login: login, email: email });
          Store.save();
          U.toast('Профиль обновлён', 'success');
          App.Router.refresh();
        });
        var pw = root.querySelector('[data-password]');
        pw.addEventListener('submit', function (e) {
          e.preventDefault();
          var get = function (n) { return pw.querySelector('[name="' + n + '"]').value; };
          if (get('old') !== st.user.password) { U.toast('Текущий пароль неверен', 'error'); return; }
          if (!get('new') || get('new').length < 6) { U.toast('Новый пароль — минимум 6 символов', 'error'); return; }
          if (get('new') !== get('new2')) { U.toast('Пароли не совпадают', 'error'); return; }
          st.user.password = get('new');
          Store.save();
          U.toast('Пароль обновлён', 'success');
          pw.reset();
        });
        root.querySelector('[data-export]').addEventListener('click', function () {
          U.download('ritm-backup-' + U.todayISO() + '.json', Store.exportData());
          U.toast('Экспорт готов', 'success');
        });
        root.querySelector('[data-import]').addEventListener('change', function (e) {
          var file = e.target.files[0]; if (!file) return;
          var reader = new FileReader();
          reader.onload = function () {
            try { Store.importData(reader.result); U.toast('Данные импортированы', 'success'); App.Router.refresh(); }
            catch (err) { U.toast('Не удалось импортировать файл', 'error'); }
          };
          reader.readAsText(file);
        });
        root.querySelector('[data-reset]').addEventListener('click', function () {
          U.confirm({ title: 'Сбросить данные?', message: 'Текущие привычки будут заменены демонстрационными.', ok: 'Сбросить' }).then(function (ok) {
            if (!ok) return; Store.reset(); U.toast('Демо-данные восстановлены', 'success'); App.Router.refresh();
          });
        });
        root.querySelector('[data-wipe]').addEventListener('click', function () {
          U.confirm({ title: 'Удалить все данные?', message: 'Все привычки, категории и история будут удалены безвозвратно.', ok: 'Удалить навсегда', danger: true }).then(function (ok) {
            if (!ok) return; Store.wipe(); U.toast('Данные удалены', 'success'); App.Router.go('#/today');
          });
        });
      }
    };
  };

  /* =================== 404 =================== */
  var NOTFOUND_CONTENT = '<div class="notfound"><div><div class="code">404</div>' +
    '<h2>Такой страницы нет</h2>' +
    '<p class="text-muted" style="max-width:420px;margin:0 auto 1.4rem">Возможно, ссылка устарела или маршрут указан неверно. Вернитесь на дашборд.</p>' +
    '<div class="row" style="justify-content:center;gap:.6rem"><a class="btn btn-primary" href="#/today">' + I('home') + 'На дашборд</a>' +
    '<a class="btn btn-ghost" href="#/">На главную</a></div></div></div>';

  function notFoundPage() {
    return {
      public: false,
      active: '',
      build: function () { return { title: 'Страница не найдена', sub: 'Ошибка 404', content: NOTFOUND_CONTENT }; },
      mount: function () {}
    };
  }
  P.notFound = notFoundPage;
  P.notFoundContent = NOTFOUND_CONTENT;

  App.Pages = P;
})();
