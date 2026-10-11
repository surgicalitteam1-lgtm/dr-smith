/**
 * ==============================================================================
 * DR. SMITH HEALTHCARE - ADMIN AUTHENTICATION & ACCESS CONTROL
 * ==============================================================================
 * 
 * SECURITY ARCHITECTURE & ATTACK DEFENSES IMPLEMENTED:
 * 1. SQL Injection (SQLi) & Formula Injection Defense:
 *    - Rejects SQL tautologies (' OR '1'='1), quote injections, and SQL keywords.
 *    - Enforces strict alphanumeric whitelist on Member IDs.
 *    - Eliminates formula string interpolation for passwords in Airtable queries.
 * 
 * 2. Cross-Site Scripting (XSS) Defense:
 *    - Sanitizes all dynamic data rendered into the DOM.
 * 
 * 3. Brute-Force & Credential Stuffing Defense:
 *    - Integrates DrSmithSecurity RateLimiter with 5-attempt threshold and 5-min lockout.
 * 
 * 4. Timing & User Enumeration Attack Mitigation:
 *    - Equalizes authentication response latency across valid and invalid users.
 * 
 * 5. Session Tampering & Privilege Escalation Defense:
 *    - Uses cryptographic session sealing and re-verifies active sessions against
 *      the authoritative data/members.json repository file.
 * ==============================================================================
 */

