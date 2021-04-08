let axiosTag = document.createElement('script');
axiosTag.src = "https://unpkg.com/axios/dist/axios.min.js";
document.querySelector('body').appendChild(axiosTag);
// const { default: axios } = require("axios");

// const { default: axios } = require("axios");

// window.onload = () => {
//   // console.log("heyy");
//   setTimeout(() => {
//     for (let i = 0; i < products.length; i++) {
//       let result = findPriceRule(
//         products[i].originalProductQuantity,
//         products[i].productId
//       );
//       console.log(result);
//       let originalPrice = products[i].price;
//       let discountedPrice = Math.round(
//         (parseInt(originalPrice) *
//           parseInt(products[i].originalProductQuantity) -
//           parseInt(result)) /
//           parseInt(products[i].originalProductQuantity)
//       );
//       //Price Div
//       if (discountedPrice === parseInt(originalPrice)) {
//         products[i].priceDiv.insertAdjacentHTML("afterend", `<p>hello</p>`);
//       } else {
//         products[i].priceDiv.insertAdjacentHTML("afterend", `<p>hello</p>`);
//       }
//       //Total Price
//       let originalTotalPrice = products[i].totalPrice;
//       let discountedTotalPrice =
//         parseInt(originalPrice) *
//           parseInt(products[i].originalProductQuantity) -
//         parseInt(result);
//       console.log(discountedTotalPrice);
//       if (discountedTotalPrice === parseInt(originalTotalPrice)) {
//         products[i].totalPriceDiv.insertAdjacentHTML(
//           "afterend",
//           `<p>hello</p>`
//         );
//       } else {
//         products[i].totalPriceDiv.insertAdjacentHTML(
//           "afterend",
//           `<p>hello</p>`
//         );
//       }

//       // products[i].priceDiv;
//     }
//     let discount = 0;
//     changedQuantity = [];
//     for (let i = 0; i < arr.length; i++) {
//       // console.log(arr[i]);
//       var id = arr[i].id.split("_");
//       let productId = id[id.length - 1].split(":")[0];
//       changedQuantity.push({
//         value: arr[i].value,
//         productId: productId,
//         individualPrice: products[i].price,
//       });
//     }
//     // console.log(changedQuantity);
//     var finalSubTotal = 0;
//     changedQuantity.forEach((product) => {
//       //   console.log(product);
//       let result = findPriceRule(product.value, product.productId);
//       //   console.log(result);
//       discount += parseInt(result);
//       finalSubTotal +=
//         parseInt(product.individualPrice) * parseInt(product.value);
//     });
//     // console.log(discount);
//     // console.log(finalSubTotal);

//     var finalPrice = finalSubTotal - discount;
//     console.log(finalPrice);
//     if (finalPrice === finalSubTotal) {
//       subTotal_Location.insertAdjacentHTML("afterend", `<p>hello</p>`);
//     } else {
//       subTotal_Location.insertAdjacentHTML("afterend", `<p>hello</p>`);
//     }

//     // axios.post("/cart/update.js", {
//     //   updates: {
//     //     39484974792875: 4,
//     //   },
//     // }).then(result => {
//     //   console.log(result.data);
//     // }).catch(err => console.log(err.data));
//     const data = {updates: [3, 2, 1]};
//     fetch("/cart/update.js", {
//       method: "POST", // or 'PUT'
//       body: JSON.stringify(data),
//     })
//       // .then((response) => response.json())
//       .then((data) => {
//         console.log("Success:", data);
//       })
//       // .catch(error => error.json())
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   },5000)
  
  
// };

let Discounts = [
  {
    TierName: "Diwali",
    PriceRules: [
      {
        Quantity: "3",
        ApplicableDiscount: "20",
        DiscountType: "INR",
      },
      {
        Quantity: "4",
        ApplicableDiscount: "40",
        DiscountType: "INR",
      },
    ],
    ProductIds: ["39484974792875", "39462533071019", "39462528254123"],
  },
  {
    TierName: "SummerSale",
    PriceRules: [
      {
        Quantity: "5",
        ApplicableDiscount: "60",
        DiscountType: "INR",
      },
      {
        Quantity: "6",
        ApplicableDiscount: "80",
        DiscountType: "INR",
      },
    ],
    ProductIds: ["39484974792875"],
  },
  {
    TierName: "WinterSale",
    PriceRules: [
      {
        Quantity: "7",
        ApplicableDiscount: "90",
        DiscountType: "INR",
      },
    ],
    ProductIds: ["39462528254123"],
  },
  {
    TierName: "WinterSale",
    PriceRules: [
      {
        Quantity: "3",
        ApplicableDiscount: "50",
        DiscountType: "INR",
      },
    ],
    ProductIds: ["39484974792875"],
  },
];

