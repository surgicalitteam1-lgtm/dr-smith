/**
 * Dr. Smith Healthcare Solutions - Official Contact & Consultation Form Controller
 * Local copy for contact-form directory
 */

(function() {
  'use strict';

  var SCOPE_MAP = {
    'turnkey': 'Turnkey Hospital Setup',
    'hospital': 'Turnkey Hospital Setup',
    'turnkey consultation': 'Turnkey Hospital Setup',
    'modular ot': 'Modular Operation Theatre',
    'ot': 'Modular Operation Theatre',
    'mot': 'Modular Operation Theatre',
    'cleanroom': 'Modular Operation Theatre',
    'mgps': 'Medical Gas Pipeline (MGPS)',
    'gas': 'Medical Gas Pipeline (MGPS)',
    'pipeline': 'Medical Gas Pipeline (MGPS)',
    'bed': 'ICU & Hospital Beds',
    'beds': 'ICU & Hospital Beds',
    'icu': 'ICU & Hospital Beds',
    'critical': 'Critical Care Devices',
    'ventilator': 'Critical Care Devices',
    'monitor': 'Critical Care Devices',
    'anesthesia': 'Critical Care Devices',
    'c-arm': 'Critical Care Devices',
    'ultrasound': 'Critical Care Devices',
    'export': 'International Export',
    'tenders': 'International Export'
  };

  window.selectScopeChipByName = function(name) {
    if (!name) return;
    var norm = name.toLowerCase().trim();
    var targetScope = SCOPE_MAP[norm] || name;

    var chips = document.querySelectorAll('#contactScopeChips .apple-category-chip');
    var matched = false;

    chips.forEach(function(btn) {
      var scopeAttr = btn.getAttribute('data-scope');
      if (scopeAttr && (scopeAttr.toLowerCase() === targetScope.toLowerCase() || targetScope.toLowerCase().includes(scopeAttr.toLowerCase()))) {
        chips.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        matched = true;

        var input = document.getElementById('contactScopeInput');
        var label = document.getElementById('selectedScopeLabel');
        if (input) input.value = scopeAttr;
        if (label) label.textContent = scopeAttr;
      }
    });

    return matched;
  };

  window.clearProductInquiry = function() {
    var banner = document.getElementById('productInquiryBanner');
    if (banner) banner.classList.add('d-none');
    var notes = document.getElementById('contactScopeNotes');
    if (notes && notes.value.startsWith('Hello Dr. Smith Team,')) {
      notes.value = '';
    }
  };

  function initContactScopeChips() {
    var chips = document.querySelectorAll('#contactScopeChips .apple-category-chip');
    chips.forEach(function(btn) {
      btn.addEventListener('click', function() {
        chips.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        var scope = this.getAttribute('data-scope');
        var input = document.getElementById('contactScopeInput');
        var label = document.getElementById('selectedScopeLabel');
        if (input) input.value = scope;
        if (label) label.textContent = scope;
      });
    });
  }

  function parseUrlParameters() {
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var productParam = urlParams.get('product');
      var scopeParam = urlParams.get('scope');

      if (scopeParam) {
        window.selectScopeChipByName(scopeParam);
      }

      if (productParam) {
        var cleanProduct = decodeURIComponent(productParam).trim();
        var banner = document.getElementById('productInquiryBanner');
        var productNameEl = document.getElementById('productInquiryName');
        var notesEl = document.getElementById('contactScopeNotes');

        if (banner && productNameEl) {
          productNameEl.textContent = cleanProduct;
          banner.classList.remove('d-none');
        }

        if (notesEl && (!notesEl.value || notesEl.value.trim() === '')) {
          notesEl.value = 'Hello Dr. Smith Team,\nI would like to request an official quotation, technical datasheet, and delivery timeline for: ' + cleanProduct + '.';
        }

        if (!scopeParam) {
          var pLower = cleanProduct.toLowerCase();
          if (pLower.includes('bed') || pLower.includes('crib') || pLower.includes('fowler') || pLower.includes('locker') || pLower.includes('mattress')) {
            window.selectScopeChipByName('ICU & Hospital Beds');
          } else if (pLower.includes('ot') || pLower.includes('theatre') || pLower.includes('cleanroom') || pLower.includes('light') || pLower.includes('table')) {
            window.selectScopeChipByName('Modular Operation Theatre');
          } else if (pLower.includes('gas') || pLower.includes('mgps') || pLower.includes('pipeline') || pLower.includes('manifold')) {
            window.selectScopeChipByName('Medical Gas Pipeline (MGPS)');
          } else if (pLower.includes('ventilator') || pLower.includes('monitor') || pLower.includes('defibrillator') || pLower.includes('c-arm') || pLower.includes('ultrasound') || pLower.includes('anesthesia')) {
            window.selectScopeChipByName('Critical Care Devices');
          }
        }

        setTimeout(function() {
          var card = document.getElementById('contactMainFormCard');
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      }
    } catch (err) {
      console.warn('URL parameter parsing error:', err);
    }
  }

  function initInputValidationListeners() {
    var inputs = document.querySelectorAll('.apple-glass-input');
    inputs.forEach(function(input) {
      input.addEventListener('input', function() {
        this.classList.remove('input-error');
        var parentGroup = this.closest('.apple-form-group');
        if (parentGroup) parentGroup.classList.remove('has-error');
      });
    });
  }

  window.handleContactPageSubmit = function(e) {
    if (e && e.preventDefault) e.preventDefault();

    var nameInput = document.getElementById('contactFullName');
    var orgInput = document.getElementById('contactOrgName');
    var emailInput = document.getElementById('contactEmailInput');
    var phoneInput = document.getElementById('contactPhoneInput');
    var scopeInput = document.getElementById('contactScopeInput');
    var submitBtn = document.getElementById('contactSubmitButton');

    var isValid = true;
    var firstInvalid = null;

    if (!nameInput || !nameInput.value.trim()) {
      isValid = false;
      if (nameInput) {
        nameInput.classList.add('input-error');
        if (!firstInvalid) firstInvalid = nameInput;
      }
    }

    if (!orgInput || !orgInput.value.trim()) {
      isValid = false;
      if (orgInput) {
        orgInput.classList.add('input-error');
        if (!firstInvalid) firstInvalid = orgInput;
      }
    }

    var emailVal = (emailInput && emailInput.value.trim()) || '';
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      isValid = false;
      if (emailInput) {
        emailInput.classList.add('input-error');
        if (!firstInvalid) firstInvalid = emailInput;
      }
    }

    var phoneVal = (phoneInput && phoneInput.value.trim()) || '';
    var digitsOnly = phoneVal.replace(/\D/g, '');
    if (!phoneVal || digitsOnly.length < 7) {
      isValid = false;
      if (phoneInput) {
        phoneInput.classList.add('input-error');
        if (!firstInvalid) firstInvalid = phoneInput;
      }
    }

    if (!isValid) {
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return false;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> <span>Processing Request...</span>';
    }

    setTimeout(function() {
      var clientName = (nameInput && nameInput.value.trim()) || 'Doctor / Healthcare Partner';
      var clientScope = (scopeInput && scopeInput.value) || 'Turnkey Hospital Setup';
      var refNum = 'DS-' + Math.floor(10000 + Math.random() * 90000);

      var clientNameEl = document.getElementById('successClientName');
      var scopeBadgeEl = document.getElementById('successScopeBadge');
      var refCodeEl = document.getElementById('successRefCode');

      if (clientNameEl) clientNameEl.textContent = clientName;
      if (scopeBadgeEl) scopeBadgeEl.textContent = clientScope;
      if (refCodeEl) refCodeEl.textContent = '#' + refNum;

      var form = document.getElementById('contactPageForm');
      var successCard = document.getElementById('contactSuccessState');

      if (form) form.classList.add('d-none');
      if (successCard) successCard.classList.remove('d-none');

      var formCard = document.getElementById('contactMainFormCard');
      if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 600);
  };

  window.resetContactPageForm = function() {
    var form = document.getElementById('contactPageForm');
    var successCard = document.getElementById('contactSuccessState');
    var submitBtn = document.getElementById('contactSubmitButton');

    if (form) {
      form.reset();
      form.classList.remove('d-none');
    }
    if (successCard) {
      successCard.classList.add('d-none');
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Submit Consultation Request</span> <i class="bi bi-arrow-right ms-1"></i>';
    }

    window.clearProductInquiry();
    window.selectScopeChipByName('Turnkey Hospital Setup');
  };

  function init() {
    initContactScopeChips();
    parseUrlParameters();
    initInputValidationListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
