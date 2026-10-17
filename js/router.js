(function () {
  window.App = window.App || {};
  var Store = App.Store;
  var C = App.Components;
  var P = App.Pages;

  var ROUTES = [
    { p: '/', page: function () { return P.landing(); } },
    { p: '/login', page: function () { return P.login(); } },
    { p: '/register', page: function () { return P.register(); } },
    { p: '/forgot', page: function () { return P.forgot(); } },
    { p: '/today', page: function (pr) { return P.today(pr); } },
    { p: '/today/:date', page: function (pr) { return P.today(pr); } },
    { p: '/habits', page: function () { return P.habits(); } },
    { p: '/habits/new', page: function () { return P.habitNew(); } },
    { p: '/habits/:id/edit', page: function (pr) { return P.habitEdit(pr); } },
    { p: '/habits/:id/stats', page: function (pr) { return P.habitStats(pr); } },
    { p: '/categories', page: function () { return P.categories(); } },
    { p: '/categories/new', page: function () { return P.categoryNew(); } },
    { p: '/categories/:id/edit', page: function (pr) { return P.categoryEdit(pr); } },
    { p: '/calendar', page: function () { return P.calendar(); } },
    { p: '/stats', page: function () { return P.stats(); } },
    { p: '/profile', page: function () { return P.profile(); } }
  ];

  var lastParams = {};

  function parseHash() {
    var h = location.hash || '#/';
    var path = h.replace(/^#/, '');
    var qi = path.indexOf('?');
    if (qi >= 0) path = path.slice(0, qi);
    if (!path) path = '/';
    return path.split('/').filter(function (s) { return s.length; });
  }

  function match(segs) {
    for (var i = 0; i < ROUTES.length; i++) {
      var pattern = ROUTES[i].p.split('/').filter(Boolean);
      if (pattern.length !== segs.length) continue;
      var params = {};
      var ok = true;
      for (var j = 0; j < pattern.length; j++) {
        if (pattern[j].charAt(0) === ':') {
          params[pattern[j].slice(1)] = decodeURIComponent(segs[j]);
        } else if (pattern[j] !== segs[j]) { ok = false; break; }
      }
      if (ok) return { def: ROUTES[i], params: params };
    }
    return null;
  }

  function renderApp(obj, params) {
    var app = App.root;
    var built = obj.build();
    app.innerHTML = C.appShell(obj.active || '', built.title || '', built.sub || '', built.content || '');
    C.themeLabelUpdate();
    var root = app.querySelector('.container') || app;
    if (obj.mount) obj.mount(root);
  }

  function renderPublic(obj) {
    var app = App.root;
    document.body.classList.remove('has-bottomnav');
    app.innerHTML = obj.content || '';
    C.themeLabelUpdate();
    if (obj.mount) obj.mount(app);
  }

  var Router = {};

  Router.refresh = function () {
    var y = window.scrollY || window.pageYOffset || 0;
    Router.render({ keepScroll: true });
    window.scrollTo(0, y);
  };

  Router.render = function (opts) {
    opts = opts || {};
    var segs = parseHash();
    var m = match(segs);
    var loggedIn = Store.state.auth.loggedIn;

    if (!m) {
      if (loggedIn) renderApp(P.notFound(), {});
      else renderPublic({ public: true, content: P.notFoundContent, mount: function () {} });
      if (!opts.keepScroll) window.scrollTo(0, 0);
      return;
    }

    var params = m.params;
    lastParams = params;
    var obj = m.def.page(params);
    var isPublic = obj.public === true;

    if (!isPublic && !loggedIn) {
      location.hash = '#/login';
      return;
    }

    if (isPublic) renderPublic(obj);
    else renderApp(obj, params);

    var active = obj.active;
    if (!opts.keepScroll) window.scrollTo(0, 0);
    return active;
  };

  Router.go = function (hash) {
    if (location.hash === hash) { Router.render(); }
    else location.hash = hash;
  };

  Router.currentParams = function () { return lastParams; };

  App.Router = Router;
})();
