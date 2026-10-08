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
  const scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      if (window.scrollY > 100) {
        scrollTop.classList.add('active');
      } else {
        scrollTop.classList.remove('active');
      }
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);


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
        gap = 80;
      } else if (viewportWidth >= 480) {
        slidesPerView = 3;
        gap = 60;
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

  // Initialize clients slider when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initClientsSlider();
      initCategoriesCarousel();
    });
  } else {
    initClientsSlider();
    initCategoriesCarousel();
  }


  /**
   * 13. Categories Showcase Interactive Auto-Scrolling Carousel (Left-to-Right)
   * Continuously scrolls category cards seamlessly from left to right.
   * Supports:
   * - Interactive touch drag / swipe on mobile
   * - Mouse drag with inertia on desktop
   * - Trackpad / mouse wheel horizontal scrolling
   * - Hover pause for reading cards without unwanted clicks on drag
   * - Seamless 60fps infinite looping with requestAnimationFrame
   */
  function initCategoriesCarousel() {
    const container = document.querySelector('#categories-carousel');
    const track = container ? container.querySelector('.categories-track') : null;

    if (!container || !track || container.dataset.ready) return;
    container.dataset.ready = '1';

    // Duplicate slides to create an infinite seamless loop
    const originalCards = Array.from(track.children);
    if (!originalCards.length) return;

    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    // Carousel state
    let totalSetWidth = 0;
    let scrollOffset = 0;
    let isDragging = false;
    let isHovered = false;
    let hasMoved = false;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let lastTimestamp = null;
    const baseSpeed = -0.055; // Negative speed moves items continuously from left to right

    function calculateWidths() {
      let width = 0;
      for (let i = 0; i < originalCards.length; i++) {
        const item = track.children[i];
        if (!item) continue;
        const style = window.getComputedStyle(item);
        const marginRight = parseFloat(style.marginRight) || 0;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 16;
        width += item.offsetWidth + (marginRight || gap);
      }
      totalSetWidth = width;
    }

    function normalizeOffset(val) {
      if (totalSetWidth <= 0) return 0;
      return ((val % totalSetWidth) + totalSetWidth) % totalSetWidth;
    }

    function render() {
      track.style.transform = `translate3d(${-scrollOffset}px, 0, 0)`;
    }

    // Touch and mouse pointer handlers
    function onPointerDown(e) {
      isDragging = true;
      hasMoved = false;
      dragStartX = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX) || 0;
      dragStartOffset = scrollOffset;
      lastX = dragStartX;
      lastTime = performance.now();
      velocity = 0;
      container.style.cursor = 'grabbing';
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const currentX = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX) || 0;
      const deltaX = currentX - dragStartX;

      if (Math.abs(deltaX) > 5) {
        hasMoved = true;
      }

      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        velocity = -(currentX - lastX) / dt;
        lastX = currentX;
        lastTime = now;
      }

      scrollOffset = normalizeOffset(dragStartOffset - deltaX);
      render();
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = 'grab';
    }

    // Prevent navigation click when user was dragging
    container.addEventListener('click', function(e) {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Mouse Events
    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Touch Events
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });
    window.addEventListener('touchcancel', onPointerUp, { passive: true });

    // Hover detection (pauses auto-scroll so user can interact comfortably)
    container.addEventListener('mouseenter', () => { isHovered = true; });
    container.addEventListener('mouseleave', () => { isHovered = false; });

    // Wheel horizontal scrolling
    container.addEventListener('wheel', (e) => {
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      scrollOffset = normalizeOffset(scrollOffset + delta * 0.75);
      render();
    }, { passive: true });

    // 60fps animation loop
    function loop(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const dt = Math.min(timestamp - lastTimestamp, 50);
      lastTimestamp = timestamp;

      if (!isDragging) {
        // Inertia release damping
        if (Math.abs(velocity) > 0.01) {
          scrollOffset = normalizeOffset(scrollOffset + velocity * dt);
          velocity *= 0.94;
        } else if (!isHovered) {
          // Continuous left-to-right auto drift
          scrollOffset = normalizeOffset(scrollOffset + baseSpeed * dt);
        }
        render();
      }

      requestAnimationFrame(loop);
    }

    calculateWidths();
    window.addEventListener('load', calculateWidths);
    window.addEventListener('resize', calculateWidths);
    requestAnimationFrame(loop);
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

})();