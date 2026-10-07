/**
 * Dedicated JavaScript for Turnkey Projects Page
 */

document.addEventListener('DOMContentLoaded', () => {
  // Intersection animation for turnkey cards
  const cards = document.querySelectorAll('.turnkey-feature-card, .process-step-box');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cards.forEach(card => observer.observe(card));
  }
});
