(function () {
  window.App = window.App || {};
  var U = App.utils;
  var Store = App.Store;
  var C = App.Components;

  App.root = document.getElementById('app');

  App.setTheme = function (theme, skipSave) {
    Store.state.theme = theme;
    if (!skipSave) Store.save();
    document.documentElement.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0d15' : '#6c5ce7');
  };

  App.closeDrawer = function () {
    var d = document.getElementById('drawer-root');
    if (d) d.remove();
    document.body.classList.remove('no-scroll');
  };

  App.openDrawer = function () {
    if (document.getElementById('drawer-root')) return;
    var wrap = document.createElement('div');
    wrap.id = 'drawer-root';
    wrap.innerHTML = C.drawer(App.currentActive || '');
    document.body.appendChild(wrap);
    document.body.classList.add('no-scroll');
  };

  App.closeDropdowns = function (except) {
    U.$$('[data-menu]').forEach(function (menu) {
      if (except && except.contains(menu)) return;
      menu.classList.add('hidden');
    });
  };

  document.addEventListener('click', function (e) {
    var inModal = !!e.target.closest('#modal-root');

    var actionEl = e.target.closest('[data-action]');
    if (actionEl) {
      var action = actionEl.getAttribute('data-action');
      if (action === 'theme-toggle') {
        App.setTheme(Store.state.theme === 'dark' ? 'light' : 'dark');
        App.Router.refresh();
        return;
      }
      if (action === 'logout') {
        App.closeDrawer();
        Store.logout();
        U.toast('Вы вышли из трекера', 'info');
        App.Router.go('#/login');
        return;
      }
      if (action === 'drawer-open') { App.openDrawer(); return; }
      if (action === 'drawer-close') { App.closeDrawer(); return; }
      if (action === 'quick-add') { App.Pages.openHabitModal(null); return; }
      if (action === 'landing-menu') {
        var ln = document.querySelector('.landing-nav');
        if (ln) ln.classList.toggle('open');
        return;
      }
      if (action === 'dropdown') {
        var wrap = actionEl.closest('[data-dropdown]');
        var menu = wrap && wrap.querySelector('[data-menu]');
        if (menu) {
          var willOpen = menu.classList.contains('hidden');
          App.closeDropdowns(wrap);
          menu.classList.toggle('hidden', !willOpen);
        }
        e.stopPropagation();
        return;
      }
      if (action === 'toggle-habit' && !inModal) {
        var row = actionEl.closest('[data-habit]');
        if (row) {
          var h = Store.habit(row.getAttribute('data-habit'));
          if (h) {
            Store.toggle(h, row.getAttribute('data-date'));
            App.Router.refresh();
          }
        }
        return;
      }
    }

    if (!e.target.closest('[data-dropdown]')) App.closeDropdowns();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      App.closeDropdowns();
      App.closeDrawer();
      U.closeModal();
    }
    if (e.key === 'n' && !/input|textarea|select/i.test((e.target.tagName || '')) && Store.state.auth.loggedIn) {
      e.preventDefault();
      App.Pages.openHabitModal(null);
    }
  });

  window.addEventListener('hashchange', function () {
    App.closeDrawer();
    App.Router.render();
  });

  function init() {
    Store.load();
    App.setTheme(Store.state.theme, true);
    if (!location.hash) history.replaceState(null, '', '#/');
    App.Router.render();
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      var refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        if (reg.update) reg.update();
      }).catch(function () {});
    }
  }

  var origRender = App.Router.render;
  App.Router.render = function () {
    var active = origRender.apply(this, arguments);
    if (active) App.currentActive = active;
    return active;
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
