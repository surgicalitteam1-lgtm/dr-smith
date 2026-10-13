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
   * 17. Header Action Buttons Scroll Visibility
   * Header E-mail button is ALWAYS visible across all pages and viewports.
   * Header WhatsApp button on pages with a hero section is hidden at the top
   * and smoothly reveals only after the user scrolls down past the hero action button.
   */
  function initHeaderActionsVisibility() {
    const mailNavBtn = document.querySelector('.apple-nav-circle-mail');
    if (mailNavBtn) {
      mailNavBtn.classList.add('visible-mobile', 'visible-mail');
    }

    const waNavBtn = document.querySelector('.apple-nav-circle-whatsapp');
    if (!waNavBtn) return;

    const heroActionBtn = document.querySelector('.btn-hero-whatsapp');
    if (!heroActionBtn) {
      // Subpages without hero whatsapp button: always visible
      waNavBtn.classList.add('visible-whatsapp', 'visible-mobile');
      return;
    }

    document.body.classList.add('has-hero-whatsapp');
    let ticking = false;

    function updateWhatsAppVisibility() {
      const rect = heroActionBtn.getBoundingClientRect();
      // 74px accounts for the fixed header height
      const isPastHero = rect.bottom <= 74;
      if (isPastHero) {
        waNavBtn.classList.add('visible-whatsapp', 'visible-mobile');
      } else {
        waNavBtn.classList.remove('visible-whatsapp', 'visible-mobile');
      }
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateWhatsAppVisibility();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateWhatsAppVisibility, { passive: true });
    updateWhatsAppVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderActionsVisibility);
  } else {
    initHeaderActionsVisibility();
  }

  /**
   * 18. Global WhatsApp Region Router Modal
   * When any WhatsApp button or trigger across the site is clicked, prompt the user
   * with an interactive region modal before proceeding:
   *  - Option 1 (Indian Supplier Desks): navigates to whatsapp/index.html?region=india (showing 4 domestic desks)
   *  - Option 2 (Overseas Desk - Dubai): opens a new WhatsApp chat tab with single Dubai hotline (+971 50 891 7466)
   *
   * Direct WhatsApp action buttons inside the directory or modal carry .wa-direct-link / data-direct-wa="true"
   * to bypass interception and open WhatsApp directly.
   */
  function initWhatsAppRouterModal() {
    if (window._waRouterModalInitialized) return;
    window._waRouterModalInitialized = true;

    // Determine correct relative prefix to site root
    function getSiteRootPrefix() {
      const appleCss = document.querySelector('link[href*="apple-theme.css"]');
      if (appleCss) {
        const href = appleCss.getAttribute('href');
        const idx = href.indexOf('assets/');
        if (idx !== -1) {
          return href.substring(0, idx);
        }
      }
      const assetEl = document.querySelector('[src*="assets/"]');
      if (assetEl) {
        const src = assetEl.getAttribute('src');
        const idx = src.indexOf('assets/');
        if (idx !== -1) {
          return src.substring(0, idx);
        }
      }
      return '';
    }

    // Modal DOM Injection (if not already rendered on the page)
    let modalEl = document.getElementById('drSmithWaModal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'drSmithWaModal';
      modalEl.className = 'apple-wa-modal-backdrop';
      modalEl.setAttribute('role', 'dialog');
      modalEl.setAttribute('aria-modal', 'true');
      modalEl.setAttribute('aria-labelledby', 'waModalTitle');
      modalEl.innerHTML = `
        <div class="apple-wa-modal-container">
          <button type="button" class="apple-wa-modal-close" id="drSmithWaModalClose" aria-label="Close dialog">
            <i class="bi bi-x-lg"></i>
          </button>
          
          <div class="apple-wa-modal-header">
            <span class="apple-wa-modal-badge">
              <i class="fa-brands fa-whatsapp"></i> Official WhatsApp Direct
            </span>
            <h2 class="apple-wa-modal-title" id="waModalTitle">Select Your Region / Contact Desk</h2>
            <p class="apple-wa-modal-subtitle">
              Choose your inquiry category to connect with our specialized hospital procurement &amp; clinical machinery specialists.
            </p>
          </div>

          <div class="apple-wa-modal-grid">
            <!-- Option 1: Indian Supplier Desk (Domestic - 4 Numbers) -->
            <a href="#" class="apple-wa-choice-card card-india" id="btnWaChoiceIndia">
              <span class="apple-wa-flag">🇮🇳</span>
              <span class="apple-wa-choice-tag tag-india">4 Departmental Desks</span>
              <h3 class="apple-wa-choice-title">Indian Supplier Desks</h3>
              <p class="apple-wa-choice-desc">
                Pan-India turnkey hospital setup, critical care machines, ICU motorized beds &amp; institutional tenders.
              </p>
              <span class="apple-wa-choice-btn btn-choice-india">
                View 4 Desks &amp; Direct Numbers <i class="bi bi-arrow-right"></i>
              </span>
            </a>

            <!-- Option 2: Overseas Desk - Dubai (International - 1 Number) -->
            <a href="#" class="apple-wa-choice-card card-dubai" id="btnWaChoiceDubai">
              <span class="apple-wa-flag">🇦🇪</span>
              <span class="apple-wa-choice-tag tag-dubai">Direct WhatsApp Line</span>
              <h3 class="apple-wa-choice-title">Overseas Desk (Dubai)</h3>
              <p class="apple-wa-choice-desc">
                Middle East, GCC, Africa &amp; global export projects. Direct hotline (+971 50 891 7466).
              </p>
              <span class="apple-wa-choice-btn btn-choice-dubai">
                <i class="fa-brands fa-whatsapp"></i> Chat with Dubai Line (1 Line)
              </span>
            </a>
          </div>

          <div class="apple-wa-modal-footer">
            Dr. Smith Healthcare Global Supply Directorate • Instant Response • Verified Desks
          </div>
        </div>
      `;
      document.body.appendChild(modalEl);
    }

    const modalCloseBtn = document.getElementById('drSmithWaModalClose');
    const choiceIndiaBtn = document.getElementById('btnWaChoiceIndia');
    const choiceDubaiBtn = document.getElementById('btnWaChoiceDubai');

    function openModal() {
      // Auto-close mobile drawer if active
      const mobileDrawer = document.getElementById('apple-mobile-drawer');
      const mobileBackdrop = document.getElementById('appleMobileBackdrop');
      if (mobileDrawer) mobileDrawer.classList.remove('active');
      if (mobileBackdrop) mobileBackdrop.classList.remove('active');
      document.body.classList.remove('mobile-nav-active');

      modalEl.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalEl.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
      });
    }

    // Backdrop click closes modal
    modalEl.addEventListener('click', function(e) {
      if (e.target === modalEl) {
        closeModal();
      }
    });

    // Escape key closes modal
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modalEl.classList.contains('active')) {
        closeModal();
      }
    });

    // Option 1 Click: Indian Supplier Desk (Navigate to whatsapp/index.html?region=india)
    if (choiceIndiaBtn) {
      choiceIndiaBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const rootPrefix = getSiteRootPrefix();
        closeModal();
        window.location.href = rootPrefix + 'whatsapp/index.html?region=india';
      });
    }

    // Option 2 Click: Overseas Desk (Dubai) (Open WhatsApp with single Dubai number in new tab)
    if (choiceDubaiBtn) {
      choiceDubaiBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
        const dubaiWaUrl = 'https://wa.me/971508917466?text=Hello%20Dr.%20Smith%20Healthcare%20Overseas%20Desk%20(Dubai),%20I%20would%20like%20to%20inquire%20about%20International%20Hospital%20Projects%20and%20Export.';
        window.open(dubaiWaUrl, '_blank', 'noopener,noreferrer');
      });
    }

    // Global Delegated Click Listener: Intercept all WhatsApp triggers across the website
    document.addEventListener('click', function(e) {
      // Find closest link or button that triggers WhatsApp
      const trigger = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"], .apple-nav-circle-whatsapp, .btn-hero-whatsapp, .apple-mobile-pill-wa, [data-wa-trigger]');
      if (!trigger) return;

      // Bypass interception if marked as direct link or inside modal
      if (trigger.classList.contains('wa-direct-link') ||
          trigger.getAttribute('data-direct-wa') === 'true' ||
          modalEl.contains(trigger)) {
        return;
      }

      // Otherwise intercept and show router modal
      e.preventDefault();
      e.stopPropagation();
      openModal();
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhatsAppRouterModal);
  } else {
    initWhatsAppRouterModal();
  }

  /**
   * 19. Viewport-Priority Progressive Section & Image Loader
   * Ensures ultra-smooth 60fps performance even on image-heavy pages:
   *  - Stage 1 (Active Viewport / "Front Web"): Loads ONLY the sections & images currently visible
   *    in the user's viewport first with high priority, deferring off-screen requests.
   *  - Stage 2 (Immediate Upper & Lower Parts): Once the currently visible screen finishes loading,
   *    automatically focuses on pre-loading and decoding the adjacent upper and lower viewport buffers.
   *  - Stage 3 (Outward Upper & Lower Queue): Progressively loads remaining upper and lower sections
   *    outward from the current scroll position in small non-blocking idle batches.
   */
  function initViewportPriorityLoader() {
    if (window._vpPriorityLoaderInitialized) return;
    window._vpPriorityLoaderInitialized = true;

    const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E";
    const deferredImages = new Set();
    let stage1Complete = false;
    let batchTimer = null;
    let scrollTicking = false;

    function getViewportMetrics() {
      return {
        vh: window.innerHeight || document.documentElement.clientHeight || 800
      };
    }

    // Distance from element rect to the currently visible viewport [0, vh]
    // Returns 0 if intersecting the visible screen; positive pixel distance if above or below.
    function distanceToViewport(rect, vh) {
      if (rect.bottom >= 0 && rect.top <= vh) {
        return 0;
      }
      if (rect.bottom < 0) {
        return -rect.bottom; // Upper part distance above top of screen
      }
      return rect.top - vh;  // Lower part distance below bottom of screen
    }

    function isCriticalUiImage(img) {
      if (!img) return true;
      if (img.closest('.apple-globalnav, .apple-mobile-drawer, .apple-wa-modal-backdrop')) {
        return true;
      }
      const w = img.getAttribute('width');
      if (w && parseInt(w, 10) > 0 && parseInt(w, 10) <= 64) {
        return true;
      }
      return false;
    }

    // Restore a deferred image's original source and decode off the main thread
    function restoreImage(img, priority) {
      if (!img) return Promise.resolve();
      const origSrc = img.getAttribute('data-vp-src');
      const origSrcset = img.getAttribute('data-vp-srcset');

      if (!origSrc && !origSrcset) {
        deferredImages.delete(img);
        return Promise.resolve();
      }

      deferredImages.delete(img);
      if (priority) {
        try { img.fetchPriority = priority; } catch (e) {}
      }
      img.setAttribute('decoding', 'async');
      img.setAttribute('loading', 'eager');

      if (origSrcset) {
        img.setAttribute('srcset', origSrcset);
        img.removeAttribute('data-vp-srcset');
      }
      if (origSrc) {
        img.setAttribute('src', origSrc);
        img.removeAttribute('data-vp-src');
      }

      const parentSection = img.closest('[data-vp-zone]');
      if (parentSection) {
        parentSection.setAttribute('data-vp-zone', 'loaded');
      }

      return new Promise(function(resolve) {
        function finalize() {
          img.classList.remove('vp-img-deferred');
          img.classList.add('vp-img-loaded');
          resolve();
        }
        if (typeof img.decode === 'function') {
          img.decode().then(finalize).catch(finalize);
        } else if (img.complete) {
          finalize();
        } else {
          img.addEventListener('load', finalize, { once: true });
          img.addEventListener('error', finalize, { once: true });
          setTimeout(finalize, 350);
        }
      });
    }

    // Classify sections into visible, adjacent (upper/lower), or deferred zones
    function updateSectionZones() {
      const { vh } = getViewportMetrics();
      const sections = document.querySelectorAll('section, .apple-globalfooter, .catalogue-category-section');
      sections.forEach(function(sec) {
        if (sec.getAttribute('data-vp-zone') === 'loaded') return;
        const rect = sec.getBoundingClientRect();
        const dist = distanceToViewport(rect, vh);
        if (dist <= 48) {
          sec.setAttribute('data-vp-zone', 'visible');
        } else if (dist <= vh * 1.35) {
          sec.setAttribute('data-vp-zone', 'adjacent');
        } else if (!sec.hasAttribute('data-vp-zone')) {
          sec.setAttribute('data-vp-zone', 'deferred');
        }
      });
    }

    // Stage 2 & 3: After visible viewport finishes, load immediate Upper & Lower parts, then outward
    function processUpperAndLowerQueue() {
      if (batchTimer) {
        clearTimeout(batchTimer);
        batchTimer = null;
      }

      updateSectionZones();

      if (deferredImages.size === 0) {
        // Ensure all sections are unlocked once all images are ready
        document.querySelectorAll('[data-vp-zone="deferred"]').forEach(function(sec) {
          sec.setAttribute('data-vp-zone', 'loaded');
        });
        return;
      }

      const { vh } = getViewportMetrics();
      const visibleNow = [];
      const adjacentUpperAndLower = [];
      const distantUpperAndLower = [];

      deferredImages.forEach(function(img) {
        if (!document.body.contains(img)) {
          deferredImages.delete(img);
          return;
        }
        const rect = img.getBoundingClientRect();
        const dist = distanceToViewport(rect, vh);
        const item = { img: img, dist: dist };

        if (dist <= 60) {
          visibleNow.push(item);
        } else if (dist <= vh * 1.4) {
          adjacentUpperAndLower.push(item);
        } else {
          distantUpperAndLower.push(item);
        }
      });

      // 1. Any image that entered the visible viewport is restored immediately
      if (visibleNow.length > 0) {
        visibleNow.forEach(function(item) {
          restoreImage(item.img, 'high');
        });
      }

      if (!stage1Complete) return;

      // 2. Focus on immediate Upper & Lower parts (sorted closest to viewport edge first)
      if (adjacentUpperAndLower.length > 0) {
        adjacentUpperAndLower.sort(function(a, b) { return a.dist - b.dist; });
        const batch = adjacentUpperAndLower.slice(0, 6);
        Promise.all(batch.map(function(item) {
          return restoreImage(item.img, 'auto');
        })).then(function() {
          batchTimer = setTimeout(processUpperAndLowerQueue, 25);
        });
        return;
      }

      // 3. Progressively load remaining Far Upper & Far Lower parts outward in idle batches of 4
      if (distantUpperAndLower.length > 0) {
        distantUpperAndLower.sort(function(a, b) { return a.dist - b.dist; });
        const scheduleNext = window.requestIdleCallback || function(cb) { return setTimeout(cb, 45); };
        scheduleNext(function() {
          const batch = distantUpperAndLower.slice(0, 4);
          Promise.all(batch.map(function(item) {
            return restoreImage(item.img, 'low');
          })).then(function() {
            if (deferredImages.size > 0) {
              batchTimer = setTimeout(processUpperAndLowerQueue, 40);
            } else {
              document.querySelectorAll('[data-vp-zone="deferred"]').forEach(function(sec) {
                sec.setAttribute('data-vp-zone', 'loaded');
              });
            }
          });
        });
      }
    }

    // Stage 1: Inspect all images, keep ONLY currently visible viewport active, defer upper & lower parts
    function scanAndPrioritizeViewport(rootNodes) {
      const { vh } = getViewportMetrics();
      updateSectionZones();

      const imgs = [];
      rootNodes.forEach(function(node) {
        if (!node || node.nodeType !== 1) return;
        if (node.tagName === 'IMG') {
          imgs.push(node);
        } else if (node.querySelectorAll) {
          node.querySelectorAll('img').forEach(function(i) { imgs.push(i); });
        }
      });

      const visiblePending = [];

      imgs.forEach(function(img) {
        if (img.hasAttribute('data-vp-managed')) return;
        img.setAttribute('data-vp-managed', 'true');
        img.setAttribute('decoding', 'async');

        if (isCriticalUiImage(img)) {
          img.setAttribute('loading', 'eager');
          return;
        }

        const rect = img.getBoundingClientRect();
        const dist = distanceToViewport(rect, vh);

        if (dist <= 48) {
          // Currently visible to the user ("Front Web") -> Highest Priority!
          img.setAttribute('loading', 'eager');
          try { img.fetchPriority = 'high'; } catch (e) {}
          if (!img.complete) {
            visiblePending.push(img);
          }
        } else {
          // Off-screen (Upper or Lower part) -> Defer if not already cached in memory
          if (!img.complete) {
            const currentSrc = img.getAttribute('src');
            const currentSrcset = img.getAttribute('srcset');
            if (currentSrc && !currentSrc.startsWith('data:')) {
              img.setAttribute('data-vp-src', currentSrc);
              if (currentSrcset) {
                img.setAttribute('data-vp-srcset', currentSrcset);
                img.removeAttribute('srcset');
              }
              img.classList.add('vp-img-deferred');
              img.setAttribute('loading', 'lazy');
              try { img.fetchPriority = 'low'; } catch (e) {}
              img.setAttribute('src', PLACEHOLDER_SVG);
              deferredImages.add(img);
            }
          }
        }
      });

      return visiblePending;
    }

    // Initial Stage 1 execution
    const initialVisiblePending = scanAndPrioritizeViewport([document.body]);

    function completeStage1() {
      if (stage1Complete) return;
      stage1Complete = true;
      processUpperAndLowerQueue();
    }

    if (initialVisiblePending.length === 0) {
      // Visible viewport images are already ready; start loading Upper & Lower parts right away
      requestAnimationFrame(completeStage1);
    } else {
      let remaining = initialVisiblePending.length;
      const onVisibleImgDone = function() {
        remaining -= 1;
        if (remaining <= 0) {
          completeStage1();
        }
      };
      initialVisiblePending.forEach(function(img) {
        if (img.complete) {
          onVisibleImgDone();
        } else {
          img.addEventListener('load', onVisibleImgDone, { once: true });
          img.addEventListener('error', onVisibleImgDone, { once: true });
        }
      });
      // Safety cap so a single slow asset never blocks Upper & Lower loading for more than 450ms
      setTimeout(completeStage1, 450);
    }

    // Real-time Scroll & Resize listener: immediately promote whatever enters the user's viewport
    function onViewportShift() {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(function() {
          processUpperAndLowerQueue();
          scrollTicking = false;
        });
      }
    }

    window.addEventListener('scroll', onViewportShift, { passive: true });
    window.addEventListener('resize', onViewportShift, { passive: true });
    window.addEventListener('hashchange', onViewportShift, { passive: true });

    // Ensure any clicked product card/image restores its original src before any click handler reads it
    document.addEventListener('click', function(e) {
      const cardOrLink = e.target.closest('a, button, .apple-promo-card, .product-card, .cat-card');
      const scope = cardOrLink || e.target;
      if (scope && scope.querySelectorAll) {
        scope.querySelectorAll('img[data-vp-src]').forEach(function(img) {
          restoreImage(img, 'high');
        });
      }
      if (e.target && e.target.tagName === 'IMG' && e.target.hasAttribute('data-vp-src')) {
        restoreImage(e.target, 'high');
      }
    }, true);

    // Watch for dynamically injected product cards/images (e.g. catalogue search/filter)
    if (typeof MutationObserver !== 'undefined' && document.body) {
      const observer = new MutationObserver(function(mutations) {
        const added = [];
        mutations.forEach(function(m) {
          m.addedNodes.forEach(function(n) {
            if (n.nodeType === 1) added.push(n);
          });
        });
        if (added.length > 0) {
          scanAndPrioritizeViewport(added);
          if (stage1Complete) {
            processUpperAndLowerQueue();
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewportPriorityLoader);
  } else {
    initViewportPriorityLoader();
  }

})();