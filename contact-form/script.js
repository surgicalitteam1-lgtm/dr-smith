/**
 * Contact & Enquiry Form Script
 * 
 * Manages client-side validation, disposable email detection,
 * asynchronous submission via FormSubmit.co API, and user feedback messages.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // DOM Element References
    // -------------------------------------------------------------
    const form = document.getElementById('contactForm');
    const contactInput = document.getElementById('contact');
    const contactError = document.getElementById('contactError');
    const submissionStatus = document.getElementById('submissionStatus');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnIcon = submitBtn ? submitBtn.querySelector('.btn-icon') : null;
    const btnSpinner = document.getElementById('btnSpinner');

    // Exit early if the contact form or primary input are not present on the page
    if (!form || !contactInput) return;

    // -------------------------------------------------------------
    // Disposable / Temporary Email Domain Filter
    // -------------------------------------------------------------
    // Block throwaway email services to prevent spam enquiries
    const disposableEmailDomains = new Set([
        '10minutemail.com',
        '10minutemail.net',
        'anonbox.net',
        'burnermail.io',
        'disposablemail.com',
        'dispostable.com',
        'emailondeck.com',
        'fakeinbox.com',
        'getnada.com',
        'grr.la',
        'guerrillamail.com',
        'guerrillamail.net',
        'maildrop.cc',
        'mailinator.com',
        'mailnesia.com',
        'mintemail.com',
        'mohmal.com',
        'sharklasers.com',
        'temp-mail.io',
        'temp-mail.org',
        'tempail.com',
        'tempmail.com',
        'tempmail.net',
        'throwawaymail.com',
        'trashmail.com',
        'trashmail.net',
        'yopmail.com'
    ]);

    /**
     * Checks if the entered email address belongs to a disposable domain.
     * @param {string} emailValue - The input string from the email field.
     * @returns {boolean} - True if disposable/temporary, false otherwise.
     */
    function isDisposableEmail(emailValue) {
        const domain = emailValue.trim().toLowerCase().split('@').pop();
        return Array.from(disposableEmailDomains).some((blockedDomain) =>
            domain === blockedDomain || domain.endsWith(`.${blockedDomain}`)
        );
    }

    /**
     * Sets button state to loading (with spinner) or normal.
     * @param {boolean} isLoading - True when submitting, false when done.
     */
    function setLoadingState(isLoading) {
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;
        if (btnText) btnText.textContent = isLoading ? 'SENDING...' : 'SEND ENQUIRY';
        if (btnIcon) btnIcon.style.display = isLoading ? 'none' : 'inline-block';
        if (btnSpinner) btnSpinner.style.display = isLoading ? 'inline-block' : 'none';
    }

    /**
     * Displays a status alert message above or below the form.
     * @param {string} messageHtml - HTML content or text of the alert.
     * @param {'success'|'error'} alertClass - Type of alert ('success' or 'error').
     */
    function showStatusMessage(messageHtml, alertClass) {
        if (!submissionStatus) return;
        submissionStatus.innerHTML = messageHtml;
        submissionStatus.className = `status-alert ${alertClass}`;
        submissionStatus.style.display = 'block';
    }

    /**
     * Shows error outline and warning message on the contact field.
     */
    function showContactError() {
        if (contactError) contactError.style.display = 'block';
        contactInput.style.borderColor = 'var(--error-color)';
    }

    /**
     * Clears error outline and warning message on the contact field.
     */
    function clearContactError() {
        if (contactError) contactError.style.display = 'none';
        contactInput.style.borderColor = 'var(--border-color)';
    }

    // -------------------------------------------------------------
    // Anti-Spam Rate Limiting & Cooldown Tracker
    // -------------------------------------------------------------
    let lastSubmissionTimestamp = 0;

    // -------------------------------------------------------------
    // Form Submission Handler
    // -------------------------------------------------------------
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Reset previous alert messages and error indicators
        if (submissionStatus) {
            submissionStatus.style.display = 'none';
            submissionStatus.className = 'status-alert';
        }
        clearContactError();

        // 2. Client-side Honeypot Bot Trap:
        // Silently discard automated bot submissions if hidden field is filled
        const honeypotInput = form.querySelector('input[name="_honey"]');
        if (honeypotInput && honeypotInput.value.trim().length > 0) {
            showStatusMessage(
                'Thank you! Your enquiry has been sent successfully to info@drsmith.co.in. Our team will contact you shortly.',
                'success'
            );
            form.reset();
            return;
        }

        // 3. Client-side Rate Limiting: Prevent rapid spamming / button flooding
        const currentTimestamp = Date.now();
        if (currentTimestamp - lastSubmissionTimestamp < 8000) {
            showStatusMessage(
                'Please wait a few seconds before submitting another enquiry.',
                'error'
            );
            return;
        }

        // 4. Validate email / contact input
        const contactVal = contactInput.value.trim();
        const isEmailInvalid = !contactVal || !contactInput.validity.valid || isDisposableEmail(contactVal);

        if (isEmailInvalid) {
            showContactError();
            return;
        }

        // 5. Validate standard HTML5 required attributes
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // 4. Update UI to loading state
        setLoadingState(true);

        // 5. Send form data via AJAX POST to FormSubmit.co
        const formData = new FormData(form);

        try {
            const response = await fetch('https://formsubmit.co/ajax/info@drsmith.co.in', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            const isSuccess = response.ok && (data.success === true || data.success === 'true');

            if (isSuccess) {
                // Success: record timestamp to enforce rate-limiting cooldown
                lastSubmissionTimestamp = Date.now();

                // Notify the user and reset form inputs
                showStatusMessage(
                    'Thank you! Your enquiry has been sent successfully to info@drsmith.co.in. Our team will contact you shortly.',
                    'success'
                );
                form.reset();
            } else if (data.message && data.message.toLowerCase().includes('activate')) {
                // Notification for initial email account confirmation on FormSubmit
                showStatusMessage(
                    '<strong>Action Required:</strong> An activation email was sent to <strong>info@drsmith.co.in</strong>. Please open that email and click "Activate Form" to start receiving submissions automatically.',
                    'success'
                );
            } else {
                throw new Error(data.message || 'Submission failed');
            }
        } catch (err) {
            // Error: show fallback contact instructions
            showStatusMessage(
                'Unable to send message right now. Please email us directly at <a href="mailto:info@drsmith.co.in">info@drsmith.co.in</a> or call 1800 891 7466.',
                'error'
            );
        } finally {
            // Restore submit button to normal state
            setLoadingState(false);
        }
    });

    // -------------------------------------------------------------
    // Live Real-Time Input Validation
    // -------------------------------------------------------------
    // Instantly remove red error styling as soon as the user starts typing
    contactInput.addEventListener('input', () => {
        if (contactInput.value.trim().length > 0) {
            if (contactError) contactError.style.display = 'none';
            contactInput.style.borderColor = 'var(--primary-blue)';
        }
    });
});
