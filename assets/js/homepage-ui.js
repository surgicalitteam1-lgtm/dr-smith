(function() {
  'use strict';

  var hero = document.getElementById('hero');
  var slides = hero ? Array.prototype.slice.call(hero.querySelectorAll('.swm-hero-media img')) : [];
  var pagination = hero ? Array.prototype.slice.call(hero.querySelectorAll('.swm-hero-pagination button')) : [];
  var currentSlide = 0;
  var heroTimer;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === currentSlide);
    });
    pagination.forEach(function(button, buttonIndex) {
      var active = buttonIndex === currentSlide;
      button.classList.toggle('active', active);
      if (active) {
        button.setAttribute('aria-current', 'true');
      } else {
        button.removeAttribute('aria-current');
      }
    });
  }

  function startHeroTimer() {
    if (reducedMotion || slides.length < 2) return;
    window.clearInterval(heroTimer);
    heroTimer = window.setInterval(function() {
      showSlide(currentSlide + 1);
    }, 4000);
  }

  if (hero && slides.length) {
    hero.querySelectorAll('[data-hero-step]').forEach(function(button) {
      button.addEventListener('click', function() {
        showSlide(currentSlide + Number(button.getAttribute('data-hero-step')));
        startHeroTimer();
      });
    });

    pagination.forEach(function(button, index) {
      button.addEventListener('click', function() {
        showSlide(index);
        startHeroTimer();
      });
    });

    startHeroTimer();
  }

  var categoryViewport = document.querySelector('.swm-categories-viewport');
  if (categoryViewport) {
    document.querySelectorAll('.swm-category-arrow').forEach(function(button) {
      button.addEventListener('click', function() {
        var direction = button.classList.contains('swm-category-arrow-next') ? 1 : -1;
        categoryViewport.scrollBy({
          left: direction * categoryViewport.clientWidth * 0.8,
          behavior: reducedMotion ? 'auto' : 'smooth'
        });
      });
    });
  }
})();
