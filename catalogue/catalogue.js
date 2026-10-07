/**
 * Product Catalogue Generator & Filter System
 * 
 * Generates product cards from window.catalogueProducts,
 * updates category count badges, and manages real-time category filtering.
 */

// -------------------------------------------------------------
// DOM Element References & Product Data
// -------------------------------------------------------------
const catalogueFilters = document.querySelectorAll('.catalogue-filter');
const catalogueGrid = document.getElementById('catalogue-grid');
const catalogueCount = document.getElementById('catalogue-count');
const catalogueEmpty = document.getElementById('catalogue-empty');
const catalogueProducts = window.catalogueProducts;

// Human-readable labels used in the "Showing X ..." counter text
const categoryLabels = {
    all: 'products',
    furniture: 'beds and furniture products',
    surgical: 'O.T. and surgical products',
    transport: 'transport and ward products',
    equipment: 'medical equipment products',
    diagnostics: 'diagnostics and laboratory products'
};

// Category badge titles displayed on individual product cards
const categoryNames = {
    furniture: 'Beds & furniture',
    surgical: 'O.T. & surgical',
    transport: 'Transport & ward',
    equipment: 'Medical equipment',
    diagnostics: 'Diagnostics & lab'
};

// Validate that the catalogue product data and target grid container exist
if (!Array.isArray(catalogueProducts) || catalogueProducts.length === 0 || !catalogueGrid) {
    const errorMessage = 'The product catalogue could not be loaded.';
    if (catalogueGrid) {
        catalogueGrid.textContent = errorMessage;
    }
    throw new Error(errorMessage);
}

// -------------------------------------------------------------
// Product Card Component Factory
// -------------------------------------------------------------
/**
 * Generates the full HTML markup for an individual product card.
 * @param {Object} product - Product details (name, category, image, description, details)
 * @returns {HTMLElement} - Responsive column element containing the finished card
 */
function createCatalogueCard(product) {
    // 1. Outer responsive grid column
    const column = document.createElement('div');
    column.className = 'col-sm-6 col-lg-4 catalogue-grid-item';
    column.dataset.category = product.category;

    // 2. Main card article
    const article = document.createElement('article');
    article.className = 'catalogue-card';

    // 3. Image Link (opens product photo in a new tab)
    const imageLink = document.createElement('a');
    imageLink.href = product.image;
    imageLink.target = '_blank';
    imageLink.rel = 'noopener';
    imageLink.setAttribute('aria-label', `Open product image for ${product.name}`);

    // Product photo container and image element
    const imageFrame = document.createElement('div');
    imageFrame.className = 'catalogue-card__image catalogue-card__image--photo';
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = `${product.name}, cropped from the supplied Dr. Smith catalogue`;
    image.loading = 'lazy';
    imageFrame.append(image);
    imageLink.append(imageFrame);

    // 4. Card body container
    const body = document.createElement('div');
    body.className = 'catalogue-card__body';

    // Category badge
    const category = document.createElement('span');
    category.className = 'catalogue-card__category';
    category.textContent = categoryNames[product.category] || 'Medical products';

    // Product title heading
    const heading = document.createElement('h3');
    heading.textContent = product.name;

    // Short summary description
    const description = document.createElement('p');
    description.textContent = product.description;

    // Specifications bullet points list
    const detailList = document.createElement('ul');
    detailList.className = 'catalogue-card__details';
    product.details.forEach((detail) => {
        const item = document.createElement('li');
        item.textContent = detail;
        detailList.append(item);
    });

    // 5. Actions row (View image & Enquire links)
    const actions = document.createElement('div');
    actions.className = 'catalogue-card__actions';

    // Link to view high-resolution image
    const productImageLink = document.createElement('a');
    productImageLink.className = 'catalogue-card__link';
    productImageLink.href = product.image;
    productImageLink.target = '_blank';
    productImageLink.rel = 'noopener';
    productImageLink.append(document.createTextNode('View product image '));
    const productImageIcon = document.createElement('i');
    productImageIcon.className = 'bi bi-arrow-up-right';
    productImageIcon.setAttribute('aria-hidden', 'true');
    productImageLink.append(productImageIcon);

    // Link to open enquiry form
    const enquiryLink = document.createElement('a');
    enquiryLink.className = 'catalogue-card__link';
    enquiryLink.href = '../contact-form/index.html';
    enquiryLink.append(document.createTextNode('Enquire '));
    const enquiryIcon = document.createElement('i');
    enquiryIcon.className = 'bi bi-arrow-right';
    enquiryIcon.setAttribute('aria-hidden', 'true');
    enquiryLink.append(enquiryIcon);

    actions.append(productImageLink, enquiryLink);

    // Attribution note
    const sourceNote = document.createElement('p');
    sourceNote.className = 'catalogue-card__source';
    sourceNote.textContent = 'Product details transcribed from the supplied Dr. Smith catalogue.';

    // Assemble components into the final card
    body.append(category, heading, description, detailList, actions, sourceNote);
    article.append(imageLink, body);
    column.append(article);

    return column;
}

// -------------------------------------------------------------
// 1. Initial Grid Population
// -------------------------------------------------------------
// Render all products from dataset into the catalogue grid
catalogueProducts.forEach((product) => {
    catalogueGrid.append(createCatalogueCard(product));
});

// -------------------------------------------------------------
// 2. Category Count Badges
// -------------------------------------------------------------
// Update badge counts for each category filter button
document.querySelectorAll('[data-category-count]').forEach((countElement) => {
    const category = countElement.dataset.categoryCount;
    const count = category === 'all'
        ? catalogueProducts.length
        : catalogueProducts.filter((product) => product.category === category).length;
    countElement.textContent = String(count);
});

// -------------------------------------------------------------
// 3. Category Filtering Logic
// -------------------------------------------------------------
/**
 * Shows or hides products matching the specified category key.
 * @param {string} selectedCategory - Category to filter by ('all', 'furniture', etc.)
 */
function applyCatalogueFilter(selectedCategory) {
    let visibleCount = 0;

    // Show matching products, hide non-matching
    catalogueGrid.querySelectorAll('.catalogue-grid-item').forEach((item) => {
        const isMatch = selectedCategory === 'all' || item.dataset.category === selectedCategory;
        item.hidden = !isMatch;
        if (isMatch) {
            visibleCount += 1;
        }
    });

    // Update the counter message
    if (catalogueCount) {
        catalogueCount.innerHTML = `Showing <strong>${visibleCount}</strong> ${categoryLabels[selectedCategory] || 'products'}`;
    }

    // Toggle empty state if no products matched
    if (catalogueEmpty) {
        catalogueEmpty.classList.toggle('is-visible', visibleCount === 0);
    }
}

// -------------------------------------------------------------
// 4. Filter Button Event Listeners
// -------------------------------------------------------------
catalogueFilters.forEach((filterButton) => {
    filterButton.addEventListener('click', () => {
        const selectedCategory = filterButton.dataset.filter;
        if (!selectedCategory) return;

        // Update active styling on filter tabs
        catalogueFilters.forEach((button) => {
            const isActive = button === filterButton;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });

        // Filter the grid
        applyCatalogueFilter(selectedCategory);
    });
});

// Display all products initially on page load
applyCatalogueFilter('all');
