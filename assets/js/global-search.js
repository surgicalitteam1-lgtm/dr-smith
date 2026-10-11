/**
 * Dr. Smith Healthcare - Global Instant Search Engine
 * Provides real-time interactive search across all 50+ categories, equipment, and turnkey projects.
 */

(function() {
  'use strict';

  // Determine relative root prefix based on current page URL depth
  function getRootPrefix() {
    var path = window.location.pathname.replace(/\\/g, '/');
    if (path.includes('/catalogue/') && path.split('/catalogue/')[1].includes('/')) {
      return '../../';
    } else if (path.includes('/catalogue/') || path.includes('/about-us/') || path.includes('/turnkey-projects/') || path.includes('/group-companies/') || path.includes('/mission-values/') || path.includes('/contact-form/') || path.includes('/medical-products/')) {
      return '../';
    }
    return '';
  }

  var SEARCH_INDEX = [
    { name: "Hospital Beds & ICU Beds", dept: "Hospital Furniture", keywords: "bed beds electric 7 function 5 function motorized fowler semi icu ward pediatric cribs", icon: "bi-hospital", url: "catalogue/beds/index.html" },
    { name: "Modular Operation Theatres (MOT)", dept: "Turnkey Infrastructure", keywords: "modular ot operation theatre laminar air flow surgical suite ot doors pendants hepa", icon: "bi-brightness-high", url: "catalogue/modular-ot/index.html" },
    { name: "OT Lights & Ceiling Pendants", dept: "Operating Theatre", keywords: "ot lights led surgical light ceiling lamp single double dome surgical lighting", icon: "bi-sun", url: "catalogue/ot-lights/index.html" },
    { name: "OT Tables & Surgical Couches", dept: "Operating Theatre", keywords: "ot tables operating table hydraulic electric c-arm compatible general ortho surgery", icon: "bi-table", url: "catalogue/ot-tables/index.html" },
    { name: "Anesthesia Workstations", dept: "Critical Care", keywords: "anesthesia workstation machine ventilator vaporizer flowmeter circle absorber gas delivery", icon: "bi-heart-pulse", url: "catalogue/anesthesia-workstation/index.html" },
    { name: "ICU Ventilators & BiPAP/CPAP", dept: "Respiratory Care", keywords: "ventilator icu ventilators invasive non-invasive bipap cpap lung breathing", icon: "bi-lungs", url: "catalogue/ventilators/index.html" },
    { name: "Patient Multipara Monitors", dept: "Monitoring Devices", keywords: "patient monitor multipara 12 inch 15 inch ecg spo2 nibp ibp temp etco2 cardiac", icon: "bi-activity", url: "catalogue/patient-monitor/index.html" },
    { name: "Autoclaves & Sterilization Units", dept: "Sterilization", keywords: "autoclave sterilizer horizontal vertical high pressure steam sterilizer flash autoclave", icon: "bi-shield-check", url: "catalogue/autoclaves/index.html" },
    { name: "C-Arm Fluoroscopy Machine", dept: "Radiology & Imaging", keywords: "c-arm c arm machine high frequency fluoroscopy imaging intensifier flat panel orthopedic", icon: "bi-broadcast-pin", url: "catalogue/c-arm-machine/index.html" },
    { name: "Color Doppler & Ultrasound Systems", dept: "Diagnostic Imaging", keywords: "ultrasound doppler 3d 4d sonography color echo linear convex probe imaging", icon: "bi-display", url: "catalogue/ultrasound/index.html" },
    { name: "Dialysis Machines & Water Treatment", dept: "Nephrology Care", keywords: "dialysis machine hemodialysis renal therapy blood pump dialyzer ro water plant", icon: "bi-droplet", url: "catalogue/dialysis-machine/index.html" },
    { name: "Defibrillator & AED Resuscitation", dept: "Emergency Care", keywords: "defibrillator aed automatic external biphasic monitor pacer shock resuscitation", icon: "bi-lightning-charge", url: "catalogue/defibrillator-aed/index.html" },
    { name: "Cautery Machines & Vessel Sealing", dept: "Electrosurgery", keywords: "cautery machine electrosurgical unit esu monopolar bipolar vessel sealer diathermy", icon: "bi-lightning", url: "catalogue/cautery-machine/index.html" },
    { name: "Laparoscopy Towers & Cameras", dept: "Minimally Invasive Surgery", keywords: "laparoscopy lapro tower 4k camera insufflator light source telescope endoscopy", icon: "bi-camera-video", url: "catalogue/lapro-tower-equipment/index.html" },
    { name: "ECG Machines (3 / 6 / 12 Channel)", dept: "Cardiology", keywords: "ecg electrocardiogram 12 channel 6 channel 3 channel portable cardiac machine", icon: "bi-graph-up-arrow", url: "catalogue/ecg-machine/index.html" },
    { name: "Suction Machines & Regulators", dept: "General Equipment", keywords: "suction machine surgical suction mobile electric vacuum drainage theatre unit", icon: "bi-funnel", url: "catalogue/suction-machine/index.html" },
    { name: "Syringe & Volumetric Infusion Pumps", dept: "Critical Care", keywords: "syringe pump infusion pump iv pump micro infusion drug delivery pca", icon: "bi-eyedropper", url: "catalogue/syringe-infusion/index.html" },
    { name: "Surgical Instruments & TC Sets", dept: "Precision Tools", keywords: "surgical instruments tungsten carbide tc scissors forceps needle holder retractors sets", icon: "bi-scissors", url: "catalogue/surgical-instruments/index.html" },
    { name: "Holloware Stainless Steel Items", dept: "Hospital Utensils", keywords: "holloware kidney tray bedpan instrument tray bowl gallipot sterilizing drum ss304", icon: "bi-box", url: "catalogue/hollowares-items/index.html" },
    { name: "Medical Gas Pipeline Systems (MGPS)", dept: "Hospital Engineering", keywords: "mgps medical gas pipeline oxygen manifold vacuum alarm panel bed head panel outlet", icon: "bi-diagram-3", url: "turnkey-projects/index.html" },
    { name: "500-Bedded Turnkey Hospital Setup", dept: "Turnkey Projects", keywords: "500 bed turnkey hospital setup construction nabh planning architecture civil mep", icon: "bi-building", url: "turnkey-projects/index.html" },
    { name: "Neonatal Infant Radiant Warmers", dept: "NICU & Pediatric", keywords: "baby warmer infant warmer radiant warmer open care incubator phototherapy neonatal", icon: "bi-thermometer-sun", url: "catalogue/baby-warmer/index.html" },
    { name: "Hospital Trolleys & Crash Carts", dept: "Ward Furniture", keywords: "hospital trolley crash cart dressing trolley medicine cart instrument trolley stretcher", icon: "bi-cart3", url: "catalogue/hospital-trolley/index.html" },
    { name: "Bedside Lockers & Overbed Tables", dept: "Patient Ward", keywords: "bed side locker overbed table food table patient locker abs drawer stainless steel", icon: "bi-archive", url: "catalogue/bed-side-locker/index.html" },
    { name: "Stretcher Trolleys & Patient Transfer", dept: "Patient Transit", keywords: "stretcher trolley patient transfer hydraulic ambulance emergency transfer trolley", icon: "bi-shuffle", url: "catalogue/stretcher-trolley/index.html" },
    { name: "Wheelchairs & Mobility Aids", dept: "Patient Transit", keywords: "wheelchairs wheelchair folding motorized standard commode transit invalid chair", icon: "bi-circle-square", url: "catalogue/wheelchairs/index.html" },
    { name: "Surgical Scrub Stations", dept: "Infection Control", keywords: "scrub station surgical scrub sink automatic sensor stainless steel scrub sink", icon: "bi-water", url: "catalogue/scrub-station/index.html" },
    { name: "Blood Bank Refrigerators & Centrifuges", dept: "Blood Bank Equipment", keywords: "blood bank refrigerator plasma freezer centrifuge blood storage agitation", icon: "bi-moisture", url: "catalogue/blood-bank/index.html" },
    { name: "IVD Analyzers & Laboratory Equipment", dept: "Pathology & Lab", keywords: "ivd in vitro diagnostics hematology analyzer biochemistry centrifuge microscope", icon: "bi-eyedropper", url: "catalogue/ivd-products/index.html" },
    { name: "Disinfection Foggers & Biobins", dept: "Sanitation & Hygiene", keywords: "disposables biobin cleaning scrubs fogger uvc fumigation biomedical waste", icon: "bi-recycle", url: "catalogue/medical-disposables/index.html" },
    { name: "About Dr. Smith (60+ Years Heritage)", dept: "Corporate Heritage", keywords: "about us dr smith surgical wholesale mart kamal kant mahajan danjali jhajjar factory", icon: "bi-info-circle", url: "about-us/index.html" },
    { name: "Corporate Mission & Values", dept: "Corporate Governance", keywords: "mission values quality assurance iso 13485 ce fda compliance ethics", icon: "bi-award", url: "mission-values/index.html" },
    { name: "Global Offices & Contact Desk", dept: "Direct Communication", keywords: "contact phone toll free email delhi kapaspura jhajjar uae sharjah support", icon: "bi-telephone", url: "contact-form/index.html" }
  ];

  // Create Modal DOM dynamically if not already in document
  function ensureSearchModalDOM() {
    if (document.getElementById('apple-search-overlay')) return;

    var prefix = getRootPrefix();

    var modalHtml = `
    <div class="apple-search-overlay" id="apple-search-overlay">
      <div class="apple-search-container" id="apple-search-container">
        
        <!-- Search Input Bar -->
        <div class="apple-search-header">
          <i class="bi bi-search"></i>
          <input type="text" id="apple-modal-search-input" class="apple-search-input" placeholder="Search equipment, ICU beds, OT suites, ventilators..." autocomplete="off" spellcheck="false">
          <button type="button" class="apple-search-close-btn" id="apple-search-close-btn" aria-label="Close search">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Quick Trending Suggestions -->
        <div class="apple-search-suggestions">
          <span>Trending:</span>
          <a href="#" class="apple-search-tag" data-query="ICU Beds">ICU Beds</a>
          <a href="#" class="apple-search-tag" data-query="Modular OT">Modular OT</a>
          <a href="#" class="apple-search-tag" data-query="Ventilators">Ventilators</a>
          <a href="#" class="apple-search-tag" data-query="Anesthesia">Anesthesia</a>
          <a href="#" class="apple-search-tag" data-query="C-Arm">C-Arm</a>
          <a href="#" class="apple-search-tag" data-query="Autoclaves">Autoclaves</a>
          <a href="#" class="apple-search-tag" data-query="Turnkey">Turnkey Setup</a>
        </div>

        <!-- Dynamic Results List -->
        <div class="apple-search-results" id="apple-search-results">
          <!-- Results injected via JS -->
        </div>

        <!-- Footer / Keyboard hint -->
        <div class="apple-search-footer">
          <span><kbd>ESC</kbd> to close &bull; Instant search across 50+ departments</span>
          <a href="${prefix}catalogue/index.html" class="text-decoration-none text-info">Full Catalogue &rarr;</a>
        </div>

      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Bind events
    var overlay = document.getElementById('apple-search-overlay');
    var closeBtn = document.getElementById('apple-search-close-btn');
    var input = document.getElementById('apple-modal-search-input');

    if (closeBtn) {
      closeBtn.addEventListener('click', closeGlobalSearch);
    }

    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          closeGlobalSearch();
        }
      });
    }

    if (input) {
      input.addEventListener('input', function() {
        renderSearchResults(this.value.trim());
      });
    }

    // Bind trending tags
    document.querySelectorAll('.apple-search-tag').forEach(function(tag) {
      tag.addEventListener('click', function(e) {
        e.preventDefault();
        var q = this.getAttribute('data-query');
        if (input) {
          input.value = q;
          renderSearchResults(q);
        }
      });
    });
  }

  function renderSearchResults(query) {
    var resultsContainer = document.getElementById('apple-search-results');
    if (!resultsContainer) return;

    var prefix = getRootPrefix();
    var q = (query || '').toLowerCase();

    var filtered = SEARCH_INDEX.filter(function(item) {
      if (!q) return true;
      return item.name.toLowerCase().includes(q) ||
             item.dept.toLowerCase().includes(q) ||
             item.keywords.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div class="text-center py-4 text-muted">
          <i class="bi bi-search fs-3 mb-2 d-block text-secondary"></i>
          <p class="mb-1 text-white fw-semibold">No equipment found matching "${query}"</p>
          <small class="text-muted">Try searching for generic terms like "Beds", "OT", "Ventilator", or "Turnkey".</small>
        </div>`;
      return;
    }

    var html = '';
    filtered.slice(0, 8).forEach(function(item) {
      html += `
        <a href="${prefix}${item.url}" class="apple-search-result-item">
          <div class="apple-search-result-left">
            <div class="apple-search-result-icon">
              <i class="bi ${item.icon}"></i>
            </div>
            <div>
              <div class="apple-search-result-title">${item.name}</div>
              <div class="apple-search-result-dept">${item.dept}</div>
            </div>
          </div>
          <div class="apple-search-result-arrow">
            <i class="bi bi-arrow-right"></i>
          </div>
        </a>`;
    });

    resultsContainer.innerHTML = html;
  }

  window.openGlobalSearch = function() {
    ensureSearchModalDOM();
    var overlay = document.getElementById('apple-search-overlay');
    var input = document.getElementById('apple-modal-search-input');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      renderSearchResults('');
      setTimeout(function() {
        if (input) input.focus();
      }, 100);
    }
  };

  window.closeGlobalSearch = function() {
    var overlay = document.getElementById('apple-search-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Global Keyboard Shortcuts (Esc to close, Ctrl+K / Cmd+K to open)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.closeGlobalSearch();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      window.openGlobalSearch();
    }
  });

  // Attach click handler to all search triggers on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    ensureSearchModalDOM();
    document.querySelectorAll('.apple-nav-circle-btn[aria-label*="Search"]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.openGlobalSearch();
      });
    });
  });

  // ============================================================
  // GLOBAL APPLE MOBILE NAVIGATION DRAWER CONTROLLER
  // ============================================================
  function initGlobalMobileDrawer() {
    var mobileMenuBtn = document.getElementById('apple-mobile-menu-btn');
    var mobileBackdrop = document.getElementById('appleMobileBackdrop');
    var mobileDrawerClose = document.getElementById('appleMobileDrawerClose');
    var mobileSavedScrollY = 0;

    function toggleMobileDrawer(open) {
      var isOpen = typeof open === 'boolean' ? open : !document.body.classList.contains('apple-mobile-menu-open');
      if (isOpen) {
        mobileSavedScrollY = window.pageYOffset || document.documentElement.scrollTop;
        document.documentElement.classList.add('apple-mobile-menu-open');
        document.body.classList.add('apple-mobile-menu-open');
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + mobileSavedScrollY + 'px';
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
      } else {
        var scrollY = mobileSavedScrollY;
        document.documentElement.classList.remove('apple-mobile-menu-open');
        document.body.classList.remove('apple-mobile-menu-open');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        if (typeof scrollY === 'number') {
          window.scrollTo(0, scrollY);
        }
      }

      if (mobileMenuBtn) {
        var icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          if (isOpen) {
            icon.classList.remove('bi-list');
            icon.classList.add('bi-x-lg');
          } else {
            icon.classList.remove('bi-x-lg');
            icon.classList.add('bi-list');
          }
        }
      }
    }

    window.toggleMobileDrawer = toggleMobileDrawer;

    if (mobileMenuBtn) {
      // Clone and replace to strip any conflicting duplicate listeners from legacy scripts
      var freshBtn = mobileMenuBtn.cloneNode(true);
      if (mobileMenuBtn.parentNode) {
        mobileMenuBtn.parentNode.replaceChild(freshBtn, mobileMenuBtn);
      }
      mobileMenuBtn = freshBtn;

      mobileMenuBtn.onclick = function(e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        toggleMobileDrawer();
      };
    }

    if (mobileBackdrop) {
      mobileBackdrop.onclick = function(e) {
        if (e) e.preventDefault();
        toggleMobileDrawer(false);
      };
      mobileBackdrop.addEventListener('touchmove', function(e) {
        e.preventDefault();
      }, { passive: false });
    }

    if (mobileDrawerClose) {
      mobileDrawerClose.onclick = function(e) {
        if (e) e.preventDefault();
        toggleMobileDrawer(false);
      };
    }

    document.querySelectorAll('.apple-mobile-links a, .apple-mobile-tile').forEach(function(link) {
      link.onclick = function() {
        toggleMobileDrawer(false);
      };
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && document.body.classList.contains('apple-mobile-menu-open')) {
        toggleMobileDrawer(false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalMobileDrawer);
  } else {
    initGlobalMobileDrawer();
  }

})();

