/* Sunstar Macedon — site interactions */
(function () {
  // Scroll reveals
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
    els.forEach(function (e) {
  var r = e.getBoundingClientRect();
  if (r.top < window.innerHeight && r.bottom > 0) {
    e.classList.add('in');
  }
});
    // Failsafe: never leave content hidden if IO is delayed/blocked
    setTimeout(function () {
      document.querySelectorAll('.reveal:not(.in)').forEach(function (e) {
        var r = e.getBoundingClientRect();
        if (r.top < window.innerHeight) e.classList.add('in');
      });
    }, 2400);
  }

  // Mobile nav
  function initNav() {
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return;
    toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // Parallax drift on hero sun (subtle)
  function initParallax() {
    var p = document.querySelector('[data-parallax]');
    if (!p || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      p.style.transform = 'translateY(' + (y * 0.06) + 'px) rotate(' + (y * 0.01) + 'deg)';
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initReveal(); initNav(); initParallax();
  });
})();
