/**
 * Hospital Beds Filter & View Manager
 * 
 * Manages category filtering for hospital beds (manual, electrical, specialty)
 * and view toggling between category selection tiles and product results.
 */

// -------------------------------------------------------------
// DOM Element References
// -------------------------------------------------------------
const bedCategoryTiles = document.querySelectorAll('.bed-category-tile');
const bedItems = document.querySelectorAll('#beds-grid .catalogue-grid-item');
const bedsCount = document.getElementById('beds-count');
const bedsEmpty = document.getElementById('beds-empty');
const bedCategorySelect = document.getElementById('bed-category-select');
const bedResults = document.getElementById('bed-results');
const bedBackButton = document.getElementById('bed-back-button');

// Readable category names for the counter display
const bedCategoryLabels = {
    all: 'beds',
    manual: 'manual beds',
    electrical: 'electrical beds',
    specialty: 'specialty beds'
};

// -------------------------------------------------------------
// Category Filtering Logic
// -------------------------------------------------------------
/**
 * Shows or hides bed cards based on matching category key.
 * @param {string} selectedCategory - Category key ('all', 'manual', 'electrical', 'specialty')
 */
function applyBedFilter(selectedCategory) {
    let visibleCount = 0;

    // Filter each bed card in the grid
    bedItems.forEach((item) => {
        const isMatch = selectedCategory === 'all' || item.dataset.category === selectedCategory;
        item.hidden = !isMatch;
        if (isMatch) {
            visibleCount += 1;
        }
    });

    // Update count display
    if (bedsCount) {
        bedsCount.innerHTML = `Showing <strong>${visibleCount}</strong> ${bedCategoryLabels[selectedCategory] || 'beds'}`;
    }

    // Toggle empty state if no beds match
    if (bedsEmpty) {
        bedsEmpty.classList.toggle('is-visible', visibleCount === 0);
    }
}

/**
 * Filters and reveals the results grid for the chosen bed category.
 * @param {string} selectedCategory - Selected category key
 */
function showBedResults(selectedCategory) {
    applyBedFilter(selectedCategory);

    // Hide category selection view and reveal results
    if (bedCategorySelect) {
        bedCategorySelect.hidden = true;
    }
    if (bedResults) {
        bedResults.hidden = false;
        bedResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Returns to the main category selection grid.
 */
function showBedCategories() {
    // Hide results grid and reveal category selection view
    if (bedResults) {
        bedResults.hidden = true;
    }
    if (bedCategorySelect) {
        bedCategorySelect.hidden = false;
        bedCategorySelect.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// -------------------------------------------------------------
// Event Listeners
// -------------------------------------------------------------
// Handle clicks on bed category tiles
bedCategoryTiles.forEach((tile) => {
    tile.addEventListener('click', () => {
        showBedResults(tile.dataset.filter);
    });
});

// Handle click on back button to return to category overview
if (bedBackButton) {
    bedBackButton.addEventListener('click', showBedCategories);
}
