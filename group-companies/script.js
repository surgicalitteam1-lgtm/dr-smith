/**
 * Dedicated JavaScript for Group Companies Page
 */

document.addEventListener('DOMContentLoaded', () => {
  // Intersection animation for company profile cards
  const cards = document.querySelectorAll('.company-profile-card');
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
