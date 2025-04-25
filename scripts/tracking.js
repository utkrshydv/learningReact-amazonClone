import { products } from "../data/products.js"; 
import { orders } from "../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

const url = new URL(window.location.href);

function getProductId(){
  let foundProduct;
  const productIdFromURL = url.searchParams.get('productId');
 products.forEach((product) => {
  if(product.id === productIdFromURL){
    foundProduct = product;
  }
 })
  return foundProduct;
};

const trackedProduct = getProductId();

const mainData= getOrderId();
console.log(mainData);

function getOrderId(){
  let foundOrder;
  let productDetails;
  const orderIdFromURL = url.searchParams.get('orderId');
  orders.forEach((order) => {
    if(order.id === orderIdFromURL){
      foundOrder = order;
      productDetails= productsListHTML(order);
    };
  })
  return [foundOrder, productDetails];
}

function deliveryDate(dateFromOrder){
  const date = dayjs(dateFromOrder).format('dddd, MMMM D');
  return date;
}

const date = deliveryDate(mainData[1].estimatedDeliveryTime)




function productsListHTML(order) {
  let finalProduct;
  order.products.forEach((productDetails) => {
   if(trackedProduct.id === productDetails.productId){
    finalProduct = productDetails;
    console.log(finalProduct);
   }
  })
  return finalProduct;
}



async function renderTrackingHTML(){
  let trackingHTML = `
   <div class="order-tracking">
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>
        </div>
  <div class="delivery-date">
          Arriving on ${date}
        </div>

        <div class="product-info">
          ${trackedProduct.name}
        </div>

        <div class="product-info">
          Quantity: ${mainData[1].quantity}
        </div>

        <img class="product-image" src=${trackedProduct.image}>

        <div class="progress-labels-container">
          <div class="progress-label">
            Preparing
          </div>
          <div class="progress-label current-status">
            Shipped
          </div>
          <div class="progress-label">
            Delivered
          </div>
        </div>
         <div class="progress-bar-container">
          <div class="progress-bar"></div>
`

document.querySelector('.main')
 .innerHTML = trackingHTML;
}

renderTrackingHTML();