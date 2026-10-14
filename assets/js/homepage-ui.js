(function() {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var categoryViewport = document.querySelector('.swm-categories-viewport');
  var categoryGrid = categoryViewport ? categoryViewport.querySelector('.swm-cards-grid') : null;
  if (categoryViewport && categoryGrid && categoryGrid.children.length) {
    var categoryTrack = document.createElement('div');
    categoryTrack.className = 'swm-category-track';
    categoryViewport.insertBefore(categoryTrack, categoryGrid);
    categoryTrack.appendChild(categoryGrid);
    categoryGrid.classList.add('swm-category-group');

    var categoryClone = categoryGrid.cloneNode(true);
    categoryClone.classList.add('swm-category-group-clone');
    categoryClone.setAttribute('aria-hidden', 'true');
    categoryClone.querySelectorAll('a').forEach(function(link) {
      link.setAttribute('tabindex', '-1');
    });
    categoryTrack.appendChild(categoryClone);

    var categoryPosition = 0;
    var categoryWidth = 0;
    var categoryLastFrame = 0;
    var categoryPaused = reducedMotion;
    var categoryMove = null;

    function updateCategoryWidth() {
      categoryWidth = categoryGrid.getBoundingClientRect().width;
      if (categoryWidth > 0) {
        categoryPosition %= categoryWidth;
        categoryTrack.style.transform = 'translate3d(' + (-categoryPosition) + 'px, 0, 0)';
      }
    }

    function animateCategories(timestamp) {
      var delta = categoryLastFrame ? Math.min(timestamp - categoryLastFrame, 50) : 0;
      categoryLastFrame = timestamp;

      if (categoryWidth > 0 && !document.hidden) {
        if (categoryMove) {
          var progress = Math.min((timestamp - categoryMove.startedAt) / categoryMove.duration, 1);
          var eased = progress * progress * (3 - 2 * progress);
          categoryPosition = categoryMove.start + (categoryMove.end - categoryMove.start) * eased;
          if (progress === 1) {
            categoryPosition = ((categoryMove.end % categoryWidth) + categoryWidth) % categoryWidth;
            categoryMove = null;
          }
        } else if (!categoryPaused) {
          categoryPosition = (categoryPosition + delta * 0.022) % categoryWidth;
        }

        categoryTrack.style.transform = 'translate3d(' + (-categoryPosition) + 'px, 0, 0)';
      }

      window.requestAnimationFrame(animateCategories);
    }

    function moveCategories(direction) {
      if (reducedMotion) {
        categoryViewport.scrollBy({
          left: direction * categoryViewport.clientWidth * 0.8,
          behavior: 'auto'
        });
        return;
      }

      var endPosition = categoryPosition + direction * categoryViewport.clientWidth * 0.8;
      categoryMove = {
        start: categoryPosition,
        end: endPosition,
        duration: Math.max(550, Math.min(1600, Math.abs(endPosition - categoryPosition) * 1.5)),
        startedAt: window.performance.now()
      };
    }

    document.querySelectorAll('.swm-category-arrow').forEach(function(button) {
      button.addEventListener('click', function() {
        moveCategories(button.classList.contains('swm-category-arrow-next') ? 1 : -1);
      });
    });

    categoryViewport.addEventListener('mouseenter', function() {
      categoryPaused = true;
    });
    categoryViewport.addEventListener('mouseleave', function() {
      categoryPaused = reducedMotion;
    });
    categoryViewport.addEventListener('focusin', function() {
      categoryPaused = true;
    });
    categoryViewport.addEventListener('focusout', function(event) {
      if (!categoryViewport.contains(event.relatedTarget)) {
        categoryPaused = reducedMotion;
      }
    });
    document.addEventListener('visibilitychange', function() {
      categoryLastFrame = 0;
    });

    if (window.ResizeObserver) {
      new ResizeObserver(updateCategoryWidth).observe(categoryViewport);
    } else {
      window.addEventListener('resize', updateCategoryWidth);
    }

    updateCategoryWidth();
    window.requestAnimationFrame(animateCategories);
  }
})();