var subTotal_Location = document.querySelector(".cart-subtotal__price");
var subTotal_Value = subTotal_Location.innerHTML;
var products_Individual_Price_Array = document.querySelectorAll(
  "dd[data-cart-item-regular-price]"
);
var products_Individual_TotalPrice_Array = document.querySelectorAll(
  "span[data-cart-item-regular-price]"
);

var inputArray = document.querySelectorAll(
  'form[action^="/cart"] [type="number"]'
);

var checkoutButton = document.querySelectorAll(
  'form[action^="/cart"] [type="submit"]'
);

var product_Title_array = document.querySelectorAll(
  'form[action^="/cart"] a[data-cart-item-title]'
);

var product_images = document.querySelectorAll(
  'form[action^="/cart"] img[data-cart-item-image]'
);


// checkoutButton[0].type = 'button';
let shopDomain = Shopify.shop.split('.')[0];
console.log(shopDomain);
checkoutButton[0].onclick = (e) => {
  e.preventDefault();
  axios
    .post("https://6d5407c251a6.ngrok.io/custom-checkout", {
      // or 'PUT'
      products,
      shopDomain,
    })
    .then((response) => {
      console.log("Success:", response);
      window.location = response.data.url;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  console.log("clicked");
};

console.log(checkoutButton);
// console.log(inputArray);

inputArray.forEach((each) => {
  each.addEventListener("input", inputEvent);
});

let changedQuantity = [];

function inputEvent(e) {
  // console.log(e);
  var Id = e.target.id.split("_");
  let changedProductId = Id[Id.length - 1].split(":")[0];
  for (let i = 0; i < products.length; i++) {
    if (products[i].productId === changedProductId) {
      products[i].originalProductQuantity = e.target.value;
      let result = findPriceRule(e.target.value, changedProductId);
      console.log(result);
      let originalPrice = products[i].price;
      let discountedPrice = Math.round(
        (parseInt(originalPrice) *
          parseInt(products[i].originalProductQuantity) -
          parseInt(result)) /
          parseInt(products[i].originalProductQuantity)
      );
      // if (discountedPrice === parseInt(originalPrice)) {
      //   let temp = products[i].priceDiv.innerHTML;
      //   let interval = window.setInterval(() => {
      //     let temp = products[i].priceDiv.innerHTML;
      //     console.log("Interval");
      //     if (products[i].priceDiv.innerHTML != temp) {
      //       products[i].priceDiv.innerHTML = `<p>SuperAssistant</p>`;
      //       clearInterval(interval);
      //     }
      //   }, 1000);
      //   // products[i].priceDiv.insertAdjacentHTML("afterend", `<p>hello</p>`);
      // } else {
      //   let temp = products[i].priceDiv.innerHTML;
      //   let interval = window.setInterval(() => {
      //     let temp = products[i].priceDiv.innerHTML;
      //     console.log("Interval");
      //     if (products[i].priceDiv.innerHTML != temp) {
      //       products[i].priceDiv.innerHTML = `<p>SuperAssistant</p>`;
      //       clearInterval(interval);
      //     }
      //   }, 3000);
      //   // products[i].priceDiv.insertAdjacentHTML("afterend", `<p>hello</p>`);
      // }
      //Total Price
      // let originalTotalPrice = products[i].totalPrice;
      let undiscountedTotal =
        parseInt(originalPrice) * parseInt(e.target.value);
      let discountedTotalPrice =
        parseInt(originalPrice) *
          parseInt(e.target.value) -
        parseInt(result);
      console.log(discountedTotalPrice);

      if (discountedTotalPrice === undiscountedTotal) {
            

        // let temp = products[i].totalPriceDiv.innerHTML;
        // let interval = window.setInterval(() => {
        //   alert("Interval");
        //   if (products[i].totalPriceDiv.innerHTML != temp) {
        //     products[i].totalPriceDiv.innerHTML= `<p>SuperAssistant</p>`;
        //     clearInterval(interval);
        //   }
        // },1000)
        // products[i].totalPriceDiv.insertAdjacentHTML(
        //   "afterend",
        //   `<p>hello</p>`
        // );
      } else {
        let temp = products[i].totalPriceDiv.innerHTML;

        // products[i].totalPriceDiv.insertAdjacentHTML(
        //   "afterend",
        //   `<p>hello</p>`
        // );
      }

      // products[i].priceDiv;
    }
  }

  // console.log(changedProductId);
  // let discount = 0;
  // changedQuantity = [];
  // for (let i = 0; i < arr.length; i++) {
  //   // console.log(arr[i]);
  //   var id = arr[i].id.split("_");
  //   let productId = id[id.length - 1].split(":")[0];
  //   if (productId === changedProductId) {
  //     changedQuantity.push({
  //       value: e.target.value,
  //       productId: changedProductId,
  //       individualPrice: products[i].price,
  //     });
  //   } else {
  //     changedQuantity.push({
  //       value: arr[i].value,
  //       productId: productId,
  //       individualPrice: products[i].price,
  //     });
  //   }
  // }
  // console.log(changedQuantity);
  // var finalSubTotal = 0;
  // changedQuantity.forEach((product) => {
  //   //   console.log(product);
  //   let result = findPriceRule(product.value, product.productId);
  //   //   console.log(result);

  //   discount += parseInt(result);
  //   finalSubTotal +=
  //     parseInt(product.individualPrice) * parseInt(product.value);

  // });
  // console.log(discount);
  // console.log(finalSubTotal);

  // var finalPrice = finalSubTotal - discount;
  // // console.log(finalPrice);
  // if (finalPrice === finalSubTotal) {
  //   subTotal_Location.insertAdjacentHTML("afterend", `<p>hello</p>`);
  // } else {
  //   subTotal_Location.insertAdjacentHTML("afterend", `<p>hello</p>`);
  // }
  
  // if (discountedTotalPrice === parseInt(originalTotalPrice)) {
  //   products[
  //     i
  //   ].totalPriceDiv.innerHTML = `<ins style="text-decoration:none">Rs. ${String(
  //     discountedTotalPrice
  //   )}.00</ins>`;
  // } else {
  //   products[
  //     i
  //   ].totalPriceDiv.innerHTML = `<del>Rs. ${originalTotalPrice}</del> <ins style="text-decoration:none">Rs. ${String(
  //     discountedTotalPrice
  //   )}.00</ins>`;
  // }
  console.log(products);
}

function findPriceRule(quantity, productId) {
  let applicableDiscount = "0";
  Discounts.forEach((discount) => {
    if (discount.ProductIds.indexOf(productId) !== -1) {
      // console.log(discount);
      for (let i = 0; i < discount.PriceRules.length; i++) {
        if (discount.PriceRules[i].Quantity === quantity) {
          // console.log(discount.PriceRules[i]);
          applicableDiscount = discount.PriceRules[i].ApplicableDiscount;
        }
      }
    }
  });
  return applicableDiscount;
}

let arr = Array.prototype.slice.call(inputArray, 0);
for (let i = -1; i < arr.length - 1; i++) {
  arr.splice(i + 1, 1);
}

let products = [];
for (let i = 0; i < arr.length; i++) {
  var id = arr[i].id.split("_");
  let productId = id[id.length - 1].split(":")[0];
  let obj = {
    productName:product_Title_array[i].innerText,
    productId: productId,
    productImage:product_images[i].src,
    originalProductQuantity: arr[i].value,
    price: products_Individual_Price_Array[i].innerText.split(" ")[1],
    priceDiv: products_Individual_Price_Array[i],
    totalPrice: products_Individual_TotalPrice_Array[i].innerText.split(" ")[1],
    totalPriceDiv: products_Individual_TotalPrice_Array[i],
    inputDiv: arr[i],
  };
  products.push(obj);
}

console.log(products);

console.log(findPriceRule("4", "39462528254123"));
