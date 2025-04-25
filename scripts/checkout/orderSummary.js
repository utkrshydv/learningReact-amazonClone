import { cart, removeFromCart, updateQuantity } from "../../data/cart.js";
import { getProduct, products } from "../../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from "../../data/deliveryOptions.js"
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {
    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        let matchingItem = getProduct(productId);
        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);
        const dateString = calculateDeliveryDate(deliveryOption);

        cartSummaryHTML += `
            <div class="cart-item-container 
            js-cart-item-container
            js-cart-item-container-${matchingItem.id}">
                <div class="delivery-date">
                    Delivery date: ${dateString}
                </div>
                <div class="cart-item-details-grid">
                    <img class="product-image" src="${matchingItem.image}">
                    <div class="cart-item-details">
                        <div class="product-name">
                            ${matchingItem.name}
                        </div>
                        <div class="product-price">
                            $${matchingItem.getPrice()}
                        </div>
                        <div class="product-quantity  
                         js-product-quantity-${matchingItem.id}
                         product-quantity-${matchingItem.id}">
                            <span>
                                Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}</span>
                            </span>
                            <span class="update-quantity-link link-primary js-update-quantity" data-product-id="${matchingItem.id}">
                                Update
                            </span>
                            <input class="quantity-input js-quantity-input-${matchingItem.id}">
                            <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingItem.id}">
                                Save
                            </span>
                            <span class="delete-quantity-link 
                            js-delete-link-${matchingItem.id}
                            link-primary js-delete-link" data-product-id="${matchingItem.id}">
                                Delete
                            </span>
                        </div>
                    </div>
                    <div class="delivery-options">
                        <div class="delivery-options-title">
                            Choose a delivery option:
                        </div>
                        ${deliveryOptionHTML(matchingItem, cartItem)}
                    </div>
                </div>
            </div>
        `;
    });

    function deliveryOptionHTML(matchingItem, cartItem) {
        let html = '';
        deliveryOptions.forEach((deliveryOption) => {
            const dateString = calculateDeliveryDate(deliveryOption)
            const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${matchingItem.getPrice()}`;
            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `
                <div class="delivery-option">
                    <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input js-delivery-option-input" data-product-id="${matchingItem.id}" data-delivery-option-id="${deliveryOption.id}" name="delivery-option-${matchingItem.id}">
                    <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${priceString} - Shipping
                        </div>
                    </div>
                </div>
            `;
        });
        return html;
    }

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    document.querySelectorAll('.js-update-quantity').forEach((link) => {
        link.addEventListener('click', () => {
            const { productId } = link.dataset;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.add('is-editing-quantity');
            renderPaymentSummary();
            renderCheckoutHeader();
        });
    });

    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            renderOrderSummary();
            renderPaymentSummary();
            renderCheckoutHeader();
        });
    });

    document.querySelectorAll('.js-save-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.remove('is-editing-quantity');
            const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
            const newQuantity = Number(quantityInput.value);
            updateQuantity(productId, newQuantity);

            if (newQuantity < 1 || newQuantity >= 1000) {
                alert('Quantity must be at least 1 and less than 1000');
                return;
            }

            document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;

            renderPaymentSummary();
            renderCheckoutHeader();
        });
    });

    document.querySelectorAll('.js-delivery-option-input').forEach((input) => {
        input.addEventListener('change', (event) => {
            const productId = event.target.dataset.productId;
            const newDeliveryOptionId = event.target.dataset.deliveryOptionId;
            const cartItem = cart.find(item => item.productId == productId);
            cartItem.deliveryOptionId = newDeliveryOptionId;
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
}
