// public/active-nav.js
// Menandai link pada navbar sebagai "active" berdasarkan location.pathname.
// Juga menangani client-side navigation (pushState/replaceState) untuk SPA.
(function () {
  function normalizePath(path) {
    if (!path) return '/';
    return path.replace(/\/+$/, '') || '/';
  }

  function markActiveLinks() {
    var links = document.querySelectorAll('.nav-menu a');
    var currentPath = normalizePath(location.pathname || '/');

    links.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      try {
        var linkUrl = new URL(href, location.origin);
        var linkPath = normalizePath(linkUrl.pathname);

        if (linkPath === currentPath) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      } catch (e) {
        // abaikan href yang tidak valid
      }

      // update setelah klik (untuk beberapa kasus router)
      link.addEventListener('click', function () {
        // delay kecil agar router SPA sempat mengganti URL
        setTimeout(markActiveLinks, 60);
      });
    });
  }

  // Detect history API changes (pushState/replaceState) dan dispatch event "locationchange"
  (function () {
    var _wr = function (type) {
      var orig = history[type];
      return function () {
        var rv = orig.apply(this, arguments);
        var e = new Event('locationchange');
        window.dispatchEvent(e);
        return rv;
      };
    };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');
    window.addEventListener('popstate', function () {
      window.dispatchEvent(new Event('locationchange'));
    });
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      markActiveLinks();
    });
  } else {
    markActiveLinks();
  }

  // re-run saat location berubah (SPA atau back/forward)
  window.addEventListener('locationchange', markActiveLinks);
})();
