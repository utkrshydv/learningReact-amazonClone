import { addToCart, updateCart } from "../data/cart.js";
import { products } from "../data/products.js";

renderProductsGrid();

function renderProductsGrid() {
  let productsHTML = '';

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;

  function removeSpecialCharacters(str) {
    return str.replace(/[^a-zA-Z0-9 ]/g, '');
  }

  if (search) {
    const cleanedSearch = removeSpecialCharacters(search.toLowerCase());
    filteredProducts = products.filter((product) => {
      const cleanedProductName = removeSpecialCharacters(product.name.toLowerCase());
      return cleanedProductName.includes(cleanedSearch);
    });
  }

  filteredProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container" title="${product.name}">
        <div class="product-image-container" title="${product.name}">
          <img class="product-image" src="${product.image}" alt="${product.name}">
        </div>

        <div class="product-name limit-text-to-2-lines" title="${product.name}">
          ${product.name}
        </div>

        <div class="product-rating-container" title="Rating: ${product.rating.count} stars">
          <img class="product-rating-stars" src="${product.getStarsUrl()}" alt="Rating stars">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price" title="Price: $${product.getPrice()}">
          $${product.getPrice()}
        </div>

        <div class="product-quantity-container" title="Select quantity">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}" title="Add ${product.name} to cart">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  const addedMessageTimeouts = {};

  function removeAddedMessage(productId) {
    const previousTimeoutId = addedMessageTimeouts[productId];

    if (previousTimeoutId) {
      clearTimeout(previousTimeoutId);
    }

    const timeoutId = setTimeout(() => {
      document.querySelector(`.added-to-cart-${productId}`).classList.remove("after-adding");
    }, 1500);

    addedMessageTimeouts[productId] = timeoutId;
  }

  updateCart('js-cart-quantity');

  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const { productId } = button.dataset;

      addToCart(productId);
      updateCart('js-cart-quantity');
      document.querySelector(`.added-to-cart-${productId}`).classList.add("after-adding");
      removeAddedMessage(productId);
    });
  });

  document.querySelector('.js-search-button').addEventListener('click', () => {
    const search = document.querySelector('.js-search-bar').value;
    window.location.href = `index.html?search=${search}`;
  });

  document.querySelector('.js-search-bar').addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        const search = document.querySelector('.js-search-bar').value;
    window.location.href = `index.html?search=${search}`;
    }
  
  });
}
