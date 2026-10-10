/**
 * Main JavaScript File for Dr. Smith Medical Website
 * 
 * This file powers all interactive features across the site:
 * 1.  Header Scroll Styling (adds 'scrolled' class on scroll)
 * 2.  Mobile Navigation Menu Toggle (hamburger open/close)
 * 3.  Mobile Navigation Auto-Close (closes menu when an in-page link is clicked)
 * 4.  Mobile Dropdown Sub-menus (expand/collapse on mobile viewports)
 * 5.  Preloader Removal (hides loading animation once page loads)
 * 6.  Scroll-to-Top Button (floating button to smoothly return to top)
 * 7.  Swiper Carousel Initialization (parses JSON config and initializes sliders)
 * 8.  PureCounter Number Animations (animates stat counters)
 * 9.  FAQ Accordion Items (expand/collapse questions and answers)
 * 10. Hash-link Scroll Position Adjustment (accounts for header offset)
 * 11. Navmenu Scrollspy (highlights the active section link on scroll)
 * 12. Infinite Marquee Client Slider (smooth continuous logo carousel with drag & touch)
 * 13. Mobile & Tablet Header Scroll Behavior (auto-hides header on scroll down)
 * 14. Global Product Image Click -> Instagram Showcase Redirection
 */

(function() {
  "use strict";

  /**
   * 1. Header Scroll Styling
   * Adds the 'scrolled' class to the <body> when the user scrolls down more than 100px.
   * Only triggers if the header has sticky or fixed positioning classes.
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    
    // Safety check: ensure header element exists on the page
    if (!selectHeader) return;

    // Check if header is configured to stick or fix to the top
    const isSticky = selectHeader.classList.contains('scroll-up-sticky') ||
                     selectHeader.classList.contains('sticky-top') ||
                     selectHeader.classList.contains('fixed-top');
    if (!isSticky) return;

    // Toggle 'scrolled' class based on vertical scroll distance
    if (window.scrollY > 100) {
      selectBody.classList.add('scrolled');
    } else {
      selectBody.classList.remove('scrolled');
    }
  }

  // Listen for scroll and initial page load to apply scroll styling
  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);


  /**
   * 2. Mobile Navigation Toggle
   * Toggles the mobile menu on and off when clicking the hamburger button.
   * Switches the hamburger icon between list (bi-list) and close (bi-x).
   */
  const mobileNavToggleBtns = document.querySelectorAll('.mobile-nav-toggle');

  function toggleMobileNav() {
    const isOpening = !document.body.classList.contains('mobile-nav-active');
    document.body.classList.toggle('mobile-nav-active');
    mobileNavToggleBtns.forEach(btn => {
      if (isOpening) {
        btn.classList.remove('bi-list');
        btn.classList.add('bi-x');
      } else {
        btn.classList.remove('bi-x');
        btn.classList.add('bi-list');
      }
    });
  }

  mobileNavToggleBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMobileNav();
    });
  });

  // Close mobile nav when tapping outside the menu container
  document.addEventListener('click', function(e) {
    if (document.body.classList.contains('mobile-nav-active')) {
      const navmenu = document.querySelector('#navmenu');
      const isClickInsideMenu = navmenu && navmenu.contains(e.target);
      const isClickOnToggle = Array.from(mobileNavToggleBtns).some(btn => btn.contains(e.target));
      if (!isClickInsideMenu && !isClickOnToggle) {
        toggleMobileNav();
      }
    }
  });

  /**
   * 3. Mobile Navigation Auto-Close on Anchor Click
   * When an in-page link (e.g. #about) inside the mobile menu is clicked,
   * automatically close the mobile menu so the user can see the target section.
   */
  document.querySelectorAll('#navmenu a').forEach(navmenuLink => {
    navmenuLink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        toggleMobileNav();
      }
    });
  });


  /**
   * 4. Mobile Navigation Dropdown Sub-menus
   * Expands or collapses nested dropdown menus when clicking the toggle arrow on mobile.
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(dropdownToggle => {
    dropdownToggle.addEventListener('click', function(e) {
      e.preventDefault();
      // Toggle 'active' on parent and 'dropdown-active' on adjacent sub-menu list
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });


  /**
   * 5. Preloader Removal
   * Fades out and removes the preloader overlay element when the page finishes loading.
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }


  /**
   * 6. Scroll-to-Top Button
   * Shows a floating button when scrolled down more than 100px.
   * Smoothly scrolls back to the very top of the page when clicked.
   */
  /**
   * 6. Scroll-to-Top Button
   * Shows a floating button when scrolled down more than 100px.
   * Smoothly scrolls back to the very top of the page when clicked.
   */
  function toggleScrollTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
      if (window.scrollY > 120) {
        scrollTopBtn.classList.add('active');
      } else {
        scrollTopBtn.classList.remove('active');
      }
    }
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.scroll-top');
    if (btn) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop, { passive: true });

  /**
   * 6b. Mobile & Tablet Sticky Bottom Action Bar
   * Reveals sticky Send Enquiry & WhatsApp action bar only after the original hero
   * buttons are scrolled out of view by more than 50%.
   */
  const stickyBottomBar = document.querySelector('.mobile-sticky-actions');
  const heroOriginalActions = document.querySelector('.hero-contact-whatsapp-row') || document.querySelector('.hero-actions');

  function toggleStickyActions() {
    if (!stickyBottomBar) return;

    if (heroOriginalActions) {
      const rect = heroOriginalActions.getBoundingClientRect();
      // More than 50% of original buttons hidden past the top of viewport:
      const isMoreThanHalfHidden = rect.bottom < (rect.height * 0.5);
      if (isMoreThanHalfHidden) {
        stickyBottomBar.classList.add('active');
      } else {
        stickyBottomBar.classList.remove('active');
      }
    } else {
      // Fallback for subpages without hero action row
      if (window.scrollY > 250) {
        stickyBottomBar.classList.add('active');
      } else {
        stickyBottomBar.classList.remove('active');
      }
    }
  }

  window.addEventListener('load', toggleStickyActions);
  document.addEventListener('scroll', toggleStickyActions, { passive: true });
  window.addEventListener('resize', toggleStickyActions, { passive: true });


  /**
   * 7. Swiper Carousel Sliders Initialization
   * Initializes Swiper sliders (e.g., Company Background, Milestones & Testimonials carousel).
   * Slider settings are stored directly in this JS file to keep HTML clean and script-free.
   */
  function initSwiper() {
    // Exit if Swiper library is not available on the current page
    if (typeof Swiper === 'undefined') return;

    const swiperElements = document.querySelectorAll('.init-swiper');
    if (!swiperElements.length) return;

    // Default configuration for testimonial and milestone carousel slider
    const defaultSwiperConfig = {
      loop: true,
      speed: 600,
      autoplay: {
        delay: 4000
      },
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      breakpoints: {
        768: {
          slidesPerView: 2
        },
        1200: {
          slidesPerView: 3
        }
      }
    };

    swiperElements.forEach((swiperElement) => {
      let config = defaultSwiperConfig;

      // Backward compatibility: If an inline .swiper-config element exists, read its custom options
      const configElement = swiperElement.querySelector('.swiper-config');
      if (configElement) {
        try {
          config = JSON.parse(configElement.innerHTML.trim());
        } catch (err) {
          console.warn('Could not parse custom Swiper config, falling back to default:', err);
        }
      }

      new Swiper(swiperElement, config);
    });
  }

  window.addEventListener('load', initSwiper);


  /**
   * 8. PureCounter Animated Numbers
   * Animates numbers counting up when visible on screen (e.g. stats counters).
   */
  if (document.querySelector('.purecounter') && typeof PureCounter !== 'undefined') {
    new PureCounter();
  }


  /**
   * 9. FAQ Accordion Items
   * Toggles the open/closed state of FAQ accordion questions when clicked.
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqHeader) => {
    faqHeader.addEventListener('click', () => {
      faqHeader.parentNode.classList.toggle('faq-active');
    });
  });


  /**
   * 10. Correct Scrolling Position for Hash Links
   * When navigating to a URL with a hash anchor (e.g. index.html#about),
   * smoothly scrolls to the section while compensating for the header height.
   */
  window.addEventListener('load', function() {
    if (window.location.hash) {
      const targetSection = document.querySelector(window.location.hash);
      if (targetSection) {
        setTimeout(() => {
          const scrollMarginTop = getComputedStyle(targetSection).scrollMarginTop;
          const offset = parseInt(scrollMarginTop, 10) || 0;
          window.scrollTo({
            top: targetSection.offsetTop - offset,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });


  /**
   * 11. Navmenu Scrollspy
   * Dynamically highlights the active navigation menu item as the user scrolls past sections.
   */
  const navmenuLinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenuLinks.forEach((link) => {
      if (!link.hash) return;
      const targetSection = document.querySelector(link.hash);
      if (!targetSection) return;

      const scrollPosition = window.scrollY + 200;
      const sectionTop = targetSection.offsetTop;
      const sectionBottom = sectionTop + targetSection.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
        document.querySelectorAll('.navmenu a.active').forEach(activeLink => activeLink.classList.remove('active'));
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);


  /**
   * 12. Infinite Marquee Slider for Client Logos
   * Provides a continuous, seamlessly looping logo carousel with:
   * - Cloned slides to create an uninterrupted infinite loop
   * - Responsive slide sizing and spacing based on screen breakpoints
   * - Interactive mouse dragging and mobile touch swipe
   * - Mouse wheel horizontal scrolling
   * - 60fps smooth animation loop using requestAnimationFrame
   */
  function initClientsSlider() {
    const container = document.querySelector('#clients .clients-swiper');
    const wrapper = container ? container.querySelector('.swiper-wrapper') : null;

    // Abort if container doesn't exist or is already initialized
    if (!container || !wrapper || container.dataset.ready) return;
    container.dataset.ready = '1';

    // Set wrapper styles for smooth marquee animation
    wrapper.style.cssText = 'display:flex;align-items:center;transition:none!important;will-change:transform;';

    // Duplicate original slides to enable seamless infinite wrapping
    const originalSlides = Array.from(wrapper.children);
    const originalSlideCount = originalSlides.length;
    originalSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(clone);
    });

    const allSlides = Array.from(wrapper.children);

    // Prevent default browser dragging on client logos
    container.querySelectorAll('img').forEach((img) => {
      img.draggable = false;
      img.style.cssText = '-webkit-user-drag:none;user-select:none;';
    });

    // Carousel state variables
    let totalSetWidth = 0;       // Total width in pixels of one full set of slides
    let lastContainerWidth = 0;   // Track container width to detect screen resizing
    let scrollOffset = 0;         // Current horizontal scroll position in pixels
    let isDragging = false;       // True when user is actively dragging with mouse or finger
    let isInteracting = false;    // True during wheel or drag interaction
    let dragStartX = 0;           // Mouse/touch X coordinate at start of gesture
    let dragStartY = 0;           // Mouse/touch Y coordinate at start of gesture
    let lastTimestamp = null;     // Timestamp of previous animation frame
    let wheelTimer = null;        // Timer to clear interaction flag after wheel scroll ends
    const scrollSpeed = 0.06;     // Auto-scroll speed (pixels per millisecond)

    // Wraps the offset value within [0, totalSetWidth) for seamless looping
    function normalizeOffset(value) {
      if (totalSetWidth <= 0) return 0;
      return ((value % totalSetWidth) + totalSetWidth) % totalSetWidth;
    }

    // Applies the calculated offset to the wrapper element using CSS 3D transform
    function renderPosition() {
      wrapper.style.transform = `translate3d(${-scrollOffset}px, 0, 0)`;
    }

    // Recalculates slide dimensions and gaps based on the current window size
    function updateLayout() {
      const containerWidth = container.clientWidth;
      if (!containerWidth) return;
      lastContainerWidth = containerWidth;

      const viewportWidth = window.innerWidth;
      let slidesPerView = 2;
      let gap = 40;

      // Responsive breakpoints for slide count and gap spacing
      if (viewportWidth >= 992) {
        slidesPerView = 6;
        gap = 120;
      } else if (viewportWidth >= 640) {
        slidesPerView = 4;
        gap = 60;
      } else if (viewportWidth >= 480) {
        slidesPerView = 3;
        gap = 45;
      } else {
        slidesPerView = 2.5;
        gap = 30;
      }

      // Calculate width for each slide
      const totalGapWidth = gap * (slidesPerView - 1);
      const slideWidth = Math.max(40, (containerWidth - totalGapWidth) / slidesPerView);

      // Apply size styles to all slides (originals + duplicates)
      allSlides.forEach((slide) => {
        slide.style.width = `${slideWidth}px`;
        slide.style.marginRight = `${gap}px`;
        slide.style.flexShrink = '0';
      });

      // Total width of one complete set of original slides
      totalSetWidth = originalSlideCount * (slideWidth + gap);
      scrollOffset = normalizeOffset(scrollOffset);
      renderPosition();
    }

    // --- Mouse Drag Events ---
    container.addEventListener('dragstart', (e) => e.preventDefault());

    container.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only trigger for primary left click
      e.preventDefault();
      isDragging = true;
      isInteracting = true;
      dragStartX = e.clientX;
      lastTimestamp = null;
      clearTimeout(wheelTimer);
      container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      dragStartX = e.clientX;
      scrollOffset = normalizeOffset(scrollOffset - deltaX);
      renderPosition();
    });

    function stopDragging() {
      if (!isDragging) return;
      isDragging = false;
      isInteracting = false;
      lastTimestamp = null;
      container.style.cursor = 'grab';
    }

    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('blur', stopDragging);

    // --- Touch Swipe Events ---
    container.addEventListener('touchstart', (e) => {
      if (!e.touches.length) return;
      isDragging = true;
      isInteracting = true;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
      lastTimestamp = null;
      clearTimeout(wheelTimer);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches.length) return;
      const deltaX = e.touches[0].clientX - dragStartX;
      const deltaY = e.touches[0].clientY - dragStartY;

      // Prevent page scroll only if horizontal drag exceeds vertical motion
      if (Math.abs(deltaX) > Math.abs(deltaY) && e.cancelable) {
        e.preventDefault();
      }

      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
      scrollOffset = normalizeOffset(scrollOffset - deltaX);
      renderPosition();
    }, { passive: false });

    window.addEventListener('touchend', stopDragging, { passive: true });
    window.addEventListener('touchcancel', stopDragging, { passive: true });

    // --- Mouse Wheel Scroll ---
    container.addEventListener('wheel', (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!delta) return;
      e.preventDefault();
      isInteracting = true;
      lastTimestamp = null;
      scrollOffset = normalizeOffset(scrollOffset + delta);
      renderPosition();

      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        if (!isDragging) {
          isInteracting = false;
          lastTimestamp = null;
        }
      }, 200);
    }, { passive: false });

    // --- Continuous 60fps Marquee Animation Loop ---
    function animationLoop(timestamp) {
      // Re-layout if container width changed (e.g. window resize)
      if (container.clientWidth > 0 && container.clientWidth !== lastContainerWidth) {
        updateLayout();
      }

      // Auto-advance slides when user is not manually interacting
      if (!isInteracting && !isDragging) {
        if (lastTimestamp === null) lastTimestamp = timestamp;
        const timeElapsed = Math.min(timestamp - lastTimestamp, 64);
        lastTimestamp = timestamp;

        if (timeElapsed > 0 && totalSetWidth > 0) {
          scrollOffset = normalizeOffset(scrollOffset + timeElapsed * scrollSpeed);
          renderPosition();
        }
      } else {
        lastTimestamp = null;
      }

      requestAnimationFrame(animationLoop);
    }

    // Set initial layout and kick off animation
    updateLayout();
    window.addEventListener('load', updateLayout);
    window.addEventListener('resize', updateLayout);
    requestAnimationFrame(animationLoop);
  }

  // Initialize sliders when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initClientsSlider();
      initEquipmentCarousel();
    });
  } else {
    initClientsSlider();
    initEquipmentCarousel();
  }


  /**
   * 13. Featured Equipment Interactive Auto-Scrolling Carousel (Right-to-Left)
   * Continuously scrolls equipment cards seamlessly from right to left.
   * Supports:
   * - Interactive touch drag / swipe on mobile
   * - Mouse drag with inertia on desktop
   * - Trackpad / mouse wheel horizontal scrolling
   * - Hover pause for reading cards without unwanted clicks on drag
   * - Seamless 60fps infinite looping with requestAnimationFrame
  /**
   * 13. Featured Equipment / Categories Smooth Auto-Scrolling Carousel
   * High-precision 60fps infinite marquee with momentum physics, smooth hover pause,
   * touch drag/swipe, and gliding navigation buttons.
   */
  function initEquipmentCarousel() {
    const containers = document.querySelectorAll('#equipment-carousel, #categories-carousel, .featured-carousel-wrapper');

    containers.forEach((container) => {
      const track = container.querySelector('.equipment-track, .categories-track');
      if (!track || container.dataset.ready) return;
      container.dataset.ready = '1';

      const originalCards = Array.from(track.children);
      const originalCount = originalCards.length;
      if (originalCount === 0) return;

      // Append 2 clone sets for a triple-buffer infinite loop (Original + Clone 1 + Clone 2)
      for (let set = 0; set < 2; set++) {
        originalCards.forEach((card) => {
          const clone = card.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        });
      }

      // Prevent default native image drag
      container.querySelectorAll('img').forEach((img) => {
        img.draggable = false;
        img.style.cssText = '-webkit-user-drag:none;user-select:none;';
      });

      // Engine Physics State
      let singleSetWidth = 0;
      let cardStep = 300;
      let currentOffset = 0;
      let baseSpeed = 0.038; // Smooth gentle auto-scroll cruise speed (pixels per ms)
      let isDragging = false;
      let isHovered = false;
      let hasMoved = false;
      let dragStartX = 0;
      let dragStartOffset = 0;
      let dragVelocity = 0;
      let lastDragX = 0;
      let lastDragTime = 0;
      let impulse = 0; // Smooth impulse for Next/Prev buttons
      let lastTimestamp = null;

      function updateWidths() {
        if (track.children.length > originalCount && track.children[originalCount]) {
          const firstCardLeft = track.children[0].offsetLeft;
          const cloneCardLeft = track.children[originalCount].offsetLeft;
          const measured = cloneCardLeft - firstCardLeft;
          if (measured > 100) {
            singleSetWidth = measured;
          }
        }

        // Card step calculation for next/prev buttons
        if (track.children.length > 0) {
          const first = track.children[0];
          const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
          cardStep = first.offsetWidth + gap;
        }

        // Fallback calculation if offsetLeft is 0 during early render
        if (singleSetWidth <= 0) {
          let total = 0;
          for (let i = 0; i < originalCount; i++) {
            const item = track.children[i];
            if (!item) continue;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
            total += item.offsetWidth + gap;
          }
          singleSetWidth = total > 0 ? total : 2400;
        }
      }

      function render() {
        track.style.transform = `translate3d(${-currentOffset.toFixed(2)}px, 0, 0)`;
      }

      function wrapOffset(val) {
        if (singleSetWidth <= 0) return val;
        while (val >= singleSetWidth) val -= singleSetWidth;
        while (val < 0) val += singleSetWidth;
        return val;
      }

      // Hover Listeners (smoothly pause auto-scroll when user hovers cards to read/click)
      container.addEventListener('mouseenter', () => { isHovered = true; });
      container.addEventListener('mouseleave', () => { isHovered = false; });

      // Pointer Interaction (Mouse & Touch)
      function onPointerDown(e) {
        isDragging = true;
        hasMoved = false;
        impulse = 0;
        dragVelocity = 0;
        dragStartX = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX) || 0;
        dragStartOffset = currentOffset;
        lastDragX = dragStartX;
        lastDragTime = performance.now();
        track.style.cursor = 'grabbing';
      }

      function onPointerMove(e) {
        if (!isDragging) return;
        const currentX = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX) || 0;
        const deltaX = currentX - dragStartX;

        if (Math.abs(deltaX) > 6) {
          hasMoved = true;
        }

        const now = performance.now();
        const dt = now - lastDragTime;
        if (dt > 0) {
          dragVelocity = -(currentX - lastDragX) / dt;
          lastDragX = currentX;
          lastDragTime = now;
        }

        currentOffset = wrapOffset(dragStartOffset - deltaX);
        render();
      }

      function onPointerUp() {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';
      }

      // Prevent navigation clicks if user dragged the cards
      container.addEventListener('click', function(e) {
        if (hasMoved) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);

      // Mouse Listeners
      track.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);

      // Touch Listeners
      track.addEventListener('touchstart', onPointerDown, { passive: true });
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', onPointerUp, { passive: true });
      window.addEventListener('touchcancel', onPointerUp, { passive: true });

      // Trackpad / Wheel Horizontal Scroll
      container.addEventListener('wheel', (e) => {
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        impulse += delta * 0.8;
      }, { passive: true });

      // Gliding Navigation Buttons
      const prevBtn = container.querySelector('.carousel-nav-prev, #equipment-prev-btn');
      const nextBtn = container.querySelector('.carousel-nav-next, #equipment-next-btn');

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          impulse -= cardStep;
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          impulse += cardStep;
        });
      }

      // Main 60fps Render Loop
      function animationLoop(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const dt = Math.min(timestamp - lastTimestamp, 40); // Cap frame delta to prevent jumps
        lastTimestamp = timestamp;

        if (!isDragging) {
          // Apply impulse (glide for next/prev/wheel)
          if (Math.abs(impulse) > 0.5) {
            currentOffset += impulse * 0.12;
            impulse *= 0.86;
          } else {
            impulse = 0;
          }

          // Apply drag inertia release
          if (Math.abs(dragVelocity) > 0.01) {
            currentOffset += dragVelocity * dt;
            dragVelocity *= 0.92;
          } else {
            dragVelocity = 0;
          }

          // Continuous gentle auto-scroll (pauses on hover)
          const cruiseSpeed = isHovered ? 0 : baseSpeed;
          currentOffset += cruiseSpeed * dt;
          currentOffset = wrapOffset(currentOffset);
          render();
        }

        requestAnimationFrame(animationLoop);
      }

      updateWidths();
      window.addEventListener('load', () => {
        updateWidths();
        setTimeout(updateWidths, 300);
      });
      window.addEventListener('resize', updateWidths);
      requestAnimationFrame(animationLoop);
    });
  }


  /**
   * 13. Mobile & Tablet Header Scroll Behavior
   * On mobile and tablet screens (<= 1199px wide):
   * - Hides the header once scrolled down past 25px to maximize usable screen space.
   * - Restores header visibility when scrolled back to the top (< 25px).
   * - Keeps header visible on desktop screens (> 1199px).
   */
  function checkMobileHeader() {
    if (window.innerWidth <= 1199) {
      if (window.scrollY > 25) {
        document.body.classList.add('scrolled', 'header-hidden');
      } else {
        document.body.classList.remove('header-hidden');
        if (window.scrollY <= 100) {
          document.body.classList.remove('scrolled');
        }
      }
    } else {
      document.body.classList.remove('header-hidden');
    }
  }

  // Register listeners to ensure mobile header responds to scroll, page load, and resize
  window.addEventListener('scroll', checkMobileHeader, { passive: true });
  window.addEventListener('load', checkMobileHeader);
  window.addEventListener('resize', checkMobileHeader);


  /**
   * 14. Global Product Image Click -> Instagram Showcase Redirection
   * When a user clicks on any product card image or image link:
   * Opens Dr. Smith's official Instagram product showcase in a new tab.
   */
  document.addEventListener('click', function(e) {
    const cardImage = e.target.closest('.catalogue-card__image, .catalogue-card__image-link');
    if (cardImage) {
      const instagramUrl = "https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==";
      const anchorTag = e.target.closest('a');

      // If the clicked element is not an anchor tag, open the Instagram URL directly
      if (!anchorTag) {
        e.preventDefault();
        window.open(instagramUrl, '_blank', 'noopener,noreferrer');
      }
    }
  });

  /**
   * 15. Real-Time Search Filters for Products and Subcategories
   * Automatically connects live search inputs if present on the page:
   * - #categoryProductSearch: filters individual product cards (.catalogue-grid-item)
   * - #subcat-search-input: filters subcategory cards (.subcat-col)
   */
  function initSearchFilters() {
    // 15a. Category product live search (for individual subcategory pages)
    const productSearchInput = document.getElementById('categoryProductSearch');
    if (productSearchInput && !productSearchInput.dataset.searchBound) {
      productSearchInput.dataset.searchBound = '1';
      productSearchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const items = document.querySelectorAll('.catalogue-grid-item');
        let visibleCount = 0;

        items.forEach((item) => {
          const title = (item.getAttribute('data-title') || '').toLowerCase();
          const badge = (item.getAttribute('data-badge') || '').toLowerCase();
          const isMatch = !query || title.includes(query) || badge.includes(query);

          item.style.display = isMatch ? '' : 'none';
          if (isMatch) visibleCount++;
        });

        const countDisplay = document.querySelector('.catalogue-count strong');
        if (countDisplay) {
          countDisplay.textContent = visibleCount;
        }
      });
    }

    // 15b. Subcategory live search (for main hub pages)
    const subcatSearchInput = document.getElementById('subcat-search-input');
    if (subcatSearchInput && !subcatSearchInput.dataset.searchBound) {
      subcatSearchInput.dataset.searchBound = '1';
      subcatSearchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const items = document.querySelectorAll('.subcat-col');
        let visibleCount = 0;

        items.forEach((item) => {
          const title = (item.getAttribute('data-title') || '').toLowerCase();
          const text = item.textContent.toLowerCase();
          const isMatch = !query || title.includes(query) || text.includes(query);

          item.style.display = isMatch ? '' : 'none';
          if (isMatch) visibleCount++;
        });

        const countDisplay = document.getElementById('subcat-count');
        if (countDisplay) {
          countDisplay.textContent = visibleCount;
        }
      });
    }
  }

  // Register live search filter once DOM content has loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchFilters);
  } else {
    initSearchFilters();
  }

  /**
   * 16. Mobile Footer Accordion Toggle (Apple-Style)
   * On mobile/tablet screens (<= 991px), enables tapping directory headers to expand/collapse link lists.
   */
  function initFooterAccordion() {
    if (window._footerAccordionBound) return;
    window._footerAccordionBound = true;

    document.addEventListener('click', function(e) {
      if (window.innerWidth > 991) return;
      const trigger = e.target.closest('.apple-footer-col-trigger, .apple-footer-col > h4');
      if (!trigger) return;

      e.preventDefault();
      const col = trigger.closest('.apple-footer-col');
      if (!col) return;

      const isActive = col.classList.contains('active');
      col.classList.toggle('active', !isActive);

      const triggerBtn = col.querySelector('.apple-footer-col-trigger');
      if (triggerBtn) {
        triggerBtn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterAccordion);
  } else {
    initFooterAccordion();
  }

  /**
   * 17. Mobile Header Mail Button Visibility
   * On mobile viewports (<= 991px), only displays the header mail button after the
   * user has scrolled the hero's "Mail Us" button up and out of view.
   */
  function initMobileHeaderMailVisibility() {
    const mailNavBtn = document.querySelector('.apple-nav-circle-mail');
    if (!mailNavBtn) return;

    let ticking = false;

    function updateMailVisibility() {
      if (window.innerWidth > 991) {
        mailNavBtn.classList.remove('visible-mobile');
        return;
      }

      const heroMailBtn = document.querySelector('.btn-hero-mail');
      if (heroMailBtn) {
        const rect = heroMailBtn.getBoundingClientRect();
        // 74px accounts for the fixed header height
        const isPastHero = rect.bottom <= 74;
        if (isPastHero) {
          mailNavBtn.classList.add('visible-mobile');
        } else {
          mailNavBtn.classList.remove('visible-mobile');
        }
      } else {
        // Fallback for pages without hero mail button: show after scrolling 250px
        if (window.scrollY > 250) {
          mailNavBtn.classList.add('visible-mobile');
        } else {
          mailNavBtn.classList.remove('visible-mobile');
        }
      }
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateMailVisibility();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateMailVisibility, { passive: true });
    updateMailVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileHeaderMailVisibility);
  } else {
    initMobileHeaderMailVisibility();
  }

})();