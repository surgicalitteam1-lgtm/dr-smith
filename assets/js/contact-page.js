/**
 * Dr. Smith Healthcare - Contact Page Controller
 * Handles interactive category scope chips, in-place animated quote submission, and form reset.
 */
(function() {
  'use strict';

  function initContactScopeChips() {
    var chips = document.querySelectorAll('#contactScopeChips .apple-category-chip');
    chips.forEach(function(btn) {
      btn.addEventListener('click', function() {
        chips.forEach(function(b) {
          b.classList.remove('active');
        });
        this.classList.add('active');
        var scope = this.getAttribute('data-scope');
        var input = document.getElementById('contactScopeInput');
        var label = document.getElementById('selectedScopeLabel');
        if (input) input.value = scope;
        if (label) label.textContent = scope;
      });
    });
  }

  // In-Place Animated Success Handler (No Browser Alerts)
  window.handleContactPageSubmit = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    var form = document.getElementById('contactPageForm');
    var name = (document.getElementById('contactFullName') && document.getElementById('contactFullName').value.trim()) || 'Doctor / Partner';
    var scope = (document.getElementById('contactScopeInput') && document.getElementById('contactScopeInput').value) || 'Turnkey Hospital Setup';
    var refNum = 'DS-' + Math.floor(1000 + Math.random() * 9000);

    var clientNameEl = document.getElementById('successClientName');
    var scopeBadgeEl = document.getElementById('successScopeBadge');
    var refCodeEl = document.getElementById('successRefCode');

    if (clientNameEl) clientNameEl.textContent = name;
    if (scopeBadgeEl) scopeBadgeEl.textContent = scope;
    if (refCodeEl) refCodeEl.textContent = '#' + refNum;

    if (form) form.classList.add('d-none');
    var successCard = document.getElementById('contactSuccessState');
    if (successCard) successCard.classList.remove('d-none');

    // Scroll smoothly to success state if needed
    var formCard = document.getElementById('contactMainFormCard');
    if (formCard) {
      formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  window.resetContactPageForm = function() {
    var form = document.getElementById('contactPageForm');
    if (form) {
      form.reset();
      form.classList.remove('d-none');
    }
    var successCard = document.getElementById('contactSuccessState');
    if (successCard) successCard.classList.add('d-none');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactScopeChips);
  } else {
    initContactScopeChips();
  }
})();
