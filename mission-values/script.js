/**
 * Dedicated JavaScript for Mission & Values Page
 */

document.addEventListener('DOMContentLoaded', () => {
  // Intersection animation for value cards
  const cards = document.querySelectorAll('.value-pillar-card, .cert-badge-item');
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
