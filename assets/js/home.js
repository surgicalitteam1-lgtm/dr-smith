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
    var scope = item.closest('.pc-faq-stack, .apple-faq-list') || document;
    scope.querySelectorAll('.apple-faq-item').forEach(function(i) {
      i.classList.remove('active');
    });
    if (!isActive) {
      item.classList.add('active');
    }
  };

  // Restore any deferred viewport-loader images inside a newly activated container
  function eagerRestoreContainerImages(container) {
    if (!container || !container.querySelectorAll) return;
    container.querySelectorAll('img[data-vp-src]').forEach(function(img) {
      var orig = img.getAttribute('data-vp-src');
      if (orig) {
        img.setAttribute('src', orig);
        img.removeAttribute('data-vp-src');
        img.classList.remove('vp-img-deferred');
        img.classList.add('vp-img-loaded');
      }
    });
  }

  // PC Hero Stage Switcher (4-Mode Hardware Podium)
  window.switchPcHeroStage = function(idx, code, title, desc, linkHref, btn) {
    var panes = document.querySelectorAll('.pc-stage-pane');
    panes.forEach(function(pane) {
      if (parseInt(pane.getAttribute('data-stage-pane'), 10) === idx) {
        pane.classList.add('active');
        eagerRestoreContainerImages(pane);
      } else {
        pane.classList.remove('active');
      }
    });

    document.querySelectorAll('.pc-dock-btn').forEach(function(b) {
      b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');

    var codeEl = document.getElementById('pcStageCode');
    var titleEl = document.getElementById('pcStageTitle');
    var descEl = document.getElementById('pcStageDesc');
    var linkEl = document.getElementById('pcStageDirectLink');
    if (codeEl && code) codeEl.textContent = code;
    if (titleEl && title) titleEl.textContent = title;
    if (descEl && desc) descEl.textContent = desc;
    if (linkEl && linkHref) linkEl.setAttribute('href', linkHref);
  };

  // PC Department Matrix Explorer Switcher
  window.switchPcDeptTab = function(idx, btn) {
    document.querySelectorAll('.pc-dept-tab').forEach(function(t) {
      t.classList.remove('active');
    });
    if (btn) btn.classList.add('active');

    document.querySelectorAll('.pc-dept-panel').forEach(function(panel) {
      if (parseInt(panel.getAttribute('data-dept-panel'), 10) === idx) {
        panel.classList.add('active');
        eagerRestoreContainerImages(panel);
      } else {
        panel.classList.remove('active');
      }
    });
  };

  // PC Showroom Category Filter
  window.filterPcShowroom = function(category, btn) {
    document.querySelectorAll('.pc-filter-pill').forEach(function(p) {
      p.classList.remove('active');
    });
    if (btn) btn.classList.add('active');

    var cards = document.querySelectorAll('#pcShowroomGrid .pc-unit-card');
    cards.forEach(function(card) {
      var cardCat = card.getAttribute('data-pc-cat');
      if (category === 'all' || cardCat === category || cardCat === 'all') {
        card.style.display = '';
        eagerRestoreContainerImages(card);
      } else {
        card.style.display = 'none';
      }
    });
  };

  // PC Full-Width Category Hero Banner Slider Controller
  var pcCurrentCatSlide = 0;
  var pcCatBannerTimer = null;

  window.goToPcCatBanner = function(idx, tabBtn) {
    var slides = document.querySelectorAll('#pcCatHeroSlider .pc-cat-banner-slide');
    var tabs = document.querySelectorAll('#pcCatHeroSlider .pc-cat-slider-tab');
    if (!slides.length) return;

    var total = slides.length;
    pcCurrentCatSlide = ((idx % total) + total) % total;

    slides.forEach(function(s, i) {
      if (i === pcCurrentCatSlide) {
        s.classList.add('active');
        eagerRestoreContainerImages(s);
      } else {
        s.classList.remove('active');
      }
    });

    tabs.forEach(function(t, i) {
      if (i === pcCurrentCatSlide) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
  };

  window.stepPcCatBanner = function(delta) {
    window.goToPcCatBanner(pcCurrentCatSlide + delta);
    resetPcCatBannerAutoplay();
  };

  function resetPcCatBannerAutoplay() {
    if (pcCatBannerTimer) clearInterval(pcCatBannerTimer);
    pcCatBannerTimer = setInterval(function() {
      if (window.innerWidth >= 992) {
        window.goToPcCatBanner(pcCurrentCatSlide + 1);
      }
    }, 6000);
  }

  function initPcCatBannerSlider() {
    var slider = document.getElementById('pcCatHeroSlider');
    if (!slider) return;
    resetPcCatBannerAutoplay();
    slider.addEventListener('mouseenter', function() {
      if (pcCatBannerTimer) clearInterval(pcCatBannerTimer);
    });
    slider.addEventListener('mouseleave', function() {
      resetPcCatBannerAutoplay();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPcCatBannerSlider);
  } else {
    initPcCatBannerSlider();
  }

  // Helper to get the currently visible .btn-hero-whatsapp (PC or Mobile)
  function getActiveHeroWhatsAppBtn() {
    var btns = document.querySelectorAll('.btn-hero-whatsapp');
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].getClientRects().length > 0) {
        return btns[i];
      }
    }
    return btns[0] || null;
  }

  // Header scroll background transition & Hero WhatsApp button visibility tracking
  function checkHeaderScroll() {
    var nav = document.querySelector('.apple-globalnav');
    if (nav) {
      if (window.scrollY > 30) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    }

    // E-mail option in header: ALWAYS visible across all screen sizes and scroll states
    var mailNavBtn = document.querySelector('.apple-nav-circle-mail');
    if (mailNavBtn) {
      mailNavBtn.classList.add('visible-mobile', 'visible-mail');
    }

    // WhatsApp option in header: on hero section, reveals only after scrolling down past hero action button
    var waNavBtn = document.querySelector('.apple-nav-circle-whatsapp');
    if (waNavBtn) {
      var heroActionBtn = getActiveHeroWhatsAppBtn();
      if (heroActionBtn) {
        document.body.classList.add('has-hero-whatsapp');
        var rect = heroActionBtn.getBoundingClientRect();
        // 74px accounts for the fixed header height
        if (rect.bottom <= 74) {
          waNavBtn.classList.add('visible-whatsapp', 'visible-mobile');
        } else {
          waNavBtn.classList.remove('visible-whatsapp', 'visible-mobile');
        }
      } else {
        waNavBtn.classList.add('visible-whatsapp', 'visible-mobile');
      }
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

