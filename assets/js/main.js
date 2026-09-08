(function () {
  'use strict';

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var storedTheme = null;
  try { storedTheme = localStorage.getItem('cbkh-theme'); } catch (e) {}
  if (storedTheme === 'light' || storedTheme === 'dark') {
    root.setAttribute('data-theme', storedTheme);
  }

  function currentTheme() {
    var attr = root.getAttribute('data-theme');
    if (attr) return attr;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('cbkh-theme', next); } catch (e) {}
      });
    }

    /* ---------- Mobile nav ---------- */
    var navToggle = document.querySelector('[data-nav-toggle]');
    var navLinks = document.querySelector('[data-nav-links]');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        var expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        navLinks.classList.toggle('is-open');
        document.body.style.overflow = !expanded ? 'hidden' : '';
      });
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          navToggle.setAttribute('aria-expanded', 'false');
          navLinks.classList.remove('is-open');
          document.body.style.overflow = '';
        });
      });
    }

    /* ---------- Header scroll shadow ---------- */
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
        toggleBackToTop();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ---------- Back to top ---------- */
    var backToTop = document.querySelector('[data-back-to-top]');
    function toggleBackToTop() {
      if (!backToTop) return;
      backToTop.classList.toggle('is-visible', window.scrollY > 600);
    }
    if (backToTop) {
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      window.addEventListener('scroll', toggleBackToTop, { passive: true });
      toggleBackToTop();
    }

    /* ---------- Scroll reveal ---------- */
    var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window && revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        document.querySelectorAll('.accordion-trigger').forEach(function (other) {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });
        btn.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.style.maxHeight = expanded ? null : panel.scrollHeight + 'px';
      });
    });

    /* Expand any accordion item that starts pre-opened in the markup */
    document.querySelectorAll('.accordion-trigger[aria-expanded="true"]').forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
    });

    /* ---------- Legal page sidebar TOC: open + scroll to section ---------- */
    document.querySelectorAll('.legal-toc a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.getElementById(link.getAttribute('href').slice(1));
        if (!target) return;
        e.preventDefault();
        var trigger = target.querySelector('.accordion-trigger');
        var wasOpen = trigger && trigger.getAttribute('aria-expanded') === 'true';
        if (trigger && !wasOpen) { trigger.click(); }
        var header = document.querySelector('.site-header');
        var offset = (header ? header.offsetHeight : 0) + 16;
        var scrollToTarget = function () {
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        };
        /* Other sections may be collapsing/this one expanding (CSS transition ~0.4s);
           wait for layout to settle before measuring position, or the scroll lands short. */
        if (wasOpen) { scrollToTarget(); } else { setTimeout(scrollToTarget, 420); }
        document.querySelectorAll('.legal-toc a').forEach(function (a) { a.classList.remove('is-active'); });
        link.classList.add('is-active');
      });
    });

    /* ---------- Cookie consent banner ---------- */
    var cookieBanner = document.querySelector('[data-cookie-banner]');
    if (cookieBanner) {
      var consent = null;
      try { consent = localStorage.getItem('cbkh-cookie-consent'); } catch (e) {}
      if (!consent) {
        window.setTimeout(function () { cookieBanner.classList.add('is-visible'); }, 900);
      }
      var acceptBtn = cookieBanner.querySelector('[data-cookie-accept]');
      var declineBtn = cookieBanner.querySelector('[data-cookie-decline]');
      function dismiss(value) {
        try { localStorage.setItem('cbkh-cookie-consent', value); } catch (e) {}
        cookieBanner.classList.remove('is-visible');
      }
      if (acceptBtn) acceptBtn.addEventListener('click', function () { dismiss('accepted'); });
      if (declineBtn) declineBtn.addEventListener('click', function () { dismiss('declined'); });
    }

    /* ---------- Simple client-side form feedback (no backend wired up) ---------- */
    document.querySelectorAll('[data-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var note = form.querySelector('[data-form-status]');
        if (note) {
          note.textContent = 'Thank you. Your message has been noted — our care team will reach out within one business day.';
          note.style.color = 'var(--brand-teal-hover)';
        }
        form.reset();
      });
    });

    /* ---------- Scroll progress bar ---------- */
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      var progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress';
      document.body.appendChild(progressBar);
      var progressTicking = false;
      function updateProgress() {
        var scrollTop = window.pageYOffset;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
        progressTicking = false;
      }
      window.addEventListener('scroll', function () {
        if (!progressTicking) {
          requestAnimationFrame(updateProgress);
          progressTicking = true;
        }
      }, { passive: true });
      updateProgress();
    }

    /* ---------- Count-up animation for numeric stats ---------- */
    if ('IntersectionObserver' in window && !reduceMotion) {
      var statEls = document.querySelectorAll('.stat-strip .stat strong, .hero__trust strong, .hero__stat-card strong');
      var statIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          statIO.unobserve(el);
          var text = el.textContent;
          var match = text.match(/^(\d+)(.*)$/);
          if (!match) return; // not a leading-number stat (e.g. "Same day", "WA") — leave as-is
          var target = parseInt(match[1], 10);
          var suffix = match[2];
          var duration = 900;
          var start = null;
          function step(timestamp) {
            if (start === null) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      }, { threshold: 0.4 });
      statEls.forEach(function (el) { statIO.observe(el); });
    }
  });
})();
