/**
 * Dr. Smith Healthcare - Catalogue & Category Filter Controller
 * Handles live client-side filtering across catalogue hubs, category lists, and product grids.
 */
(function() {
  'use strict';

  function initCatalogueFilters() {
    // 1. Category Product Filter (e.g. beds, abs-panels, anesthesia-workstation, etc.)
    var productSearch = document.getElementById('categoryProductSearch');
    if (productSearch) {
      productSearch.addEventListener('input', function() {
        var query = this.value.toLowerCase().trim();
        var items = document.querySelectorAll('.catalogue-grid-item');
        var count = 0;
        items.forEach(function(item) {
          var title = (item.getAttribute('data-title') || '').toLowerCase();
          var badge = (item.getAttribute('data-badge') || '').toLowerCase();
          var text = item.textContent.toLowerCase();
          if (!query || title.includes(query) || badge.includes(query) || text.includes(query)) {
            item.style.display = '';
            count++;
          } else {
            item.style.display = 'none';
          }
        });
        var countElem = document.querySelector('.catalogue-count strong');
        if (countElem) {
          countElem.textContent = count;
        }
      });
    }

    // 2. Subcategory Hub Filter (e.g. equipments, furniture, instruments, etc.)
    var subcatSearch = document.getElementById('subcat-search-input');
    var subcatCount = document.getElementById('subcat-count');
    if (subcatSearch) {
      subcatSearch.addEventListener('input', function() {
        var query = this.value.toLowerCase().trim();
        var items = document.querySelectorAll('.subcat-col');
        var count = 0;
        items.forEach(function(item) {
          var title = (item.getAttribute('data-title') || '').toLowerCase();
          var desc = item.textContent.toLowerCase();
          if (!query || title.includes(query) || desc.includes(query)) {
            item.style.display = '';
            count++;
          } else {
            item.style.display = 'none';
          }
        });
        if (subcatCount) {
          subcatCount.textContent = count;
        }
      });
    }

    // 3. Main Catalogue Page Filter (catalogue/index.html)
    var catFilterSearch = document.getElementById('category-filter-search');
    var catResultsCount = document.getElementById('category-results-count');
    var noCatResults = document.getElementById('no-category-results');
    if (catFilterSearch) {
      catFilterSearch.addEventListener('input', function() {
        var query = this.value.toLowerCase().trim();
        var categoryCards = document.querySelectorAll('.category-box-col');
        var visibleCount = 0;

        categoryCards.forEach(function(card) {
          var title = (card.getAttribute('data-title') || '').toLowerCase();
          var keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
          var text = card.textContent.toLowerCase();

          var isMatch = !query || title.includes(query) || keywords.includes(query) || text.includes(query);
          card.style.display = isMatch ? '' : 'none';

          if (isMatch) visibleCount++;
        });

        if (catResultsCount) {
          catResultsCount.textContent = visibleCount;
        }

        if (noCatResults) {
          noCatResults.classList.toggle('d-none', visibleCount > 0);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCatalogueFilters);
  } else {
    initCatalogueFilters();
  }
})();
