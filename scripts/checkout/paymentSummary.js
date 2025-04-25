import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";



export function renderPaymentSummary(){
  
  let productPriceCents = 0;
  let shippingPriceCents= 0;
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    const matchingItem = getProduct(cartItem.productId);

    productPriceCents += matchingItem.priceCents * cartItem.quantity;
    
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    shippingPriceCents += deliveryOption.priceCents;

    cartQuantity += cartItem.quantity;

  }); 
  
  const totalBeforeTax = productPriceCents + shippingPriceCents;

  const afterTax = totalBeforeTax * 0.1

  const totalCents = totalBeforeTax + afterTax

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTax)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(afterTax)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button js-place-order button-primary">
            Place your order
          </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order')
   .addEventListener('click', async () => {

    try{
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          cart: cart
        })
       });
       const order = await response.json();
       addOrder(order);
    } catch(error){
      console.log('Unexpected error. Try again later.');
    }

    window.location.href = 'orders.html';
});
}
