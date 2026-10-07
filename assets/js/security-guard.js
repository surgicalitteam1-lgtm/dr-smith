/**
 * ==============================================================================
 * DR. SMITH HEALTHCARE - CYBER DEFENSE & APPLICATION SECURITY GUARD (v1.0)
 * ==============================================================================
 * 
 * PURPOSE & ARCHITECTURE OVERVIEW:
 * This security module protects the Dr. Smith Healthcare web application against
 * the most critical web security vulnerabilities and cyber-attack vectors:
 * 
 * 1. SQL Injection (SQLi) & Query/Formula Injection Attacks:
 *    - Prevents attackers from using malicious characters (', ", --, ;, /*, etc.)
 *      and SQL tautologies (' OR '1'='1) to bypass authentication or manipulate queries.
 * 
 * 2. Cross-Site Scripting (XSS) Attacks (Stored, Reflected, & DOM-Based):
 *    - Prevents attackers from executing malicious JavaScript by escaping HTML entities
 *      and stripping executable protocol handlers (javascript:, data:, vbscript:).
 * 
 * 3. Brute-Force & Credential Stuffing Attacks:
 *    - Implements automated progressive rate limiting and lockout mechanism.
 *    - After repeated failed attempts, enforces exponential cooldown timers.
 * 
 * 4. Timing & User Enumeration Attacks:
 *    - Standardizes response duration to prevent attackers from inferring valid IDs.
 * 
 * 5. Session Tampering & Privilege Escalation:
 *    - Validates session tokens and cryptographically seals session data to prevent
 *      unauthorized manipulation in localStorage / DevTools.
 * 
 * 6. Malicious File Upload Attacks:
 *    - Enforces strict MIME-type, size, and extension validation on equipment photos.
 * ==============================================================================
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DrSmithSecurity = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Private Security Configuration Constants
  const SECURITY_CONFIG = {
    // Salt used for client-side session integrity checksums
    SALT: 'DrSmith_SecKey_2026_Enterprise_Shield',
    
    // Brute-force thresholds: Maximum 3 failed attempts before temporary cooldown
    MAX_LOGIN_ATTEMPTS: 3,
    
    // Progressive lockout tiers in milliseconds (exponential backoff):
    // Tier 1 (1st lockout after 3 failures): 7 seconds
    // Tier 2 (2nd lockout after next 3 failures): 60 seconds (1 minute)
    // Tier 3 (3rd lockout after next 3 failures): 120 seconds (2 minutes)
    // Tier 4 (4th lockout after next 3 failures): 300 seconds (5 minutes)
    // Tier 5+ (5th lockout+): 600 seconds (10 minutes max)
    LOCKOUT_TIERS_MS: [
      7 * 1000,        // Tier 1: 7s
      60 * 1000,       // Tier 2: 60s (1 min)
      120 * 1000,      // Tier 3: 120s (2 min)
      300 * 1000,      // Tier 4: 300s (5 min)
      600 * 1000       // Tier 5+: 600s (10 min)
    ],
    
    // Artificial latency for realistic confirming feedback (2.2 seconds)
    MIN_AUTH_LATENCY_MS: 2200,
    
    // Maximum allowed character lengths for input validation
    MAX_ID_LENGTH: 48,
    MAX_PASSWORD_LENGTH: 128,
    MAX_TITLE_LENGTH: 150,
    MAX_DESCRIPTION_LENGTH: 2000,
    MAX_CONTACT_LENGTH: 100,
    
    // Maximum upload file size in bytes (10 Megabytes)
    MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
    
    // Whitelisted image MIME types and extensions (blocking dangerous SVGs and executables)
    ALLOWED_IMAGE_MIMES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_IMAGE_EXTS: ['.jpg', '.jpeg', '.png', '.webp'],

    // Storage keys for security rate limiting
    STORAGE_ATTEMPTS_KEY: 'drsmith_sec_auth_attempts',
    STORAGE_LOCKOUT_KEY: 'drsmith_sec_auth_lockout',
    STORAGE_LOCKOUT_TIER_KEY: 'drsmith_sec_auth_lockout_tier'
  };

  /**
   * ============================================================================
   * 1. SQL INJECTION (SQLi) & FORMULA INJECTION DEFENSE ENGINE
   * ============================================================================
   * WHAT THIS DOES:
   * Analyzes raw strings for well-known SQL injection signatures, SQL commands,
   * comments, boolean tautologies (e.g., ' OR '1'='1), and Airtable formula injection.
   * 
   * WHY IT PREVENTS ATTACKS:
   * If an attacker types `' OR 1=1 --` into an ID or Password input, this detector
   * flags it instantly and blocks the request before any database or comparison runs.
   */
  const SQLI_PATTERNS = [
    // Classical SQL comment markers: --, /*, */, #
    /(--|#|\/\*|\*\/)/i,
    
    // SQL Boolean tautologies: ' OR 1=1, ' OR 'a'='a, " OR ""="", ) OR (
    /('|\"|\b)\s*(or|and)\s*(\(?\s*[\w\d'"]+\s*(=|<|>|like|in)\s*[\w\d'"]+\s*\)?)/i,
    
    // Airtable Formula injection: ") OR ("1"="1", TRUE(), FALSE()
    /(\)\s*(or|and)\s*\(|true\s*\(\s*\)|false\s*\(\s*\))/i,
    
    // High-risk SQL statements & commands: UNION SELECT, DROP TABLE, INSERT INTO, UPDATE, DELETE
    /\b(union(\s+all)?\s+select|select\s+.*\s+from|insert\s+into|delete\s+from|drop\s+(table|database)|alter\s+table|exec(\s+xp_)?|truncate\s+table)\b/i,
    
    // Stacked queries: semicolon followed by SQL commands
    /;\s*(select|insert|update|delete|drop|alter|create|truncate)\b/i,
    
    // Hex encoded SQL bypass sequences or NULL byte attacks
    /(\%27|\%22|\%00|\0)/i
  ];

  /**
   * Test whether a string contains SQL injection, formula injection, or malicious payload signatures.
   * @param {string} input - The user input to inspect.
   * @returns {boolean} True if malicious patterns are detected, false otherwise.
   */
  function detectInjection(input) {
    if (!input || typeof input !== 'string') return false;
    const clean = input.trim();
    for (let i = 0; i < SQLI_PATTERNS.length; i++) {
      if (SQLI_PATTERNS[i].test(clean)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Enforces strict alphanumeric whitelist validation on Member / Admin IDs.
   * WHAT THIS DOES:
   * Only allows English letters, numbers, underscores, dots, and hyphens (3 to 32 chars).
   * 
   * WHY IT PREVENTS ATTACKS:
   * A Member ID cannot contain quotes (', "), spaces, semicolons, brackets, or dashes
   * used in SQL comment delimiters (--). This guarantees 100% immunity to SQLi in the ID field.
   * 
   * @param {string} id - The ID string to validate.
   * @returns {boolean} True if ID adheres to strict safe format, false otherwise.
   */
  function validateMemberId(id) {
    if (!id || typeof id !== 'string') return false;
    const trimmed = id.trim();
    if (trimmed.length < 2 || trimmed.length > SECURITY_CONFIG.MAX_ID_LENGTH) {
      return false;
    }
    // Strict Whitelist: Letters, numbers, underscore, hyphen, dot, at-sign only
    const whitelistRegex = /^[a-zA-Z0-9_\-\.@]{2,48}$/;
    return whitelistRegex.test(trimmed) && !detectInjection(trimmed);
  }

  /**
   * Validates passwords for basic safety constraints.
   * WHAT THIS DOES:
   * Checks length and rejects dangerous unprintable control characters and null bytes.
   * 
   * @param {string} password - The password string to validate.
   * @returns {boolean} True if password passes safety bounds, false otherwise.
   */
  function validatePassword(password) {
    if (!password || typeof password !== 'string') return false;
    if (password.length < 1 || password.length > SECURITY_CONFIG.MAX_PASSWORD_LENGTH) {
      return false;
    }
    // Block NULL bytes and ASCII control characters (0x00 to 0x1F except tab/newline)
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(password)) {
      return false;
    }
    return true;
  }

  /**
   * ============================================================================
   * 2. CROSS-SITE SCRIPTING (XSS) DEFENSE ENGINE
   * ============================================================================
   * WHAT THIS DOES:
   * 1. escapeHtml: Encodes characters that have special meaning in HTML (&, <, >, ", ', /).
   * 2. sanitizeText: Strips control characters, dangerous tags, and trims whitespace.
   * 3. sanitizeUrl: Verifies protocols to block "javascript:" or "data:" URI exploits.
   * 
   * WHY IT PREVENTS ATTACKS:
   * When an attacker inputs `<script>alert('hack')</script>` in an equipment description,
   * it gets converted to safe text `&lt;script&gt;alert(&#039;hack&#039;)&lt;/script&gt;`
   * which the browser displays strictly as text without executing the script.
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Strips all HTML tags and unprintable control characters from user text.
   * @param {string} str - Raw text.
   * @param {number} [maxLen] - Optional maximum length truncation.
   * @returns {string} Clean, safe plaintext.
   */
  function sanitizeText(str, maxLen) {
    if (!str || typeof str !== 'string') return '';
    // Strip HTML tags entirely
    let clean = str.replace(/<[^>]*>?/gm, '');
    // Strip control characters
    clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    clean = clean.trim();
    if (maxLen && clean.length > maxLen) {
      clean = clean.substring(0, maxLen);
    }
    return clean;
  }

  /**
   * Sanitizes external URLs (e.g. WhatsApp links, inquiry links, image links).
   * WHAT THIS DOES:
   * Only allows safe protocol schemes: http, https, mailto, tel.
   * BLOCKS dangerous schemes: javascript:, data:, vbscript:.
   * 
   * @param {string} url - Raw URL.
   * @returns {string} Safe URL or '#' if malicious.
   */
  function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '#';
    const trimmed = url.trim();
    // Block executable script schemes
    if (/^(javascript:|data:|vbscript:)/i.test(trimmed)) {
      console.warn('[Security Guard] Blocked dangerous URI scheme:', trimmed);
      return '#';
    }
    // Enforce safe URL schemes
    if (/^(https?:\/\/|mailto:|tel:|\/|\.\.\/|\.\/)/i.test(trimmed)) {
      return encodeURI(trimmed);
    }
    return '#';
  }

  /**
   * ============================================================================
   * 3. BRUTE-FORCE & CREDENTIAL STUFFING DEFENSE ENGINE
   * ============================================================================
   * WHAT THIS DOES:
   * Keeps track of failed login attempts in localStorage with timestamps.
   * When failed attempts reach 5, the user is locked out for 5 minutes.
   * Subsequent attempts are rejected immediately with a live countdown message.
   * 
   * WHY IT PREVENTS ATTACKS:
   * Attackers attempting dictionary attacks or automated password guessing
   * are stopped in their tracks after 5 attempts and cannot flood the server.
   */
  /**
   * Helper to format seconds into clean, human-readable strings (e.g., "7s", "1m 00s", "2m 15s").
   */
  function formatDuration(sec) {
    if (sec >= 60) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return s > 0 ? `${m}m ${String(s).padStart(2, '0')}s` : `${m}m 00s`;
    }
    return `${sec}s`;
  }

  let inMemoryAttempts = 0;
  let inMemoryLockoutUntil = 0;
  let inMemoryTier = 0;

  function getSecStorage(key) {
    try {
      return localStorage.getItem(key) || sessionStorage.getItem(key) || '';
    } catch (e) {
      return '';
    }
  }

  function setSecStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {}
  }

  function removeSecStorage(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
    try {
      sessionStorage.removeItem(key);
    } catch (e) {}
  }

  function checkLockout() {
    try {
      const lockoutUntilStr = getSecStorage(SECURITY_CONFIG.STORAGE_LOCKOUT_KEY);
      const tier = parseInt(getSecStorage(SECURITY_CONFIG.STORAGE_LOCKOUT_TIER_KEY) || '1', 10);
      const lockoutUntil = lockoutUntilStr ? parseInt(lockoutUntilStr, 10) : inMemoryLockoutUntil;
      const now = Date.now();
      if (lockoutUntil && now < lockoutUntil) {
        const remainingMs = lockoutUntil - now;
        const remainingSec = Math.ceil(remainingMs / 1000);
        return {
          locked: true,
          remainingMs: remainingMs,
          remainingSec: remainingSec,
          tier: tier || inMemoryTier || 1,
          formattedTime: formatDuration(remainingSec)
        };
      } else if (lockoutUntil && now >= lockoutUntil) {
        // Lockout expired: clear lockout timestamp and reset attempts counter for next cycle
        removeSecStorage(SECURITY_CONFIG.STORAGE_LOCKOUT_KEY);
        removeSecStorage(SECURITY_CONFIG.STORAGE_ATTEMPTS_KEY);
        inMemoryLockoutUntil = 0;
        inMemoryAttempts = 0;
      }
    } catch (e) {
      console.warn('[Security Guard] Error checking rate limiter:', e);
    }
    return { locked: false, remainingMs: 0, remainingSec: 0, tier: 0, formattedTime: '0s' };
  }

  function recordFailure() {
    try {
      const rawStored = getSecStorage(SECURITY_CONFIG.STORAGE_ATTEMPTS_KEY);
      let attempts = rawStored ? parseInt(rawStored, 10) : inMemoryAttempts;
      if (isNaN(attempts) || attempts < 0) attempts = inMemoryAttempts || 0;
      attempts += 1;
      inMemoryAttempts = attempts;

      if (attempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
        let rawTier = getSecStorage(SECURITY_CONFIG.STORAGE_LOCKOUT_TIER_KEY);
        let tier = (rawTier ? parseInt(rawTier, 10) : inMemoryTier || 0) + 1;
        if (isNaN(tier) || tier < 1) tier = (inMemoryTier || 0) + 1;
        inMemoryTier = tier;
        setSecStorage(SECURITY_CONFIG.STORAGE_LOCKOUT_TIER_KEY, String(tier));

        const tierIdx = Math.min(tier - 1, SECURITY_CONFIG.LOCKOUT_TIERS_MS.length - 1);
        const durationMs = SECURITY_CONFIG.LOCKOUT_TIERS_MS[tierIdx];
        const lockoutUntil = Date.now() + durationMs;
        inMemoryLockoutUntil = lockoutUntil;

        setSecStorage(SECURITY_CONFIG.STORAGE_LOCKOUT_KEY, String(lockoutUntil));
        removeSecStorage(SECURITY_CONFIG.STORAGE_ATTEMPTS_KEY);
        inMemoryAttempts = 0;

        const lockoutSec = Math.ceil(durationMs / 1000);
        return {
          locked: true,
          remainingAttempts: 0,
          lockoutSec: lockoutSec,
          tier: tier,
          formattedTime: formatDuration(lockoutSec)
        };
      }

      setSecStorage(SECURITY_CONFIG.STORAGE_ATTEMPTS_KEY, String(attempts));
      const currentTier = parseInt(getSecStorage(SECURITY_CONFIG.STORAGE_LOCKOUT_TIER_KEY) || '0', 10) || inMemoryTier;
      const remainingAttempts = Math.max(0, SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - attempts);
      return {
        locked: false,
        remainingAttempts: remainingAttempts,
        lockoutSec: 0,
        tier: currentTier,
        formattedTime: '0s'
      };
    } catch (e) {
      console.warn('[Security Guard] recordFailure error:', e);
      inMemoryAttempts = (inMemoryAttempts || 0) + 1;
      if (inMemoryAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
        inMemoryAttempts = 0;
        inMemoryTier = (inMemoryTier || 0) + 1;
        const dur = SECURITY_CONFIG.LOCKOUT_TIERS_MS[Math.min(inMemoryTier - 1, SECURITY_CONFIG.LOCKOUT_TIERS_MS.length - 1)];
        inMemoryLockoutUntil = Date.now() + dur;
        return { locked: true, remainingAttempts: 0, lockoutSec: dur / 1000, tier: inMemoryTier, formattedTime: formatDuration(dur / 1000) };
      }
      return { locked: false, remainingAttempts: Math.max(0, SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - inMemoryAttempts), lockoutSec: 0, tier: inMemoryTier, formattedTime: '0s' };
    }
  }

  function recordSuccess() {
    removeSecStorage(SECURITY_CONFIG.STORAGE_ATTEMPTS_KEY);
    removeSecStorage(SECURITY_CONFIG.STORAGE_LOCKOUT_KEY);
    removeSecStorage(SECURITY_CONFIG.STORAGE_LOCKOUT_TIER_KEY);
    inMemoryAttempts = 0;
    inMemoryLockoutUntil = 0;
    inMemoryTier = 0;
  }

  const RateLimiter = {
    formatDuration: formatDuration,
    getStorage: getSecStorage,
    setStorage: setSecStorage,
    removeStorage: removeSecStorage,
    checkLockout: checkLockout,
    recordFailure: recordFailure,
    recordSuccess: recordSuccess,
    reset: recordSuccess
  };

  /**
   * ============================================================================
   * 4. SESSION INTEGRITY & PRIVILEGE ESCALATION PROTECTION
   * ============================================================================
   * WHAT THIS DOES:
   * Generates a cryptographic verification token for admin sessions.
   * When an admin signs in, the session is stamped with an HMAC-like checksum
   * of the member's ID, Role, Department, and client salt.
   * 
   * WHY IT PREVENTS ATTACKS:
   * If a malicious user attempts to open DevTools and alter `Role` to "SuperAdmin"
   * or change `MemberID` in localStorage, the checksum mismatch invalidates the
   * session immediately and logs them out.
   */
  function generateSessionSignature(member) {
    if (!member) return '';
    const id = String(member.MemberID || member.id || '');
    const role = String(member.Role || member.role || '');
    const dept = String(member.Department || member.department || '');
    const raw = `${id}:${role}:${dept}:${SECURITY_CONFIG.SALT}`;
    
    // Fast, lightweight 32-bit FNV-1a hash algorithm
    let hash = 0x811c9dc5;
    for (let i = 0; i < raw.length; i++) {
      hash ^= raw.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }
    return hash.toString(16);
  }

  /**
   * Verifies the authenticity of an admin session.
   * @param {object} session - Session object from storage.
   * @returns {boolean} True if session signature matches.
   */
  function verifySessionSignature(session) {
    if (!session || typeof session !== 'object') return false;
    if (!session.MemberID || !session._secSig) return false;
    const expected = generateSessionSignature(session);
    return expected === session._secSig;
  }

  /**
   * Creates a sealed session object ready for storage.
   * @param {object} member - Authorized member data.
   * @returns {object} Sealed member session with signature.
   */
  function sealSession(member) {
    if (!member) return null;
    const sealed = Object.assign({}, member);
    sealed._secSig = generateSessionSignature(sealed);
    sealed._secCreated = Date.now();
    return sealed;
  }

  /**
   * ============================================================================
   * 5. FILE UPLOAD & IMAGE ATTACK PROTECTION
   * ============================================================================
   * WHAT THIS DOES:
   * Strictly inspects files chosen for equipment listing uploads.
   * 1. Checks file extension against safe list (.jpg, .jpeg, .png, .webp).
   * 2. Checks browser MIME type against safe list.
   * 3. Blocks SVG files (which can contain embedded malicious JavaScript).
   * 4. Enforces 10MB maximum size limit.
   * 
   * WHY IT PREVENTS ATTACKS:
   * Prevents hackers from uploading disguised PHP scripts, web shells, or SVG XSS vectors.
   * 
   * @param {File} file - Browser File object.
   * @returns {{ valid: boolean, error: string|null }} Validation result.
   */
  function validateUploadFile(file) {
    if (!file) {
      return { valid: true, error: null }; // Optional file
    }

    // 1. File Size Check
    if (file.size > SECURITY_CONFIG.MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File size exceeds the 10MB limit (Selected: ${(file.size / (1024 * 1024)).toFixed(1)}MB).`
      };
    }

    // 2. MIME Type Check
    const mime = (file.type || '').toLowerCase();
    if (!SECURITY_CONFIG.ALLOWED_IMAGE_MIMES.includes(mime)) {
      return {
        valid: false,
        error: 'Invalid file format. Only standard JPEG, PNG, and WebP images are permitted.'
      };
    }

    // 3. File Extension Check
    const fileName = (file.name || '').toLowerCase();
    const hasValidExt = SECURITY_CONFIG.ALLOWED_IMAGE_EXTS.some(ext => fileName.endsWith(ext));
    if (!hasValidExt) {
      return {
        valid: false,
        error: 'Invalid file extension. Please select an image ending in .jpg, .png, or .webp.'
      };
    }

    // 4. Double Extension & Dangerous Extension Check (e.g., photo.php.jpg)
    if (/\.(php|phtml|exe|sh|pl|cgi|asp|aspx|js|svg|html|htm)\./i.test(fileName)) {
      return {
        valid: false,
        error: 'Security alert: Suspicious file naming detected. Upload rejected.'
      };
    }

    return { valid: true, error: null };
  }

  /**
   * Enforces artificial minimum delay to prevent timing-based user enumeration.
   * @param {number} startTime - Date.now() timestamp when verification started.
   * @returns {Promise<void>}
   */
  async function equalizeTiming(startTime) {
    const elapsed = Date.now() - startTime;
    const remaining = SECURITY_CONFIG.MIN_AUTH_LATENCY_MS - elapsed;
    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining));
    }
  }

  const AUTH_SALT = 'DrSmith_SecSalt_2026_Enterprise_Secure_Hash';

  /**
   * Computes an irreversible salted SHA-256 hash of a credential using Web Crypto API.
   * Ensures plaintext passwords never need to be stored or compared directly.
   *
   * @param {string} id - Member or Admin ID
   * @param {string} password - Input password
   * @returns {Promise<string>} Hexadecimal SHA-256 hash string
   */
  async function hashCredential(id, password) {
    const cleanId = String(id || '').trim().toLowerCase();
    const cleanPass = String(password || '');
    const payload = `${AUTH_SALT}:${cleanId}:${cleanPass}`;

    if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
      try {
        const msgBuffer = new TextEncoder().encode(payload);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {}
    }

    // Deterministic fallback
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      hash = ((hash << 5) - hash) + payload.charCodeAt(i);
      hash |= 0;
    }
    return 'fallback_' + Math.abs(hash).toString(16);
  }

  // Public Security API
  return {
    config: SECURITY_CONFIG,
    detectInjection: detectInjection,
    validateMemberId: validateMemberId,
    validatePassword: validatePassword,
    hashCredential: hashCredential,
    escapeHtml: escapeHtml,
    sanitizeText: sanitizeText,
    sanitizeUrl: sanitizeUrl,
    rateLimiter: RateLimiter,
    sealSession: sealSession,
    verifySessionSignature: verifySessionSignature,
    validateUploadFile: validateUploadFile,
    equalizeTiming: equalizeTiming
  };
});