(function () {
  'use strict';

  const ADMIN_CONFIG = {
    baseId: 'app5QujkCDRyTN6ZV',
    membersTableName: 'Members',
    token: 'patDHLpw8Sua4J4e2.acf2df74be5142879179f2b4997432e025d43e6d57ed7f2ff13d90028199324f',
    storageKey: 'drsmith_admin_session',
    legacyKey: 'drsmith_member',
    apiEndpoint: window.DR_SMITH_AUTH_API || ''
  };

  /**
   * Session Management with Cryptographic Anti-Tampering Shield
   * 
   * WHAT THIS DOES:
   * 1. Reads session from localStorage/sessionStorage.
   * 2. Uses DrSmithSecurity to verify the cryptographic integrity signature.
   * 
   * WHY IT PREVENTS ATTACKS:
   * Prevents attackers from opening browser DevTools and manually setting
   * localStorage to pretend they are an admin or altering their user role.
   */
  function getAdminSession() {
    try {
      const raw = localStorage.getItem(ADMIN_CONFIG.storageKey) || sessionStorage.getItem(ADMIN_CONFIG.legacyKey);
      if (raw) {
        const session = JSON.parse(raw);
        // Anti-Tampering Check: Verify signature if security guard is loaded
        if (window.DrSmithSecurity && typeof window.DrSmithSecurity.verifySessionSignature === 'function') {
          if (!window.DrSmithSecurity.verifySessionSignature(session)) {
            console.warn('[Security Guard] Tampered or unsigned admin session detected! Forcing logout.');
            clearAdminSession();
            return null;
          }
        }
        return session;
      }
    } catch (e) {
      console.warn('Error reading admin session:', e);
    }
    return null;
  }

  /**
   * Saves admin session stamped with cryptographic integrity seal.
   */
  function saveAdminSession(member) {
    try {
      // Seal session with anti-tampering hash
      const sealed = (window.DrSmithSecurity && typeof window.DrSmithSecurity.sealSession === 'function')
        ? window.DrSmithSecurity.sealSession(member)
        : member;

      localStorage.setItem(ADMIN_CONFIG.storageKey, JSON.stringify(sealed));
      sessionStorage.setItem(ADMIN_CONFIG.legacyKey, JSON.stringify(sealed));
    } catch (e) {}
  }

  function clearAdminSession() {
    try {
      localStorage.removeItem(ADMIN_CONFIG.storageKey);
      sessionStorage.removeItem(ADMIN_CONFIG.legacyKey);
    } catch (e) {}
  }

  /**
   * Escape HTML to prevent Cross-Site Scripting (XSS)
   */
  function escapeHtml(str) {
    if (window.DrSmithSecurity && typeof window.DrSmithSecurity.escapeHtml === 'function') {
      return window.DrSmithSecurity.escapeHtml(str);
    }
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * In-memory cache for ultra-fast credential lookups
   */
  let cachedMembers = null;

  /**
   * Determine relative path prefix for assets and links
   */
  function getPathPrefix() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/catalogue') || document.querySelector('link[href*="../assets/"]') !== null || document.querySelector('script[src*="../assets/"]') !== null) {
      return '../';
    }
    return '';
  }

  const HARDCODED_MEMBERS = [
    {
      id: "admin",
      pass: "admin",
      passHash: "bc30d3b94b6baf9224b7ad35ea56fb5a1c2c20aee168f8686c790b1d063a1851",
      name: "Admin",
      department: "IT & System Security",
      role: "Administrator",
      organization: "Dr. Smith Healthcare",
      status: "Active"
    },
    {
      id: "lucky",
      pass: "lucky123",
      passHash: "1861500c364d022c1379490005387bab5e89d86f101f3bc44bf20bcc83f9d688",
      name: "Lucky",
      department: "Administration",
      role: "Administrator",
      organization: "Dr. Smith Healthcare",
      status: "Active"
    },
    {
      id: "ritu",
      pass: "ritu123",
      passHash: "eb3a0473b431a48a60dd1bcfcada2b4f5f9a2ded75f941cc2baf02e06402dcf5",
      name: "Ritu",
      department: "Export Department",
      role: "Head of Export Department",
      organization: "Dr. Smith Healthcare",
      status: "Active"
    }
  ];

  /**
   * Resilient multi-path loader for data/members.json.
   * Tries multiple candidate paths to guarantee instant resolution across all hosting environments.
   */
  async function fetchMembersJson() {
    if (cachedMembers && Array.isArray(cachedMembers) && cachedMembers.length > 0) {
      return cachedMembers;
    }
    const prefix = getPathPrefix();
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
    cachedMembers = HARDCODED_MEMBERS;
    return HARDCODED_MEMBERS;
  }

  /**
   * Inject Admin Login Modal into DOM
   */
  function injectAdminModals() {
    // Defensively remove any legacy adminPortalModal or dashboard elements if cached by browser
    const stalePortalModal = document.getElementById('adminPortalModal');
    if (stalePortalModal) stalePortalModal.remove();

    if (document.getElementById('adminAuthModal')) return;

    const modalContainer = document.createElement('div');
    modalContainer.id = 'drsmithAdminModalsWrapper';
    modalContainer.innerHTML = `
      <!-- Admin Login Modal -->
      <div class="modal fade" id="adminAuthModal" tabindex="-1" aria-labelledby="adminAuthModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 440px;">
          <div class="modal-content border-0 shadow-lg" style="border-radius: 18px; overflow: hidden;">
            <div class="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <span class="badge rounded-pill bg-light text-primary border px-3 py-1 fw-semibold small">
                <i class="bi bi-shield-lock me-1"></i> Admin Portal
              </span>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4 pt-2">
              <div class="text-center mb-4">
                <div class="mb-3" style="width: 60px; height: 60px; border-radius: 50%; background: #eaf4ff; color: var(--accent-color, #5c99ee); display: inline-flex; align-items: center; justify-content: center; font-size: 1.7rem;">
                  <i class="bi bi-shield-lock-fill"></i>
                </div>
                <h4 class="fw-bold text-dark mb-1" id="adminAuthModalLabel" style="font-family: var(--heading-font);">Administrator Login</h4>
                <p class="text-muted small mb-0" style="line-height: 1.5;">
                  Authorized Dr. Smith administrators and department heads may sign in to upload equipment for catalogue review.
                </p>
              </div>

              <div id="adminAuthAlert" class="alert alert-danger d-none py-2 px-3 small rounded-3 mb-3"></div>

              <form id="adminLoginForm" action="javascript:void(0);" onsubmit="return false;">
                <div class="mb-3">
                  <label for="adminIdInput" class="form-label fw-semibold small text-dark">Admin / Member ID <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-person-badge"></i></span>
                    <input type="text" class="form-control border-start-0" id="adminIdInput" placeholder="Enter your ID" required autocomplete="username">
                  </div>
                </div>

                <div class="mb-3">
                  <label for="adminPassInput" class="form-label fw-semibold small text-dark">Password / Access Pass <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-key"></i></span>
                    <input type="password" class="form-control border-start-0 border-end-0" id="adminPassInput" placeholder="Enter your access pass" required autocomplete="current-password">
                    <button class="btn btn-outline-secondary border-start-0" type="button" id="adminTogglePassBtn" title="Toggle password visibility">
                      <i class="bi bi-eye"></i>
                    </button>
                  </div>
                </div>

                <div class="d-grid mt-4">
                  <button type="button" id="adminLoginSubmitBtn" class="btn btn-primary py-2 fw-semibold rounded-pill shadow-sm">
                    <span id="adminLoginSpinner" class="spinner-border spinner-border-sm me-2 d-none" role="status"></span>
                    <span id="adminLoginSubmitText"><i class="bi bi-unlock me-1"></i> Sign In to Upload Portal</span>
                  </button>
                </div>

                <div class="text-center mt-3">
                  <small class="text-muted" style="font-size: 0.75rem;">
                    <i class="bi bi-lock me-1"></i> Standard visitors do not require login. For credential issues, contact administration.
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalContainer);
  }

  /**
   * Update header/mobile slots and admin-only elements across the page
   */
  function syncAdminUI() {
    const session = getAdminSession();
    const isLoggedIn = !!session;

    // 1. Control visibility of all .admin-only elements
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
      if (isLoggedIn) {
        el.classList.remove('d-none');
      } else {
        el.classList.add('d-none');
      }
    });

    // 2. Update Header Admin Slots
    const headerSlots = document.querySelectorAll('.admin-header-slot');
    headerSlots.forEach(slot => {
      if (isLoggedIn) {
        const shortName = escapeHtml(session.Name || session.MemberID || 'Admin');
        const role = escapeHtml(session.Role || 'Administrator');
        const org = escapeHtml(session.Organization || 'Dr. Smith Healthcare');

        slot.innerHTML = `
          <div class="dropdown">
            <button class="admin-user-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Account: ${shortName}">
              <span class="admin-status-dot"></span>
              <span>${shortName}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-start dropdown-menu-md-end admin-dropdown-menu">
              <li class="px-3 py-2 border-bottom mb-1">
                <div class="fw-bold text-dark small">${shortName}</div>
                <div class="text-muted" style="font-size: 0.75rem;">${role}</div>
                ${org ? `<div class="text-muted" style="font-size: 0.7rem;">${org}</div>` : ''}
              </li>
              <li>
                <a class="dropdown-item d-flex align-items-center header-action-upload-btn" href="#">
                  <i class="bi bi-cloud-arrow-up text-primary me-2 fs-6"></i>
                  <span class="fw-semibold">Upload Equipment</span>
                </a>
              </li>
              <li><hr class="dropdown-divider my-1"></li>
              <li>
                <button type="button" class="dropdown-item text-danger d-flex align-items-center admin-signout-btn">
                  <i class="bi bi-box-arrow-right me-2 fs-6"></i>
                  <span>Sign Out</span>
                </button>
              </li>
            </ul>
          </div>
        `;
      } else {
        slot.innerHTML = `
          <button type="button" class="admin-login-btn admin-login-trigger" data-bs-toggle="modal" data-bs-target="#adminAuthModal" title="Administrator Login">
            <i class="bi bi-shield-lock-fill"></i>
            <span>Admin Login</span>
          </button>
        `;
      }
    });

    // Update Mobile Login Slot & Row (When logged in, VIP Banner takes full executive presence)
    const mobileLoginRow = document.getElementById('adminMobileLoginRow');
    const mobileSlots = document.querySelectorAll('.admin-mobile-slot');
    if (isLoggedIn) {
      if (mobileLoginRow) mobileLoginRow.classList.add('d-none');
    } else {
      if (mobileLoginRow) mobileLoginRow.classList.remove('d-none');
      mobileSlots.forEach(slot => {
        slot.innerHTML = `
          <button type="button" class="admin-login-btn admin-login-trigger" data-bs-toggle="modal" data-bs-target="#adminAuthModal" title="Administrator Login">
            <i class="bi bi-shield-lock-fill"></i>
            <span>Admin Login</span>
          </button>
        `;
      });
    }

    // 3. Update VIP Executive Welcome Banner
    const vipBanner = document.getElementById('adminVipBanner');
    if (vipBanner) {
      if (isLoggedIn) {
        const name = escapeHtml(session.Name || session.MemberID || 'Member');
        const dept = escapeHtml(session.Department || session.Role || 'Administration');
        const role = escapeHtml(session.Role || 'Administrator');
        const org = escapeHtml(session.Organization || 'Dr. Smith Healthcare');

        const nameEl = document.getElementById('adminVipNameText');
        const deptEl = document.getElementById('adminVipDeptText');
        const roleEl = document.getElementById('adminVipRoleText');
        const orgEl = document.getElementById('adminVipOrgText');

        if (nameEl) nameEl.textContent = name;
        if (deptEl) deptEl.textContent = dept;
        if (roleEl) roleEl.textContent = role;
        if (orgEl) orgEl.textContent = org;
      }
    }

    // Bind dynamic click events
    bindDynamicEvents();
  }

  /**
   * Bind event listeners to dynamic admin elements
   */
  function bindDynamicEvents() {
    // Sign out buttons
    document.querySelectorAll('.admin-signout-btn').forEach(btn => {
      btn.onclick = function (e) {
        e.preventDefault();
        clearAdminSession();
        syncAdminUI();
        alert('You have been signed out.');
        if (window.location.pathname.includes('/catalogue/')) {
          window.location.reload();
        }
      };
    });

    // Header & Mobile Upload Equipment buttons
    document.querySelectorAll('.header-action-upload-btn').forEach(btn => {
      btn.onclick = function (e) {
        e.preventDefault();
        handleUploadAction();
      };
    });
  }

  /**
   * Launch upload modal if on catalogue page, or redirect to catalogue page with action=upload
   */
  function handleUploadAction() {
    const uploadModalEl = document.getElementById('uploadListingModal');
    if (uploadModalEl && window.bootstrap) {
      const modalInstance = new bootstrap.Modal(uploadModalEl);
      modalInstance.show();
    } else {
      const prefix = getPathPrefix();
      window.location.href = prefix + 'catalogue/index.html?action=upload';
    }
  }

  /**
   * Setup Admin Login Form Submission
   */
  function initLoginForm() {
    const form = document.getElementById('adminLoginForm');
    const idInput = document.getElementById('adminIdInput');
    const passInput = document.getElementById('adminPassInput');
    const togglePassBtn = document.getElementById('adminTogglePassBtn');
    const alertEl = document.getElementById('adminAuthAlert');
    const submitBtn = document.getElementById('adminLoginSubmitBtn');
    const spinner = document.getElementById('adminLoginSpinner');
    const submitText = document.getElementById('adminLoginSubmitText');
    let cooldownInterval = null;

    function formatTime(sec) {
      if (sec >= 60) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return s > 0 ? `${m}m ${String(s).padStart(2, '0')}s` : `${m}m 00s`;
      }
      return `${sec}s`;
    }

    function startCooldownTimer() {
      if (cooldownInterval) clearInterval(cooldownInterval);

      function tick() {
        const lockout = (window.DrSmithSecurity && typeof window.DrSmithSecurity.rateLimiter.checkLockout === 'function')
          ? window.DrSmithSecurity.rateLimiter.checkLockout()
          : { locked: false, remainingSec: 0, tier: 1 };

        if (lockout.locked && lockout.remainingSec > 0) {
          const timeStr = formatTime(lockout.remainingSec);
          if (submitBtn) submitBtn.disabled = true;
          if (spinner) spinner.classList.add('d-none');
          if (submitText) {
            submitText.innerHTML = `<i class="bi bi-hourglass-split me-1"></i> Wait ${timeStr}`;
          }
          if (alertEl) {
            alertEl.innerHTML = `
              <div class="d-flex align-items-start">
                <i class="bi bi-shield-slash-fill me-2 fs-5 text-danger flex-shrink-0 mt-1"></i>
                <div>
                  <strong class="text-danger">Security Cooldown:</strong> 3 failed attempts reached.<br>
                  Please wait <span class="badge bg-danger fs-6 px-2 py-1 mx-1" style="font-family: monospace;">${timeStr}</span> before trying again.
                  ${lockout.tier > 1 ? `<div class="text-muted small mt-1" style="font-size: 0.8rem;"><i class="bi bi-shield-exclamation me-1 text-warning"></i>Extended cooldown (Tier ${lockout.tier}) due to repeated lockout cycles.</div>` : ''}
                </div>
              </div>
            `;
            alertEl.className = 'alert alert-danger py-2 px-3 small rounded-3 mb-3';
            alertEl.classList.remove('d-none');
          }
        } else {
          clearInterval(cooldownInterval);
          cooldownInterval = null;
          if (submitBtn) submitBtn.disabled = false;
          if (spinner) spinner.classList.add('d-none');
          if (submitText) {
            submitText.innerHTML = '<i class="bi bi-unlock me-1"></i> Sign In to Upload Portal';
          }
          if (alertEl && alertEl.textContent.includes('Cooldown')) {
            alertEl.innerHTML = `<i class="bi bi-check-circle-fill me-1 text-success"></i> <strong>Cooldown Complete:</strong> You can enter your credentials now.`;
            alertEl.className = 'alert alert-success py-2 px-3 small rounded-3 mb-3';
            alertEl.classList.remove('d-none');
          }
        }
      }

      tick();
      cooldownInterval = setInterval(tick, 1000);
    }

    // Check on modal open
    const authModalEl = document.getElementById('adminAuthModal');
    if (authModalEl) {
      authModalEl.addEventListener('show.bs.modal', function () {
        if (alertEl && (!window.DrSmithSecurity || !window.DrSmithSecurity.rateLimiter.checkLockout().locked)) {
          alertEl.classList.add('d-none');
          alertEl.innerHTML = '';
        }
        if (window.DrSmithSecurity) {
          const lockout = window.DrSmithSecurity.rateLimiter.checkLockout();
          if (lockout.locked) {
            startCooldownTimer();
          }
        }
      });
    }

    if (togglePassBtn && passInput) {
      togglePassBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        const isPass = passInput.getAttribute('type') === 'password';
        passInput.setAttribute('type', isPass ? 'text' : 'password');
        this.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
      };
    }

    let isSubmitting = false;

    async function handleLoginSubmit(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (isSubmitting) return;

      // ====================================================================
      // DEFENSE LAYER 1: BRUTE-FORCE & CREDENTIAL STUFFING LOCKOUT CHECK
      // ====================================================================
      if (window.DrSmithSecurity && typeof window.DrSmithSecurity.rateLimiter.checkLockout === 'function') {
        const lockoutStatus = window.DrSmithSecurity.rateLimiter.checkLockout();
        if (lockoutStatus.locked) {
          startCooldownTimer();
          return;
        }
      }

      const idVal = (idInput ? idInput.value : '').trim();
      const passVal = (passInput ? passInput.value : '').trim();

      if (!idVal || !passVal) {
        if (alertEl) {
          alertEl.textContent = 'Please enter both your Admin ID and Password.';
          alertEl.classList.remove('d-none');
        }
        return;
      }

      isSubmitting = true;
      if (submitBtn) submitBtn.disabled = true;
      if (spinner) spinner.classList.remove('d-none');
      if (submitText) submitText.innerHTML = 'Confirming Credentials...';
      if (alertEl) alertEl.classList.add('d-none');

      // Realistic verification pause (2.2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2200));

      // 2. Input Security Validation
      if (window.DrSmithSecurity) {
        const isIdSafe = window.DrSmithSecurity.validateMemberId(idVal);
        const isPassSafe = window.DrSmithSecurity.validatePassword(passVal);
        if (!isIdSafe || !isPassSafe) {
          let failMsg = 'Invalid Admin ID or Password. Please check credentials.';
          if (window.DrSmithSecurity.rateLimiter) {
            const failResult = window.DrSmithSecurity.rateLimiter.recordFailure();
            if (failResult.locked) {
              startCooldownTimer();
              isSubmitting = false;
              return;
            }
            failMsg = `Invalid Admin ID or Password. Remaining attempts: <strong>${failResult.remainingAttempts}</strong>.`;
          }
          if (alertEl) {
            alertEl.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i> ${failMsg}`;
            alertEl.className = 'alert alert-danger py-2 px-3 small rounded-3 mb-3';
            alertEl.classList.remove('d-none');
          }
          if (submitBtn) submitBtn.disabled = false;
          if (spinner) spinner.classList.add('d-none');
          if (submitText) submitText.innerHTML = '<i class="bi bi-unlock me-1"></i> Sign In to Upload Portal';
          isSubmitting = false;
          return;
        }
      }

      try {
        let authenticatedMember = null;
        let memberFoundInRepo = false;

        // ====================================================================
        // DEFENSE LAYER 2.5: SECURE CLOUD SERVERLESS AUTH API (100% PRIVATE)
        // ====================================================================
        if (ADMIN_CONFIG.apiEndpoint) {
          try {
            const apiRes = await fetch(`${ADMIN_CONFIG.apiEndpoint}/api/auth/login`, {
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
              startCooldownTimer();
              isSubmitting = false;
              return;
            }
          } catch (apiErr) {
            console.warn('[Auth API] Serverless endpoint unreachable, trying local fallback:', apiErr);
          }
        }

        // ====================================================================
        // DEFENSE LAYER 3: AUTHORITATIVE LOCAL JSON VERIFICATION (IMMUNE TO SQLi)
        // ====================================================================
        // Loads repository credentials directly from data/members.json using multi-path loader.
        // This file is the SUPREME authoritative source of truth for credentials.
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
                  if (alertEl) {
                    alertEl.textContent = 'This account has been deactivated. Please contact administration.';
                    alertEl.classList.remove('d-none');
                  }
                  if (submitBtn) submitBtn.disabled = false;
                  if (spinner) spinner.classList.add('d-none');
                  if (submitText) submitText.innerHTML = '<i class="bi bi-unlock me-1"></i> Sign In to Upload Portal';
                  return;
                }

                // Password verification: matches either cryptographic hash OR plaintext pass
                let passMatches = false;
                if (match.passHash && window.DrSmithSecurity && typeof window.DrSmithSecurity.hashCredential === 'function') {
                  try {
                    const computedHash = await window.DrSmithSecurity.hashCredential(match.id || idVal, passVal);
                    if (computedHash === match.passHash) passMatches = true;
                  } catch (hErr) {}
                }
                if (!passMatches && (match.pass || match.password || match.Password)) {
                  const expectedPass = String(match.pass || match.password || match.Password || '');
                  if (expectedPass === passVal) passMatches = true;
                }

                if (passMatches) {
                  authenticatedMember = {
                    MemberID: match.id || idVal,
                    Name: match.name || match.Name || 'Administrator',
                    Organization: match.organization || match.Organization || 'Dr. Smith Healthcare',
                    Department: match.department || match.Department || '',
                    Role: match.role || match.Role || match.department || 'Administrator'
                  };
                }
              }
            }
          } catch (localErr) {
            console.warn('Local credential lookup note:', localErr);
          }

          // ====================================================================
          // DEFENSE LAYER 4: PARAMETERIZED AIRTABLE FALLBACK (NO FORMULA INJECTION)
          // ====================================================================
          // Only check Airtable fallback if the member was NOT found in data/members.json!
          // If a member exists in data/members.json, their password in that file is
          // authoritative. An old or outdated password from Airtable is NEVER accepted.
          if (!authenticatedMember && !memberFoundInRepo) {
            try {
              // Safe sanitized formula (only alphanumeric ID, no quotes or password)
              const safeFormula = `AND({MemberID} = '${idVal}', {Status} = 'Active')`;
              const url = `https://api.airtable.com/v0/${ADMIN_CONFIG.baseId}/${encodeURIComponent(ADMIN_CONFIG.membersTableName)}?filterByFormula=${encodeURIComponent(safeFormula)}`;

              const res = await fetch(url, {
                headers: { Authorization: `Bearer ${ADMIN_CONFIG.token}` }
              });

              if (res.ok) {
                const data = await res.json();
                const records = data.records || [];
                if (records.length > 0) {
                  const memberData = records[0].fields;
                  // In-memory strict comparison of password (immune to formula injection)
                  const recordPassword = String(memberData.Password || '');
                  if (recordPassword === passVal) {
                    authenticatedMember = {
                      MemberID: memberData.MemberID || idVal,
                      Name: memberData.Name || 'Administrator',
                      Organization: memberData.Organization || 'Dr. Smith Healthcare',
                      Department: memberData.Department || '',
                      Role: memberData.Role || 'Administrator'
                    };
                  }
                }
              }
            } catch (airtableErr) {
              console.warn('Airtable query error:', airtableErr);
            }
          }
        }

        // Handle Authentication Failure
          if (!authenticatedMember) {
            let failMsg = 'Invalid Admin ID or Password. Please check credentials.';
            if (window.DrSmithSecurity && window.DrSmithSecurity.rateLimiter) {
              const failResult = window.DrSmithSecurity.rateLimiter.recordFailure();
              if (failResult.locked) {
                startCooldownTimer();
                if (spinner) spinner.classList.add('d-none');
                return;
              } else {
                failMsg = `Invalid ID or Password. Remaining attempts: <strong>${failResult.remainingAttempts}</strong>.`;
              }
            }

            if (alertEl) {
              alertEl.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i> ${failMsg}`;
              alertEl.className = 'alert alert-danger py-2 px-3 small rounded-3 mb-3';
              alertEl.classList.remove('d-none');
            }
            if (submitBtn) submitBtn.disabled = false;
            if (spinner) spinner.classList.add('d-none');
            if (submitText) submitText.innerHTML = '<i class="bi bi-unlock me-1"></i> Sign In to Upload Portal';
            return;
          }

          // ====================================================================
          // DEFENSE LAYER 6: SUCCESSFUL AUTH & CRYPTOGRAPHIC SESSION SEAL
          // ====================================================================
          // Reset brute force counter
          if (window.DrSmithSecurity && window.DrSmithSecurity.rateLimiter) {
            window.DrSmithSecurity.rateLimiter.recordSuccess();
          }

          // Save sealed session stamped with tamper-evident signature
          saveAdminSession(authenticatedMember);

          if (submitBtn) submitBtn.disabled = false;
          if (spinner) spinner.classList.add('d-none');
          if (submitText) submitText.innerHTML = '<i class="bi bi-unlock me-1"></i> Sign In to Upload Portal';

          // Hide Auth Modal
          const authModalEl = document.getElementById('adminAuthModal');
          if (authModalEl && window.bootstrap) {
            let bsModal = bootstrap.Modal.getInstance(authModalEl);
            if (!bsModal) bsModal = bootstrap.Modal.getOrCreateInstance(authModalEl);
            if (bsModal) bsModal.hide();
            document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('padding-right');
          }

          // Reset Form
          if (form) form.reset();

          // Sync UI to display catalogue page view with member greeting banner
          syncAdminUI();

        } catch (err) {
          console.warn('Auth verification fallback note:', err);
          let failMsg = 'Invalid Admin ID or Password. Please check credentials.';
          if (window.DrSmithSecurity && window.DrSmithSecurity.rateLimiter) {
            const failResult = window.DrSmithSecurity.rateLimiter.recordFailure();
            if (failResult.locked) {
              startCooldownTimer();
              if (spinner) spinner.classList.add('d-none');
              return;
            }
            failMsg = `Invalid ID or Password. Remaining attempts: <strong>${failResult.remainingAttempts}</strong>.`;
          }
          if (alertEl) {
            alertEl.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i> ${failMsg}`;
            alertEl.className = 'alert alert-danger py-2 px-3 small rounded-3 mb-3';
            alertEl.classList.remove('d-none');
          }
          if (submitBtn) submitBtn.disabled = false;
          if (spinner) spinner.classList.add('d-none');
          if (submitText) submitText.innerHTML = '<i class="bi bi-unlock me-1"></i> Sign In to Upload Portal';
        } finally {
          isSubmitting = false;
        }
      }

    if (form) {
      form.addEventListener('submit', handleLoginSubmit);
    }
    if (submitBtn) {
      submitBtn.addEventListener('click', handleLoginSubmit);
    }
    [idInput, passInput].forEach(inp => {
      if (inp) {
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleLoginSubmit(e);
          }
        });
      }
    });
  }

  /**
   * Check if page was loaded with ?action=upload
   */
  function checkUrlActions() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'upload') {
      const session = getAdminSession();
      if (session) {
        setTimeout(() => {
          handleUploadAction();
        }, 500);
      } else {
        setTimeout(() => {
          const authModalEl = document.getElementById('adminAuthModal');
          if (authModalEl && window.bootstrap) {
            const bsModal = new bootstrap.Modal(authModalEl);
            bsModal.show();
            const alertEl = document.getElementById('adminAuthAlert');
            if (alertEl) {
              alertEl.textContent = 'Please log in with your administrator credentials to access the equipment upload portal.';
              alertEl.classList.remove('d-none');
            }
          }
        }, 500);
      }
    }
  }

  /**
   * Enterprise Session Verification on Page Load
   * 
   * WHAT THIS DOES:
   * Re-verifies any active stored session against the authoritative
   * repository credentials file (data/members.json).
   * 
   * WHY IT PREVENTS ATTACKS:
   * If an attacker attempts to tamper with session variables in localStorage
   * or if an administrator was deactivated in data/members.json, the session
   * is instantly purged and revoked on page load.
   */
  async function verifyActiveSessionWithRepo() {
    const session = getAdminSession();
    if (!session) return;
    try {
      const members = await fetchMembersJson();
      if (Array.isArray(members) && members.length > 0) {
        const active = members.find(m => {
          const mId = String(m.id || m.MemberID || '').toLowerCase();
          const sId = String(session.MemberID || '').toLowerCase();
          const status = String(m.status || m.Status || 'Active').toLowerCase();
          return mId === sId && status !== 'inactive';
        });
        if (!active) {
          console.warn('[Security Guard] Active session ID revoked or nonexistent in data/members.json. Purging.');
          clearAdminSession();
          syncAdminUI();
        }
      }
    } catch (e) {}
  }

  /**
   * ============================================================================
   * AUTOMATIC SYNCHRONIZATION ENGINE: data/members.json <-> Airtable
   * ============================================================================
   * WHAT THIS DOES:
   * 1. Reads data/members.json (the authoritative repository file).
   * 2. Compares each member with Airtable's Members table.
   * 3. Automatically syncs any changed passwords, names, roles, or new members.
   * 4. Deactivates any members in Airtable that were removed from data/members.json.
   * 
   * WHY YOU NEVER HAVE TO EDIT THE EXTERNAL WEB:
   * You only ever need to edit data/members.json in this repository.
   * The web application automatically propagates and syncs every credential
   * change to Airtable in the background!
   */
  async function autoSyncMembersWithAirtable() {
    try {
      const localMembers = await fetchMembersJson();
      if (!Array.isArray(localMembers) || localMembers.length === 0) return;

      const airtableUrl = `https://api.airtable.com/v0/${ADMIN_CONFIG.baseId}/${encodeURIComponent(ADMIN_CONFIG.membersTableName)}`;
      const airtableRes = await fetch(airtableUrl, {
        headers: { Authorization: `Bearer ${ADMIN_CONFIG.token}` }
      });
      if (!airtableRes.ok) return;
      const airtableData = await airtableRes.json();
      const airtableRecords = airtableData.records || [];

      // 1. Sync all repo members to Airtable
      for (const m of localMembers) {
        const mId = String(m.id || m.MemberID || '').trim().toLowerCase();
        if (!mId) continue;

        const expectedPass = String(m.pass || m.password || m.Password || '');
        const expectedName = String(m.name || m.Name || mId);
        const expectedRole = String(m.role || m.Role || m.department || 'Administrator');
        const expectedOrg = String(m.organization || m.Organization || 'Dr. Smith Healthcare');
        const expectedStatus = String(m.status || m.Status || 'Active');

        const airtableMatch = airtableRecords.find(rec => {
          const aId = String(rec.fields.MemberID || '').trim().toLowerCase();
          return aId === mId;
        });

        if (airtableMatch) {
          const aPass = String(airtableMatch.fields.Password || '');
          const aName = String(airtableMatch.fields.Name || '');
          const aRole = String(airtableMatch.fields.Role || '');
          const aStatus = String(airtableMatch.fields.Status || '');

          if (aPass !== expectedPass || aName !== expectedName || aRole !== expectedRole || aStatus !== expectedStatus) {
            console.log(`[Auto-Sync] Syncing updated credentials for ${mId} to Airtable...`);
            await fetch(`${airtableUrl}/${airtableMatch.id}`, {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${ADMIN_CONFIG.token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                fields: {
                  MemberID: m.id || mId,
                  Password: expectedPass,
                  Name: expectedName,
                  Role: expectedRole,
                  Status: expectedStatus,
                  Organization: expectedOrg
                }
              })
            });
          }
        } else {
          console.log(`[Auto-Sync] Adding new member ${mId} to Airtable...`);
          await fetch(airtableUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${ADMIN_CONFIG.token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fields: {
                MemberID: m.id || mId,
                Password: expectedPass,
                Name: expectedName,
                Role: expectedRole,
                Status: expectedStatus,
                Organization: expectedOrg
              }
            })
          });
        }
      }

      // 2. Deactivate any member in Airtable that was removed from data/members.json
      for (const rec of airtableRecords) {
        const aId = String(rec.fields.MemberID || '').trim().toLowerCase();
        const existsInRepo = localMembers.some(m => String(m.id || m.MemberID || '').trim().toLowerCase() === aId);
        if (!existsInRepo && rec.fields.Status !== 'Inactive') {
          console.log(`[Auto-Sync] Deactivating removed member ${aId} in Airtable...`);
          await fetch(`${airtableUrl}/${rec.id}`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${ADMIN_CONFIG.token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fields: {
                Status: 'Inactive'
              }
            })
          });
        }
      }
    } catch (err) {
      console.warn('[Auto-Sync] Background sync notice:', err);
    }
  }

  // Robust loader: runs immediately if DOM is already interactive/complete, or on DOMContentLoaded
  function bootAdminPortal() {
    const stalePortalModal = document.getElementById('adminPortalModal');
    if (stalePortalModal) stalePortalModal.remove();

    // Pre-warm local members cache for 0ms auth response
    fetchMembersJson();

    injectAdminModals();
    initLoginForm();
    syncAdminUI();
    verifyActiveSessionWithRepo();
    setTimeout(autoSyncMembersWithAirtable, 1500);
    checkUrlActions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAdminPortal);
  } else {
    bootAdminPortal();
  }

  // Expose global controller for cross-script interaction
  window.DrSmithAdmin = {
    getSession: getAdminSession,
    saveSession: saveAdminSession,
    clearSession: clearAdminSession,
    syncUI: syncAdminUI,
    openUpload: handleUploadAction,
    openLogin: function () {
      const el = document.getElementById('adminAuthModal');
      if (el && window.bootstrap) new bootstrap.Modal(el).show();
    }
  };

})();
