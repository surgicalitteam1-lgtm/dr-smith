/**
 * Dr. Smith Healthcare - Home Page Interactive Scripts
 * Handles floating scroll-to-top, FAQ accordion, hero mail button tracking, and home drawer helpers.
 */
(function() {
  'use strict';

  // Floating Scroll To Top Toggle
  var scrollTopBtn = document.getElementById('scroll-top');
  function toggleScrollTop() {
    if (scrollTopBtn) {
      if (window.scrollY > 120) {
        scrollTopBtn.classList.add('active');
      } else {
        scrollTopBtn.classList.remove('active');
      }
    }
  }

  window.addEventListener('scroll', toggleScrollTop, { passive: true });
  window.addEventListener('load', toggleScrollTop);

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Drawer scope chip selector
  window.setDrawerScope = function(btn, val) {
    document.querySelectorAll('#drawerScopeChips .apple-category-chip').forEach(function(b) {
      b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');
    var inp = document.getElementById('drawer-product-name');
    if (inp) inp.value = val;
  };

  // FAQ Accordion Toggle
  window.toggleAppleFaq = function(button) {
    if (!button) return;
    var item = button.closest('.apple-faq-item');
    if (!item) return;
    var isActive = item.classList.contains('active');
    document.querySelectorAll('.apple-faq-item').forEach(function(i) {
      i.classList.remove('active');
    });
    if (!isActive) {
      item.classList.add('active');
    }
  };

  // Header scroll background transition & Mobile Mail button visibility
  function checkHeaderScroll() {
    var nav = document.querySelector('.apple-globalnav');
    if (nav) {
      if (window.scrollY > 30) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    }

    var mailNavBtn = document.querySelector('.apple-nav-circle-mail');
    if (mailNavBtn && window.innerWidth <= 991) {
      var heroMailBtn = document.querySelector('.btn-hero-mail');
      if (heroMailBtn) {
        var rect = heroMailBtn.getBoundingClientRect();
        if (rect.bottom <= 74) {
          mailNavBtn.classList.add('visible-mobile');
        } else {
          mailNavBtn.classList.remove('visible-mobile');
        }
      }
    } else if (mailNavBtn && window.innerWidth > 991) {
      mailNavBtn.classList.remove('visible-mobile');
    }
  }

  window.addEventListener('scroll', checkHeaderScroll, { passive: true });
  window.addEventListener('resize', checkHeaderScroll, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkHeaderScroll);
  } else {
    checkHeaderScroll();
  }
})();
