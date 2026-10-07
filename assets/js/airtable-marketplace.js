/**
 * Dr. Smith - Airtable Marketplace & Community Listings
 * 
 * Features:
 * 1. 2-Step Guided Listing Wizard (First: Select Category -> Second: Provide Item Details & Photo)
 * 2. Instant Upload & Submission to Airtable with 'Pending' Review status
 * 3. Dynamic Live Display of Owner-Approved items with Category Filtering
 * 4. 100% Theme Consistency with Dr. Smith Design Language
 */

(function () {
  'use strict';

  // Airtable Configuration
  const AIRTABLE_CONFIG = {
    baseId: 'app5QujkCDRyTN6ZV',
    tableName: 'Table 1',
    membersTableName: 'Members',
    token: 'patDHLpw8Sua4J4e2.acf2df74be5142879179f2b4997432e025d43e6d57ed7f2ff13d90028199324f',
    apiEndpoint: window.DR_SMITH_AUTH_API || ''
  };

  let allApprovedRecords = [];
  let currentActiveCategory = 'all';
  let activeMember = null;

  /**
   * Session Management with Cryptographic Anti-Tampering Shield
   */
  function loadActiveMember() {
    try {
      const saved = localStorage.getItem('drsmith_admin_session') || sessionStorage.getItem('drsmith_member');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Verify session signature to block unauthorized DevTools edits
        if (window.DrSmithSecurity && typeof window.DrSmithSecurity.verifySessionSignature === 'function') {
          if (!window.DrSmithSecurity.verifySessionSignature(parsed)) {
            console.warn('[Security Guard] Tampered session detected in marketplace wizard. Resetting.');
            clearActiveMember();
            return null;
          }
        }
        activeMember = parsed;
      } else {
        activeMember = null;
      }
    } catch (e) {
      activeMember = null;
    }
    return activeMember;
  }

  function saveActiveMember(member) {
    // Seal session using DrSmithSecurity
    const sealed = (window.DrSmithSecurity && typeof window.DrSmithSecurity.sealSession === 'function')
      ? window.DrSmithSecurity.sealSession(member)
      : member;

    activeMember = sealed;
    try {
      localStorage.setItem('drsmith_admin_session', JSON.stringify(sealed));
      sessionStorage.setItem('drsmith_member', JSON.stringify(sealed));
      if (window.DrSmithAdmin && window.DrSmithAdmin.syncUI) {
        window.DrSmithAdmin.syncUI();
      }
    } catch (e) {}
  }

  function clearActiveMember() {
    activeMember = null;
    try {
      localStorage.removeItem('drsmith_admin_session');
      sessionStorage.removeItem('drsmith_member');
      if (window.DrSmithAdmin && window.DrSmithAdmin.syncUI) {
        window.DrSmithAdmin.syncUI();
      }
    } catch (e) {}
  }

  // In-memory cache for ultra-fast local credential lookups
  let cachedMembers = null;

  /**
   * Resilient multi-path loader for data/members.json.
   */
  async function fetchMembersJson() {
    if (cachedMembers && Array.isArray(cachedMembers) && cachedMembers.length > 0) {
      return cachedMembers;
    }
    const path = window.location.pathname.toLowerCase();
    const isCatalogue = path.includes('/catalogue') || document.querySelector('link[href*="../assets/"]') !== null || document.querySelector('script[src*="../assets/"]') !== null;
    const prefix = isCatalogue ? '../' : '';

    const candidateUrls = [
      `${prefix}data/members.json?t=${Date.now()}`,
      `../data/members.json?t=${Date.now()}`,
      `./data/members.json?t=${Date.now()}`,
      `data/members.json?t=${Date.now()}`,
      `/dr-smith/data/members.json?t=${Date.now()}`,
      `/data/members.json?t=${Date.now()}`
    ];

    for (const url of candidateUrls) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            cachedMembers = data;
            return data;
          }
        }
      } catch (e) {}
    }
    return cachedMembers || [];
  }

  /**
   * Fetch approved equipment listings from Airtable
   */
  async function fetchApprovedListings() {
    const container = document.getElementById('approved-listings-grid');
    if (!container) return;

    try {
      const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableName)}?filterByFormula=${encodeURIComponent("{Status} = 'Approved'")}&sort[0][field]=Name&sort[0][direction]=asc`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_CONFIG.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      allApprovedRecords = data.records || [];
      renderFilteredListings();
      initCategoryFilters();
    } catch (err) {
      console.warn('Could not load marketplace listings:', err);
      container.innerHTML = `
        <div class="col-12 text-center py-4">
          <div class="p-4 rounded-3 border bg-light text-muted" style="max-width: 500px; margin: 0 auto;">
            <i class="bi bi-info-circle fs-3 text-primary d-block mb-2"></i>
            <p class="mb-0">Verified listings are currently being updated. Please check back shortly or contact our team directly.</p>
          </div>
        </div>
      `;
    }
  }

  /**
   * Setup Category Filter Click Listeners
   */
  function initCategoryFilters() {
    const filterContainer = document.getElementById('marketplace-category-filters');
    if (!filterContainer) return;

    const filterBtns = filterContainer.querySelectorAll('.marketplace-filter-pill');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        currentActiveCategory = this.getAttribute('data-category') || 'all';
        renderFilteredListings();
      });
    });
  }

  /**
   * Render listings based on active category filter
   */
  function renderFilteredListings() {
    const container = document.getElementById('approved-listings-grid');
    if (!container) return;

    const filtered = allApprovedRecords.filter(record => {
      if (currentActiveCategory === 'all') return true;
      const cat = (record.fields.Category || '').toLowerCase();
      return cat.includes(currentActiveCategory.toLowerCase());
    });

    if (filtered.length === 0) {
      if (allApprovedRecords.length === 0) {
        container.innerHTML = `
          <div class="col-12 text-center py-5">
            <div class="p-4 rounded-4 border bg-white shadow-sm" style="max-width: 520px; margin: 0 auto;">
              <div class="mb-3" style="width: 56px; height: 56px; border-radius: 50%; background: color-mix(in srgb, var(--accent-color), transparent 88%); color: var(--accent-color); display: inline-flex; align-items: center; justify-content: center; font-size: 1.6rem;">
                <i class="bi bi-box-seam"></i>
              </div>
              <h5 class="fw-bold mb-2" style="font-family: var(--heading-font); color: var(--heading-color);">Verified Listings Coming Soon</h5>
              <p class="text-muted mb-0 small" style="line-height: 1.6;">Approved certified hospital equipment, diagnostic tools, and surgical equipment will be listed here after administrator verification.</p>
            </div>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="col-12 text-center py-5">
            <div class="p-4 rounded-3 border bg-white shadow-sm text-muted" style="max-width: 480px; margin: 0 auto;">
              <i class="bi bi-folder2-open fs-2 text-primary d-block mb-2"></i>
              <p class="mb-1 fw-bold" style="color: var(--heading-color);">No approved listings in this category yet</p>
              <p class="small text-muted mb-0">Please check back soon or browse our other verified equipment categories.</p>
            </div>
          </div>
        `;
      }
      return;
    }

    const cssLink = document.querySelector('link[href*="assets/css"]');
    const assetPrefix = (cssLink && cssLink.getAttribute('href').startsWith('../')) ? '../' : '';

    container.innerHTML = filtered.map(record => {
      const f = record.fields;
      const title = escapeHtml(f.Name || 'Medical Equipment');
      const category = escapeHtml(f.Category || 'Equipment');
      const price = escapeHtml(f.Price || 'Contact for Quote');
      const desc = escapeHtml(f.Description || 'No description provided.');
      
      let imageUrl = assetPrefix + 'assets/img/illustration/illustration-28.webp';
      if (f.Attachments && f.Attachments.length > 0) {
        imageUrl = f.Attachments[0].thumbnails ? f.Attachments[0].thumbnails.large.url : f.Attachments[0].url;
      }

      const contactUrl = assetPrefix + 'contact-form/index.html?inquiry=' + encodeURIComponent(title);

      return `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="marketplace-card">
            <div class="card-img-wrap">
              <img src="${imageUrl}" alt="${title}" onerror="this.src='${assetPrefix}assets/img/illustration/illustration-28.webp'">
              <span class="card-category-badge position-absolute top-0 start-0 m-3">
                ${category}
              </span>
              <span class="card-verified-badge position-absolute bottom-0 end-0 m-3">
                <i class="bi bi-patch-check-fill text-success"></i> Verified
              </span>
            </div>
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <div class="card-price">${price}</div>
              <p class="card-desc">
                ${desc}
              </p>
              <div class="pt-3 border-top mt-auto">
                <a href="${contactUrl}" class="card-action-btn w-100">
                  <i class="bi bi-envelope me-1"></i> Inquire Now
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Helper: Escape HTML to avoid XSS
   */
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * 3-Step Listing Submission Wizard with Member ID & Password Auth
   */
  function initSubmissionWizard() {
    const modalEl = document.getElementById('uploadListingModal');
    if (!modalEl) return;

    const stepAuth = document.getElementById('wizardStepAuth');
    const step1 = document.getElementById('wizardStep1');
    const step2 = document.getElementById('wizardStep2');
    const stepSuccess = document.getElementById('wizardSuccessStep');

    const indicatorsBar = document.getElementById('wizardStepIndicatorsBar');
    const stepAuthIndicator = document.getElementById('stepAuthIndicator');
    const step1Indicator = document.getElementById('step1Indicator');
    const step2Indicator = document.getElementById('step2Indicator');
    const stepAuthBadge = document.getElementById('stepAuthBadge');
    const stepAuthText = document.getElementById('stepAuthText');
    const step1Badge = document.getElementById('step1Badge');
    const step1Text = document.getElementById('step1Text');
    const step2Badge = document.getElementById('step2Badge');
    const step2Text = document.getElementById('step2Text');

    const memberAuthBanner = document.getElementById('memberAuthBanner');
    const activeMemberNameEl = document.getElementById('activeMemberName');
    const activeMemberIdEl = document.getElementById('activeMemberId');
    const memberSignOutBtn = document.getElementById('memberSignOutBtn');

    const memberLoginForm = document.getElementById('memberLoginForm');
    const memberIdInput = document.getElementById('memberIdInput');
    const memberPassInput = document.getElementById('memberPassInput');
    const memberLoginBtn = document.getElementById('memberLoginBtn');
    const memberLoginSpinner = document.getElementById('memberLoginSpinner');
    const memberLoginBtnText = document.getElementById('memberLoginBtnText');
    const memberAuthAlert = document.getElementById('memberAuthAlert');
    const togglePassBtn = document.getElementById('togglePassVisibility');

    const categoryCards = document.querySelectorAll('.wizard-category-card');
    const selectedCategoryInput = document.getElementById('listingCategory');
    const chosenCategoryBadge = document.getElementById('chosenCategoryBadge');
    const backToStep1Btn = document.getElementById('backToStep1Btn');

    const form = document.getElementById('listingSubmissionForm');
    const imageInput = document.getElementById('listingImage');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImg = document.getElementById('listingImagePreview');
    const submitBtn = document.getElementById('submitListingBtn');
    const submitSpinner = document.getElementById('submitSpinner');
    const submitText = document.getElementById('submitText');
    const statusMsg = document.getElementById('listingStatusMsg');

    const uploadAnotherBtn = document.getElementById('uploadAnotherBtn');
    const successCategoryBadge = document.getElementById('successCategoryBadge');
    const successSubmitterInfo = document.getElementById('successSubmitterInfo');

    function updateMemberBanner() {
      if (activeMember && memberAuthBanner) {
        if (activeMemberNameEl) activeMemberNameEl.textContent = activeMember.Name || 'Member';
        if (activeMemberIdEl) activeMemberIdEl.textContent = activeMember.MemberID || '';
        memberAuthBanner.classList.remove('d-none');
        memberAuthBanner.classList.add('d-flex');
      } else if (memberAuthBanner) {
        memberAuthBanner.classList.add('d-none');
        memberAuthBanner.classList.remove('d-flex');
      }
    }

    let memberCooldownInterval = null;

    function formatMemberTime(sec) {
      if (sec >= 60) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return s > 0 ? `${m}m ${String(s).padStart(2, '0')}s` : `${m}m 00s`;
      }
      return `${sec}s`;
    }

    function startMemberCooldownTimer() {
      if (memberCooldownInterval) clearInterval(memberCooldownInterval);

      function tick() {
        const lockout = (window.DrSmithSecurity && typeof window.DrSmithSecurity.rateLimiter.checkLockout === 'function')
          ? window.DrSmithSecurity.rateLimiter.checkLockout()
          : { locked: false, remainingSec: 0, tier: 1 };

        if (lockout.locked && lockout.remainingSec > 0) {
          const timeStr = formatMemberTime(lockout.remainingSec);
          if (memberLoginBtn) memberLoginBtn.disabled = true;
          if (memberLoginSpinner) memberLoginSpinner.classList.add('d-none');
          if (memberLoginBtnText) {
            memberLoginBtnText.innerHTML = `<i class="bi bi-hourglass-split me-1"></i> Wait ${timeStr}`;
          }
          if (memberAuthAlert) {
            memberAuthAlert.innerHTML = `
              <div class="d-flex align-items-start">
                <i class="bi bi-shield-slash-fill me-2 fs-5 text-danger flex-shrink-0 mt-1"></i>
                <div>
                  <strong class="text-danger">Security Cooldown:</strong> 3 failed attempts reached.<br>
                  Please wait <span class="badge bg-danger fs-6 px-2 py-1 mx-1" style="font-family: monospace;">${timeStr}</span> before trying again.
                  ${lockout.tier > 1 ? `<div class="text-muted small mt-1" style="font-size: 0.8rem;"><i class="bi bi-shield-exclamation me-1 text-warning"></i>Extended cooldown (Tier ${lockout.tier}) due to repeated lockout cycles.</div>` : ''}
                </div>
              </div>
            `;
            memberAuthAlert.className = 'alert alert-danger py-2 px-3 small rounded-3 mb-3';
            memberAuthAlert.classList.remove('d-none');
          }
        } else {
          clearInterval(memberCooldownInterval);
          memberCooldownInterval = null;
          if (memberLoginBtn) memberLoginBtn.disabled = false;
          if (memberLoginSpinner) memberLoginSpinner.classList.add('d-none');
          if (memberLoginBtnText) {
            memberLoginBtnText.innerHTML = '<i class="bi bi-unlock me-1"></i> Verify &amp; Unlock Portal';
          }
          if (memberAuthAlert && memberAuthAlert.textContent.includes('Cooldown')) {
            memberAuthAlert.innerHTML = `<i class="bi bi-check-circle-fill me-1 text-success"></i> <strong>Cooldown Complete:</strong> You can enter your credentials now.`;
            memberAuthAlert.className = 'alert alert-success py-2 px-3 small rounded-3 mb-3';
            memberAuthAlert.classList.remove('d-none');
          }
        }
      }

      tick();
      memberCooldownInterval = setInterval(tick, 1000);
    }

    function showAuthAlert(msg) {
      if (!memberAuthAlert) return;
      if (!msg) {
        memberAuthAlert.classList.add('d-none');
        memberAuthAlert.textContent = '';
      } else {
        memberAuthAlert.innerHTML = msg;
        memberAuthAlert.className = 'alert alert-danger py-2 px-3 small rounded-3 mb-3';
        memberAuthAlert.classList.remove('d-none');
      }
    }

    function setAuthLoading(loading) {
      if (memberLoginBtn) memberLoginBtn.disabled = loading;
      if (memberLoginSpinner) memberLoginSpinner.classList.toggle('d-none', !loading);
      if (memberLoginBtnText) {
        memberLoginBtnText.innerHTML = loading
          ? 'Verifying Credentials...'
          : '<i class="bi bi-unlock me-1"></i> Verify &amp; Unlock Portal';
      }
    }

    function goToStep(stepNum) {
      if (stepNum === 0) {
        // Step 0: Member Login Screen
        if (stepAuth) stepAuth.classList.remove('d-none');
        if (step1) step1.classList.add('d-none');
        if (step2) step2.classList.add('d-none');
        if (stepSuccess) stepSuccess.classList.add('d-none');
        if (indicatorsBar) indicatorsBar.classList.remove('d-none');

        if (stepAuthIndicator) stepAuthIndicator.className = 'wizard-step-item active d-flex align-items-center';
        if (step1Indicator) step1Indicator.className = 'wizard-step-item d-flex align-items-center text-muted';
        if (step2Indicator) step2Indicator.className = 'wizard-step-item d-flex align-items-center text-muted';

        if (stepAuthBadge) {
          stepAuthBadge.className = 'badge rounded-circle bg-primary me-2 px-2 py-1';
          stepAuthBadge.innerHTML = '<i class="bi bi-shield-lock"></i>';
        }
        if (stepAuthText) stepAuthText.className = 'fw-bold small text-primary';

        if (step1Badge) {
          step1Badge.className = 'badge rounded-circle bg-secondary me-2 px-2 py-1';
          step1Badge.textContent = '1';
        }
        if (step1Text) step1Text.className = 'fw-semibold small text-muted';

        if (step2Badge) {
          step2Badge.className = 'badge rounded-circle bg-secondary me-2 px-2 py-1';
          step2Badge.textContent = '2';
        }
        if (step2Text) step2Text.className = 'fw-semibold small text-muted';
      } else if (stepNum === 1) {
        // Step 1: Select Category
        if (stepAuth) stepAuth.classList.add('d-none');
        if (step1) step1.classList.remove('d-none');
        if (step2) step2.classList.add('d-none');
        if (stepSuccess) stepSuccess.classList.add('d-none');
        if (indicatorsBar) indicatorsBar.classList.remove('d-none');

        if (stepAuthIndicator) stepAuthIndicator.className = 'wizard-step-item d-flex align-items-center text-success';
        if (step1Indicator) step1Indicator.className = 'wizard-step-item active d-flex align-items-center';
        if (step2Indicator) step2Indicator.className = 'wizard-step-item d-flex align-items-center text-muted';

        if (stepAuthBadge) {
          stepAuthBadge.className = 'badge rounded-circle bg-success me-2 px-2 py-1';
          stepAuthBadge.innerHTML = '<i class="bi bi-check-lg"></i>';
        }
        if (stepAuthText) stepAuthText.className = 'fw-bold small text-success';

        if (step1Badge) {
          step1Badge.className = 'badge rounded-circle bg-primary me-2 px-2 py-1';
          step1Badge.textContent = '1';
        }
        if (step1Text) step1Text.className = 'fw-bold small text-primary';

        if (step2Badge) {
          step2Badge.className = 'badge rounded-circle bg-secondary me-2 px-2 py-1';
          step2Badge.textContent = '2';
        }
        if (step2Text) step2Text.className = 'fw-semibold small text-muted';
      } else if (stepNum === 2) {
        // Step 2: Item Details & Photos
        if (stepAuth) stepAuth.classList.add('d-none');
        if (step1) step1.classList.add('d-none');
        if (step2) step2.classList.remove('d-none');
        if (stepSuccess) stepSuccess.classList.add('d-none');
        if (indicatorsBar) indicatorsBar.classList.remove('d-none');

        if (stepAuthIndicator) stepAuthIndicator.className = 'wizard-step-item d-flex align-items-center text-success';
        if (step1Indicator) step1Indicator.className = 'wizard-step-item d-flex align-items-center text-success';
        if (step2Indicator) step2Indicator.className = 'wizard-step-item active d-flex align-items-center';

        if (stepAuthBadge) {
          stepAuthBadge.className = 'badge rounded-circle bg-success me-2 px-2 py-1';
          stepAuthBadge.innerHTML = '<i class="bi bi-check-lg"></i>';
        }
        if (stepAuthText) stepAuthText.className = 'fw-bold small text-success';

        if (step1Badge) {
          step1Badge.className = 'badge rounded-circle bg-success me-2 px-2 py-1';
          step1Badge.innerHTML = '<i class="bi bi-check-lg"></i>';
        }
        if (step1Text) step1Text.className = 'fw-semibold small text-success';

        if (step2Badge) {
          step2Badge.className = 'badge rounded-circle bg-primary me-2 px-2 py-1';
          step2Badge.textContent = '2';
        }
        if (step2Text) step2Text.className = 'fw-bold small text-primary';
      } else if (stepNum === 3) {
        // Step 3: Success Screen
        if (stepAuth) stepAuth.classList.add('d-none');
        if (step1) step1.classList.add('d-none');
        if (step2) step2.classList.add('d-none');
        if (stepSuccess) stepSuccess.classList.remove('d-none');
        if (indicatorsBar) indicatorsBar.classList.add('d-none');
      }
    }

    // Modal show event
    modalEl.addEventListener('show.bs.modal', function () {
      loadActiveMember();
      updateMemberBanner();
      showAuthAlert('');
      showStatus('', '');

      if (form) form.reset();
      if (previewContainer) previewContainer.classList.add('d-none');
      categoryCards.forEach(c => c.classList.remove('selected'));

      if (activeMember) {
        goToStep(1); // Proceed directly to category if already authenticated
      } else {
        goToStep(0); // Require Member ID & Pass
        if (window.DrSmithSecurity && typeof window.DrSmithSecurity.rateLimiter.checkLockout === 'function') {
          const lockout = window.DrSmithSecurity.rateLimiter.checkLockout();
          if (lockout.locked) {
            startMemberCooldownTimer();
          }
        }
      }
    });

    // Toggle password visibility
    if (togglePassBtn && memberPassInput) {
      togglePassBtn.addEventListener('click', function () {
        const isPass = memberPassInput.getAttribute('type') === 'password';
        memberPassInput.setAttribute('type', isPass ? 'text' : 'password');
        this.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
      });
    }

    // Member Sign Out
    if (memberSignOutBtn) {
      memberSignOutBtn.addEventListener('click', function () {
        clearActiveMember();
        updateMemberBanner();
        if (memberLoginForm) memberLoginForm.reset();
        goToStep(0);
      });
    }

    let isMemberSubmitting = false;

    // Member Login Form submission with SQLi, Brute-Force, and Timing Protection
    if (memberLoginForm) {
      async function handleMemberLoginSubmit(e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (isMemberSubmitting) return;

        // 1. Brute-Force Check
        if (window.DrSmithSecurity && typeof window.DrSmithSecurity.rateLimiter.checkLockout === 'function') {
          const lockout = window.DrSmithSecurity.rateLimiter.checkLockout();
          if (lockout.locked) {
            startMemberCooldownTimer();
            return;
          }
        }

        const idVal = (memberIdInput ? memberIdInput.value : '').trim();
        const passVal = (memberPassInput ? memberPassInput.value : '').trim();

        if (!idVal || !passVal) {
          showAuthAlert('Please enter both your Member ID and Password.');
          return;
        }

        isMemberSubmitting = true;
        setAuthLoading(true);
        showAuthAlert('');

        // Realistic verification pause (2.2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2200));

        // 2. Input Security Validation
        if (window.DrSmithSecurity) {
          const isIdSafe = window.DrSmithSecurity.validateMemberId(idVal);
          const isPassSafe = window.DrSmithSecurity.validatePassword(passVal);
          if (!isIdSafe || !isPassSafe) {
            let failMsg = 'Invalid Member ID or Password. Please check credentials.';
            if (window.DrSmithSecurity.rateLimiter) {
              const failResult = window.DrSmithSecurity.rateLimiter.recordFailure();
              if (failResult.locked) {
                startMemberCooldownTimer();
                return;
              }
              failMsg = `Invalid Member ID or Password. Remaining attempts: <strong>${failResult.remainingAttempts}</strong>.`;
            }
            showAuthAlert(failMsg);
            setAuthLoading(false);
            return;
          }
        }

        try {
          let authenticatedMember = null;
          let memberFoundInRepo = false;

          // 2.5 Check Secure Cloud Serverless Auth API if configured
          if (AIRTABLE_CONFIG.apiEndpoint) {
            try {
              const apiRes = await fetch(`${AIRTABLE_CONFIG.apiEndpoint}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: idVal, password: passVal })
              });
              const apiData = await apiRes.json();
              if (apiRes.ok && apiData.success && apiData.user) {
                authenticatedMember = apiData.user;
                if (apiData.token) {
                  authenticatedMember._token = apiData.token;
                }
                memberFoundInRepo = true;
              } else if (apiData.locked) {
                if (window.DrSmithSecurity && window.DrSmithSecurity.rateLimiter) {
                  window.DrSmithSecurity.rateLimiter.recordFailure();
                }
                startMemberCooldownTimer();
                return;
              }
            } catch (apiErr) {
              console.warn('[Auth API] Serverless endpoint unreachable, trying local fallback:', apiErr);
            }
          }

          // 3. Check local repo credentials file (data/members.json) - Immune to SQLi
          if (!authenticatedMember) {
            try {
              const localMembers = await fetchMembersJson();
              if (Array.isArray(localMembers) && localMembers.length > 0) {
                const match = localMembers.find(m => {
                  const mId = String(m.id || m.MemberID || '').trim().toLowerCase();
                  return mId === idVal.toLowerCase();
                });

                if (match) {
                  memberFoundInRepo = true; // Member is defined in authoritative repo file!
                  const expectedPass = String(match.pass || match.password || match.Password || '');
                  const status = String(match.status || match.Status || 'Active').toLowerCase();

                  if (status === 'inactive') {
                    showAuthAlert('This account has been deactivated. Please contact Dr. Smith administration.');
                    setAuthLoading(false);
                    return;
                  }

                  // Cryptographic Salted SHA-256 Hash verification
                  let passMatches = false;
                  if (match.passHash) {
                    const computedHash = (window.DrSmithSecurity && typeof window.DrSmithSecurity.hashCredential === 'function')
                      ? await window.DrSmithSecurity.hashCredential(match.id || idVal, passVal)
                      : '';
                    passMatches = (computedHash === match.passHash);
                  } else if (match.pass || match.password || match.Password) {
                    const expectedPass = String(match.pass || match.password || match.Password || '');
                    passMatches = (expectedPass === passVal);
                  }

                  if (passMatches) {
                    authenticatedMember = {
                      MemberID: match.id || idVal,
                      Name: match.name || match.Name || 'Authorized Member',
                      Organization: match.organization || match.Organization || 'Dr. Smith Healthcare',
                      Department: match.department || match.Department || '',
                      Role: match.role || match.Role || match.department || 'Authorized Member'
                    };
                  }
                }
              }
            } catch (localErr) {
              console.warn('Local credential lookup note:', localErr);
            }
          }

          // 4. Parameterized Airtable Fallback (Immune to Formula Injection)
          // Only check Airtable fallback if the member was NOT found in data/members.json!
          // If a member exists in data/members.json, their password in that file is
          // authoritative. An old or outdated password from Airtable is NEVER accepted.
          if (!authenticatedMember && !memberFoundInRepo) {
            try {
              const safeFormula = `AND({MemberID} = '${idVal}', {Status} = 'Active')`;
              const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.membersTableName)}?filterByFormula=${encodeURIComponent(safeFormula)}`;

              const res = await fetch(url, {
                headers: { Authorization: `Bearer ${AIRTABLE_CONFIG.token}` }
              });

              if (res.ok) {
                const data = await res.json();
                const records = data.records || [];
                if (records.length > 0) {
                  const memberData = records[0].fields;
                  const recordPassword = String(memberData.Password || '');
                  // In-memory verification
                  if (recordPassword === passVal) {
                    authenticatedMember = {
                      MemberID: memberData.MemberID || idVal,
                      Name: memberData.Name || 'Authorized Member',
                      Organization: memberData.Organization || 'Dr. Smith Healthcare',
                      Department: memberData.Department || '',
                      Role: memberData.Role || 'Authorized Member'
                    };
                  }
                }
              }
            } catch (airtableErr) {
              console.warn('Airtable query error:', airtableErr);
            }
          }

          if (!authenticatedMember) {
            let errorMsg = 'Invalid Member ID or Password. Please check credentials.';
            if (window.DrSmithSecurity && window.DrSmithSecurity.rateLimiter) {
              const fail = window.DrSmithSecurity.rateLimiter.recordFailure();
              if (fail.locked) {
                startMemberCooldownTimer();
                if (memberLoginSpinner) memberLoginSpinner.classList.add('d-none');
                return;
              } else {
                errorMsg = `Invalid credentials. Remaining attempts: <strong>${fail.remainingAttempts}</strong>.`;
              }
            }
            showAuthAlert(errorMsg);
            setAuthLoading(false);
            return;
          }

          // Record Success
          if (window.DrSmithSecurity && window.DrSmithSecurity.rateLimiter) {
            window.DrSmithSecurity.rateLimiter.recordSuccess();
          }

          saveActiveMember(authenticatedMember);
          updateMemberBanner();
          setAuthLoading(false);
          goToStep(1); // Advance to Category Selection
        } catch (err) {
          console.warn('Member auth fallback note:', err);
          let errorMsg = 'Invalid Member ID or Password. Please check credentials.';
          if (window.DrSmithSecurity && window.DrSmithSecurity.rateLimiter) {
            const fail = window.DrSmithSecurity.rateLimiter.recordFailure();
            if (fail.locked) {
              startMemberCooldownTimer();
              if (memberLoginSpinner) memberLoginSpinner.classList.add('d-none');
              return;
            }
            errorMsg = `Invalid credentials. Remaining attempts: <strong>${fail.remainingAttempts}</strong>.`;
          }
          showAuthAlert(errorMsg);
          setAuthLoading(false);
        } finally {
          isMemberSubmitting = false;
        }
      }

      memberLoginForm.addEventListener('submit', handleMemberLoginSubmit);
      if (memberLoginBtn) {
        memberLoginBtn.addEventListener('click', handleMemberLoginSubmit);
      }
      [memberIdInput, memberPassInput].forEach(inp => {
        if (inp) {
          inp.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleMemberLoginSubmit(e);
            }
          });
        }
      });
    }

    // Step 1: Category selection
    categoryCards.forEach(card => {
      card.addEventListener('click', function () {
        const catName = this.getAttribute('data-category');
        if (!catName) return;

        selectedCategoryInput.value = catName;
        if (chosenCategoryBadge) {
          chosenCategoryBadge.textContent = catName;
        }

        categoryCards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');

        goToStep(2);
      });
    });

    // Back to Step 1 button
    if (backToStep1Btn) {
      backToStep1Btn.addEventListener('click', function () {
        goToStep(1);
      });
    }

    // Upload another item button on success screen
    if (uploadAnotherBtn) {
      uploadAnotherBtn.addEventListener('click', function () {
        if (form) form.reset();
        if (previewContainer) previewContainer.classList.add('d-none');
        categoryCards.forEach(c => c.classList.remove('selected'));
        goToStep(1);
      });
    }

    // Image preview with strict security validation
    if (imageInput && previewContainer && previewImg) {
      imageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
          // File upload security validation (blocks executables, SVGs, oversized files)
          if (window.DrSmithSecurity && typeof window.DrSmithSecurity.validateUploadFile === 'function') {
            const secResult = window.DrSmithSecurity.validateUploadFile(file);
            if (!secResult.valid) {
              alert(secResult.error || 'Invalid file selected.');
              this.value = '';
              previewContainer.classList.add('d-none');
              return;
            }
          } else if (file.size > 10 * 1024 * 1024) {
            alert('File size must be under 10MB.');
            this.value = '';
            previewContainer.classList.add('d-none');
            return;
          }

          const reader = new FileReader();
          reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewContainer.classList.remove('d-none');
          };
          reader.readAsDataURL(file);
        } else {
          previewContainer.classList.add('d-none');
        }
      });
    }

    // Form submit with multi-tier sanitization and injection prevention
    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Enforce member authentication
        if (!activeMember) {
          goToStep(0);
          showAuthAlert('Please verify your Member ID and Password before submitting.');
          return;
        }

        const category = selectedCategoryInput.value.trim();
        const name = document.getElementById('listingName').value.trim();
        const price = document.getElementById('listingPrice').value.trim();
        const description = document.getElementById('listingDescription').value.trim();
        const contact = document.getElementById('listingContact').value.trim();
        const file = imageInput ? imageInput.files[0] : null;

        if (!category) {
          showStatus('Please select a category first.', 'warning');
          goToStep(1);
          return;
        }

        if (!name || !description || !contact) {
          showStatus('Please fill in all required fields.', 'danger');
          return;
        }

        // ====================================================================
        // INPUT SANITIZATION & INJECTION DETECTION
        // ====================================================================
        // 1. Validates that submission fields do not contain SQLi or script tags.
        // 2. Strips unprintable characters and encodes text to prevent stored XSS.
        if (window.DrSmithSecurity) {
          if (window.DrSmithSecurity.detectInjection(name) || window.DrSmithSecurity.detectInjection(description)) {
            showStatus('Security Alert: Malicious characters or injection syntax detected. Submission rejected.', 'danger');
            return;
          }
        }

        // Validate attached file one more time before upload
        if (file && window.DrSmithSecurity) {
          const fileCheck = window.DrSmithSecurity.validateUploadFile(file);
          if (!fileCheck.valid) {
            showStatus(fileCheck.error, 'danger');
            return;
          }
        }

        const safeCategory = window.DrSmithSecurity ? window.DrSmithSecurity.sanitizeText(category, 60) : category;
        const safeName = window.DrSmithSecurity ? window.DrSmithSecurity.sanitizeText(name, 150) : name;
        const safePrice = window.DrSmithSecurity ? window.DrSmithSecurity.sanitizeText(price, 50) : price;
        const safeDescription = window.DrSmithSecurity ? window.DrSmithSecurity.sanitizeText(description, 2000) : description;
        const safeContact = window.DrSmithSecurity ? window.DrSmithSecurity.sanitizeText(contact, 100) : contact;

        setLoading(true);
        showStatus('', '');

        try {
          let directImageUrl = null;

          if (file) {
            updateLoadingText('Uploading image securely...');
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const uploadRes = await fetch('https://tmpfiles.org/api/v1/upload', {
              method: 'POST',
              body: uploadFormData
            });

            if (uploadRes.ok) {
              const uploadJson = await uploadRes.json();
              if (uploadJson.status === 'success' && uploadJson.data && uploadJson.data.url) {
                const rawUrl = uploadJson.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
                directImageUrl = window.DrSmithSecurity ? window.DrSmithSecurity.sanitizeUrl(rawUrl) : rawUrl;
              }
            }
          }

          updateLoadingText('Submitting request to Dr. Smith queue...');

          // Build Airtable payload with Status: Pending and SubmittedBy
          const orgStr = activeMember.Organization ? ` (${activeMember.Organization})` : '';
          const roleStr = activeMember.Role ? ` [${activeMember.Role}]` : '';
          const submittedByStr = `${activeMember.MemberID} - ${activeMember.Name}${orgStr}${roleStr}`;

          const fields = {
            Name: safeName,
            Category: safeCategory,
            Price: safePrice || 'Contact for Quote',
            Description: safeDescription,
            Contact: safeContact,
            Status: 'Pending',
            SubmittedBy: submittedByStr
          };

          if (directImageUrl) {
            fields.Attachments = [{ url: directImageUrl }];
          }

          const airtableRes = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableName)}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${AIRTABLE_CONFIG.token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ records: [{ fields: fields }] })
            }
          );

          if (!airtableRes.ok) {
            const errDetail = await airtableRes.text();
            throw new Error(`Airtable error: ${errDetail}`);
          }

          // Show success screen
          if (successCategoryBadge) successCategoryBadge.textContent = category;
          if (successSubmitterInfo) {
            successSubmitterInfo.innerHTML = `Submitted by: <strong>${escapeHtml(activeMember.Name)}</strong> (${escapeHtml(activeMember.MemberID)})`;
          }
          setLoading(false);
          goToStep(3); // Success step
        } catch (err) {
          console.error('Submission error:', err);
          showStatus('Submission error: ' + err.message, 'danger');
          setLoading(false);
        }
      });
    }

    function setLoading(isLoading) {
      if (submitBtn) submitBtn.disabled = isLoading;
      if (submitSpinner) submitSpinner.classList.toggle('d-none', !isLoading);
      if (submitText) submitText.textContent = isLoading ? 'Processing...' : 'Send Listing Request';
    }

    function updateLoadingText(text) {
      if (submitText) submitText.textContent = text;
    }

    function showStatus(msg, type) {
      if (!statusMsg) return;
      if (!msg) {
        statusMsg.classList.add('d-none');
        statusMsg.textContent = '';
        return;
      }
      statusMsg.className = `alert alert-${type} mb-3`;
      statusMsg.textContent = msg;
      statusMsg.classList.remove('d-none');
    }
  }

  // Robust loader: runs immediately if DOM is already interactive/complete, or on DOMContentLoaded
  function bootMarketplace() {
    fetchMembersJson();
    fetchApprovedListings();
    initSubmissionWizard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootMarketplace);
  } else {
    bootMarketplace();
  }
})();
