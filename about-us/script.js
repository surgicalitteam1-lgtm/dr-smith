/**
 * Dedicated JavaScript for About Us Page
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize PureCounter animations if loaded
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  // Smooth appearance for stats on scroll
  const statItems = document.querySelectorAll('.heritage-pill-card, .stat-item');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    statItems.forEach(item => observer.observe(item));
  }
});
