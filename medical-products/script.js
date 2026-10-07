/**
 * Dedicated JavaScript for Medical Products Page
 */

document.addEventListener('DOMContentLoaded', () => {
  // Live filtering / quick search across product category cards
  const filterInput = document.getElementById('productCategorySearch');
  const cards = document.querySelectorAll('.product-grid-col');

  if (filterInput) {
    filterInput.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      cards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
        if (!query || title.includes(query) || desc.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
});
