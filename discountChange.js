// V1.0
//last-updated: 11-06-2021
let user = [];
let discounts = [];
let cartData = [];
let shopDomain = Shopify.shop.split(".")[0];
let shopifyThemeId = Shopify.theme.theme_store_id;
let shopifyCurrency = Shopify.currency.active;
// let shopDomain = "super-assistant-demo2";
// let hostedUrl = "https://tiered-discounts-backend.superassistant.io"; //backend url
let frontendUrl = "https://discounts.superassistant.io"; //frontend url
// let frontendUrl = "http://localhost:3000"; //frontend url
let hostedUrl = "http://localhost:5000";

function startTieredPricing() {
  // const { default: axios } = require("axios");
      console.log("inside start function");


  // alert('heyy')
  function initCssTieredPricing() {
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute(
      "href",
      "https://sacdnfiles.s3.ap-south-1.amazonaws.com/dicount+app/discount-rendering.css"
    );
    document.head.appendChild(link);
  }
  initCssTieredPricing();

  let axiosTag_TieredPricing = document.createElement("script");
  axiosTag_TieredPricing.src = "https://unpkg.com/axios/dist/axios.min.js";
  document.querySelector("body").appendChild(axiosTag_TieredPricing);

  let currentPage_TieredPricing = window.location.href.split("/");
  console.log(currentPage_TieredPricing);

  // let productName = meta.product.variants[0].name
  //   .toLowerCase()
  //   .split(" ")
  //   .join("-");

  console.log(user.hasAjaxCart);

  for (let i = 0; i < currentPage_TieredPricing.length; i++) {
    if (currentPage_TieredPricing[i] === "products") {
      let productsPage = currentPage_TieredPricing.join("/").split("?");
      if (
        productsPage[productsPage.length - 1].search("widgetSelector") !== -1
      ) {
        console.log("selectWidgetLocation");
        selectWidgetLocation();
      } else if (
        productsPage[productsPage.length - 1].search(
          "ajaxIndividualSelector"
        ) !== -1
      ) {
        console.log("ajaxIndividualSelector");
        ajaxIndividualSelector();
      } else if (
        productsPage[productsPage.length - 1].search("ajaxTotalSelector") !== -1
      ) {
        console.log("ajaxTotalSelector");
        ajaxTotalSelector();
      } else if (
        productsPage[productsPage.length - 1].search("ajaxSubtotalSelector") !==
        -1
      ) {
        console.log("ajaxSubtotalSelector");
        ajaxSubtotalSelector();
      } else if (
        productsPage[productsPage.length - 1].search("ajaxCheckoutSelector") !==
        -1
      ) {
        console.log("ajaxCheckoutSelector");
        ajaxCheckoutSelector();
      } else {
        console.log("renderWidget");
        renderWidget();
        if (user.hasAjaxCart) {
          renderAjaxCart("products");
        }
      }
    } else if (
      currentPage_TieredPricing[i] === "cart" ||
      currentPage_TieredPricing[i] === "cart?subtotalSelector" ||
      currentPage_TieredPricing[i] === "cart?totalSelector" ||
      currentPage_TieredPricing[i] === "cart?individualPriceSelector"
    ) {
      let cartPage = currentPage_TieredPricing.join("/").split("?");
      if (cartPage[cartPage.length - 1] === `subtotalSelector`) {
        console.log("subtotalSelector");

        subtotalSelector();
      } else if (cartPage[cartPage.length - 1] === `totalSelector`) {
        console.log("totalSelector");
        totalSelector();
      } else if (cartPage[cartPage.length - 1] === `individualPriceSelector`) {
        console.log("individualPriceSelector");

        individualPriceSelector();
      } else {
        console.log("checkOut");
        // discountRendering();
        checkOut();
      }
    } else if (currentPage_TieredPricing[i] === "collections") {
      console.log(user.hasAjaxCart);
      if (user.hasAjaxCart) {
        renderAjaxCart("collections");
      }
    }
  }
  //Store Landing Page
  if (currentPage_TieredPricing[currentPage_TieredPricing.length - 1] === "") {
    if (user.hasAjaxCart) {
      renderAjaxCart("homepage");
    }
  }

  // subtotalSelector();
  // totalSelector();
  // individualPriceSelector();
  // selectWidgetLocation();
  // renderWidget();
  // checkOut();
  // discountRendering();
  // ajaxIndividualSelector();
  // ajaxTotalSelector();
  // ajaxSubtotalSelector();
  // ajaxCheckoutSelector();
  // renderAjaxCart();

  function selectWidgetLocation() {
    // let result = decodeURI("%5Bobject%20HTMLDivElement%5D");
    // console.log(result);

    // alert("Press shift and then select the div by clicking");

    let positionData;
    let parentDiv;
    function position(pos, node) {
      positionData = pos;
      // console.log(positionData);
      console.log(node);
      node.classList.remove("clicked");
      if (positionData === "Above") {
        node.insertAdjacentHTML(
          "beforebegin",
          '<div style="display:block;border: 1px solid grey;padding: 1em;background-color: #dff0d8;width: fit-content;" id="superAssistant147963851"><p>Widget will be displayed here</p></div>'
        );
      } else if (positionData === "Below") {
        node.insertAdjacentHTML(
          "afterend",
          '<div style="display:block;border: 1px solid grey;margin:0.5em 0;padding: 1em;background-color: #dff0d8;width: fit-content;"id="superAssistant147963851"><p>Widget will be displayed here</p></div>'
        );
      }
      document.querySelector("#ulList").style.display = "none";

      console.log(node.classList[0]);
      console.log(node.tagName.toLowerCase());

      modalDiv.style.display = "block";
      saveButton.disabled = false;
      saveButton.style.background = "#9c6ade";

      saveButton.addEventListener("click", () => {
        let className = [];
        let attributes = [];
        console.log(node.attributes);
        if (node.attributes.length > 0) {
          for (let j = 0; j < node.attributes.length; j++) {
            if (node.attributes[j].name === "class") {
              className = node.attributes[j].value.split(" ");
            } else {
              attributes.push(node.attributes[j].name);
            }
          }
        }
        console.log(className);
        console.log(positionData);

        axios
          .post(`${hostedUrl}/widgetSave`, {
            className: className,
            tagName: node.tagName.toLowerCase(),
            location: positionData,
            shopDomain: shopDomain,
            attributes: attributes,
          })
          .then((result) => {
            console.log(result);
            window.location = frontendUrl + "/tieredPricing/settings";
          })
          .catch((err) => console.log(err));
      });
      clearButton.addEventListener("click", () => {
        saveButton.style.background = "#bac0e6";
        saveButton.disabled = true;
        clicked = false;
        let insertedWidget = document.querySelector("#superAssistant147963851");
        if (insertedWidget) {
          insertedWidget.parentNode.removeChild(insertedWidget);
        }
      });
    }
    var clicked = false;

    let modalDiv = document.createElement("div");
    modalDiv.style.width = "fit-content";
    modalDiv.style.padding = "1em";
    modalDiv.style.position = "absolute";
    modalDiv.style.left = "0";
    modalDiv.style.right = "0";
    modalDiv.style.marginLeft = "auto";
    modalDiv.style.marginRight = "auto";
    modalDiv.style.top = "3%";
    modalDiv.style.zIndex = "99999";
    modalDiv.style.background = "#f4f6f8";
    modalDiv.style.border = "1px solid #bec0c2";
    modalDiv.style.borderRadius = "4px";
    let p = document.createElement("p");
    p.innerText =
      "Select location for Tiered pricing while holding the Shift key.";
    // let modalImage = document.createElement("img");
    // modalImage.src =
    //   "https://cdn.jsdelivr.net/gh/varuns1007/Hosted-Links/subtotalImg.png";
    // modalImage.style.width = "29em";
    let buttonsDiv = document.createElement("div");
    buttonsDiv.style.textAlign = "right";
    let saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.style.marginLeft = "0.7em";
    saveButton.style.background = "#bac0e6";

    saveButton.style.color = "white";
    saveButton.style.border = "1px solid grey";
    saveButton.style.borderRadius = "4px";
    saveButton.disabled = true;

    let clearButton = document.createElement("button");
    clearButton.innerText = "Clear";
    clearButton.style.border = "1px solid grey";
    clearButton.style.borderRadius = "4px";

    buttonsDiv.appendChild(clearButton);
    buttonsDiv.appendChild(saveButton);
    modalDiv.appendChild(p);
    // modalDiv.appendChild(modalImage);
    modalDiv.appendChild(buttonsDiv);

    document.querySelector("body").appendChild(modalDiv);

    function updateShift(event) {
      if (event.shiftKey && !clicked) {
        document.body.classList.add("shift-pressed");
        modalDiv.style.display = "none";
      } else {
        document.body.classList.remove("shift-pressed");
      }
    }
    function shiftClick(event) {
      if (event.shiftKey) {
        /* console.log("hi") */

        // if (window.confirm("Confirm Selection")) {
        clicked = true;
        event.target.classList.add("clicked");
        parentDiv = event.target;

        event.target.insertAdjacentHTML(
          "afterend",
          //
          '<div class="positionPopup" id="ulList"><ul><li id="Above"><a href="#">Above Element</a> </li><li id="Below"><a href="#">Below Element</a> </li></ul></div>'
        );
        document
          .querySelector("#Above")
          .addEventListener("click", () => position("Above", parentDiv));
        document
          .querySelector("#Below")
          .addEventListener("click", () => position("Below", parentDiv));

        document.body.className = "";
        // } else {
        //   clicked = false;
        // }
      }
    }
    var button = document.querySelector("button");
    button.addEventListener("mousemove", updateShift);
    window.addEventListener("keydown", updateShift);
    window.addEventListener("keyup", updateShift);
    window.addEventListener("click", shiftClick);
  }

  function checkOut() {
    async function getCartData() {
      let data = await fetch("/cart.js");
      data = await data.json();
      return data;
      //   .then((response) => response.json())
      //   .then((data) => {
      //     //   console.log(data);
      //       return data;
      //   });
    }
    let cart = getCartData();
    cart.then((response) => {
      let cartData = response;
      console.log(cartData);

      var checkoutButton;
      var inputArray;
      var products_Individual_Price_Array = [];
      var products_Individual_TotalPrice_Array = [];

      let products = [];

      // let shopifyThemeId = Shopify.theme.theme_store_id;
      // let shopifyCurrency = Shopify.currency.active;
      // let shopDomain = "super-assistant-demo2";
      // let hostedUrl = "https://app1.superassistant.io"; //backend url
      // let frontendUrl = "https://app.superassistant.io"; //frontend url

      // let user = {
      //   widgetLocation: {
      //     div: {
      //       className: ["price", "price--sold-out"],
      //       attribute: ["data-price"],
      //       tagName: "dl",
      //     },
      //     location: "Below",
      //   },
      //   individualProductLocation: {
      //     className: [],
      //     attribute: ["data-cart-item-regular-price"],
      //     tagName: "dd",
      //   },
      //   productTotalLocation: {
      //     className: [],
      //     attribute: ["data-cart-item-regular-price"],
      //     tagName: "span",
      //   },
      //   cartSubTotalLocation: {
      //     className: ["cart-subtotal__price"],
      //     attribute: ["data-cart-subtotal"],
      //     tagName: "span",
      //   },
      //   Customtemplate: {
      //     location: {
      //       individualPrice: true,
      //       totalPrice: true,
      //       subtotalPrice: true,
      //     },
      //     showCustomTemplate: true,
      //     template: "save :diff",
      //   },
      //   tierDescription: {
      //     templateType: "BuyQforT",
      //     customText: "",
      //   },
      //   draftOrdersCreated: {
      //     buyXgetY: [],
      //     priceRule: [],
      //   },
      //   chargeId: "22353379526",
      //   paymentDone: true,
      //   isThemeUpdated: true,
      //   hasAjaxCart: false,
      //   discountStyle: [
      //     {
      //       borderWidth: 4,
      //       borderStyle: "solid",
      //       borderColor: "hsla(120, 100%, 100%,1)",
      //       backGroundColor: "hsla(169, 100%, 21%,1)",
      //       textSize: 10,
      //       textColor: "hsla(120, 100%, 100%,1)",
      //       tierMessage: "This is your Message",
      //       PriceborderWidth: 2,
      //       PriceborderStyle: "solid",
      //       PriceborderRadius: 6,
      //       PriceborderColor: "hsla(169, 100%, 21%,1)",
      //       PricetextSize: 10,
      //       PricetextColor: "hsla(169, 100%, 21%,1)",
      //       PricebackGroundColor: "hsla(120, 100%, 100%,1)",
      //     },
      //   ],
      //   generated_orders: [],
      //   _id: "608ab429c45de10218f914d9",
      //   name: "Super Assistant Demo2",
      //   email: "admin@superassistant.io",
      //   access_token: "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",
      //   myShopifyDomain: "super-assistant-demo2.myshopify.com",
      //   discount: [
      //     {
      //       productIds: [
      //         39414729408710,
      //         39571105480902,
      //         39594410377414,
      //         39414727180486,
      //         39414728392902,
      //         39397258592454,
      //         39397240111302,
      //       ],
      //       _id: "608d6b7f074759bab9d2e8eb",
      //       id: 0.20070289208496872,
      //       title: "My new product and new Sale",
      //       priceRule: [
      //         {
      //           _id: "608d6b7f074759f6ebd2e8ec",
      //           discount: 100,
      //           quantity: 2,
      //           discountType: "INR",
      //           tagName: "",
      //         },
      //         {
      //           _id: "608d6b7f0747594392d2e8ed",
      //           discount: 20,
      //           quantity: 3,
      //           discountType: "%",
      //           tagName: "",
      //         },
      //       ],
      //       targetSelection: "all",
      //       enable: true,
      //       buyXgetY: [],
      //     },
      //     {
      //       productIds: [39414727180486],
      //       _id: "608d71aa0747590fa0d2e8fa",
      //       id: 0.4526197744080629,
      //       title: "Upsell Funnel #4",
      //       buyXgetY: [
      //         {
      //           yProduct: [
      //             {
      //               id: 39594410377414,
      //               title: "Copy of Copy of Copy of new",
      //               price: "2.00",
      //               quantity: "1",
      //             },
      //           ],
      //           _id: "608d71aa0747592c12d2e8fb",
      //           quantity: 1,
      //           yDiscountValue: "100",
      //           tagName: "Get more for less!",
      //         },
      //       ],
      //       targetSelection: "entitled",
      //       enable: true,
      //       priceRule: [],
      //     },
      //     {
      //       productIds: [39414728392902],
      //       _id: "608e5116074759e995d2e900",
      //       id: 0.37103206285742507,
      //       title: "% buy x get y",
      //       buyXgetY: [
      //         {
      //           yProduct: [
      //             {
      //               id: 39414727180486,
      //               title: "Copy of new",
      //               price: "9999.00",
      //               quantity: "1",
      //             },
      //           ],
      //           _id: "608e5116074759e4a6d2e901",
      //           quantity: 1,
      //           yDiscountValue: "20",
      //           tagName: "Discount",
      //         },
      //       ],
      //       targetSelection: "entitled",
      //       enable: true,
      //       priceRule: [],
      //     },
      //   ],
      //   createdAt: "2021-04-29T13:27:05.236Z",
      //   updatedAt: "2021-05-03T03:37:42.601Z",
      //   __v: 0,
      //   widgetNumber: 2,
      // };

      // let discounts = user.discount;

      //buyXgetY popup div

      // fetch(`${hostedUrl}/userData`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     username: shopDomain,
      //   }), // body data type must match "Content-Type" header
      // })
      //   .then((response) => response.json())
      //   .then((user) => {
      //     console.log(user.data[0].discount);
      //     discounts.push(user.data[0].discount);
      //   });
      // console.log(discounts);
      // let Discounts = [
      //   {
      //     _id: "60796cccba0b1d32d8101d47",
      //     id: 0.7252650572965804,

      //     title: "Hoodie Sale",
      //     priceRule: [
      //       {
      //         discount: 30,
      //         quantity: 2,
      //         discountType: "INR",
      //         tagName: "HOODIESALE30OFF",
      //       },
      //       {
      //         discount: 50,
      //         quantity: 3,
      //         discountType: "INR",
      //         tagName: "HOODIESALE50OFF",
      //       },
      //     ],
      //     buyXgetY: [],
      //     targetSelection: "entitled",
      //     productIds: [39484974792875],
      //     enable: true,
      //   },
      // ];

      // console.log(discounts);

      function findPriceRule(quantity, productId) {
        // let applicableDiscount = "0";
        // let discountType = "";
        let obj = {
          applicableDiscount: 0,
          discountType: "",
        };
        discounts.forEach((discount) => {
          if (discount.enable) {
            if (discount.productIds.indexOf(productId) !== -1) {
              // console.log(discount);
              for (let i = 0; i < discount.priceRule.length; i++) {
                if (discount.priceRule[i].quantity === quantity) {
                  // console.log(discount.PriceRules[i]);
                  obj.applicableDiscount = discount.priceRule[i].discount;
                  obj.discountType = discount.priceRule[i].discountType;
                }
              }
            }
          }
        });
        return obj;
      }

      function findBuyXgetY(quantity, productId) {
        let obj = {
          applicableDiscount: 0,
          XproductId: 0,
          XproductName: "",
          YproductId: [],
          YproductName: [],
        };
        discounts.forEach((discount) => {
          if (discount.enable) {
            if (discount.productIds.indexOf(productId) !== -1) {
              // console.log(discount);
              for (let i = 0; i < discount.buyXgetY.length; i++) {
                if (discount.buyXgetY[i].quantity === quantity) {
                  // console.log(discount.PriceRules[i]);
                  obj.applicableDiscount = discount.buyXgetY[i].yDiscountValue;
                  obj.XproductId = productId;
                  discount.buyXgetY[i].yProduct.forEach((each) => {
                    obj.YproductId.push(each.id);
                    obj.YproductName.push(each.title);
                  });
                  cartData.items.forEach((item) => {
                    if (item.variant_id === productId) {
                      obj.XproductName = item.title;
                      return;
                    }
                  });
                }
              }
            }
          }
        });
        return obj;
      }

      console.log(findBuyXgetY(1, 39414727180486));
      console.log(findBuyXgetY(1, 39414728392902));

      console.log(findPriceRule(2, 39414728392902));

      console.log(findPriceRule(3, 39414727180486));

      console.log(user);

      function attributesCombine(arr) {
        let attribute = [];
        for (let i = 0; i < arr.length; i++) {
          attribute.push(`[${arr[i]}]`);
        }
        return attribute.join("");
      }
      function classesCombine(arr) {
        let classes = [];
        for (let i = 0; i < arr.length; i++) {
          classes.push(`.${arr[i]}`);
        }
        return classes.join("");
      }

      var subTotal_Location;
      if (user.cartSubTotalLocation.tagName !== "") {
        if (
          user.cartSubTotalLocation.attribute.length !== 0 &&
          user.cartSubTotalLocation.className.length !== 0
        ) {
          let attribute = attributesCombine(
            user.cartSubTotalLocation.attribute
          );
          let classes = classesCombine(user.cartSubTotalLocation.className);

          subTotal_Location = document.querySelector(
            `${user.cartSubTotalLocation.tagName}${attribute}${classes}`
          );
        } else if (user.cartSubTotalLocation.attribute.length === 0) {
          let classes = classesCombine(user.cartSubTotalLocation.className);
          subTotal_Location = document.querySelector(
            `${user.cartSubTotalLocation.tagName}${classes}`
          );
        } else if (user.cartSubTotalLocation.className.length === 0) {
          let attribute = attributesCombine(
            user.cartSubTotalLocation.attribute
          );
          subTotal_Location = document.querySelector(
            `${user.cartSubTotalLocation.tagName}${attribute}`
          );
        }
      }
      console.log(subTotal_Location);
      // if (user.cartSubTotalLocation.tagName !== "") {
      //   if (user.cartSubTotalLocation.attribute.length === 0) {
      // subTotal_Location = document.querySelector(`${user.cartSubTotalLocation.tagName}.${user.cartSubTotalLocation.className[0]}`);

      //   } else if (user.cartSubTotalLocation.className.length === 0) {
      // subTotal_Location = document.querySelector(`${user.cartSubTotalLocation.tagName}[${user.cartSubTotalLocation.attribute[0]}]`);

      //   } else {
      //     subTotal_Location = document.querySelector(`${user.cartSubTotalLocation.tagName}[${user.cartSubTotalLocation.attribute[0]}].${user.cartSubTotalLocation.className[0]}`);

      //   }
      // }
      // var subTotal_Location = document.querySelector(".cart-subtotal__price");

      const config = { attributes: true, childList: true, subtree: true };

      console.log("reached");
      //Listening to post req changes

      const callback = function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        // setTimeout(() => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            console.log("A child node has been added or removed.");
            setEventListeners("dd");
            location.reload();
          } else if (mutation.type === "attributes") {
            console.log(
              "The " + mutation.attributeName + " attribute was modified."
            );
            setEventListeners("dd");
            location.reload();
          }
        }
        // }, 200);
      };

      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(callback);

      checkoutButton = document.querySelectorAll(
        'form[action^="/cart"] [type="submit"]'
      );

      if (shopifyThemeId === 796) {
        checkoutButton = checkoutButton[0];
      } else if (shopifyThemeId === 766) {
        checkoutButton = checkoutButton[0];
      } else {
        checkoutButton = checkoutButton[1];
      }

      inputArray = document.querySelectorAll(
        'form[action^="/cart"] [type="number"]'
      );

      if (inputArray.length === 0)
        inputArray = document.querySelectorAll(
          'form[action^="/cart"] [type="text"]'
        );
      // console.log(inputArray);
      //  = document.querySelectorAll(
      //   `${}`
      // );

      if (user.individualProductLocation.tagName !== "") {
        if (
          user.individualProductLocation.attribute.length !== 0 &&
          user.individualProductLocation.className.length !== 0
        ) {
          let attribute = attributesCombine(
            user.individualProductLocation.attribute
          );
          let classes = classesCombine(
            user.individualProductLocation.className
          );

          products_Individual_Price_Array = document.querySelectorAll(
            `${user.individualProductLocation.tagName}${attribute}${classes}`
          );
        } else if (user.individualProductLocation.attribute.length === 0) {
          let classes = classesCombine(
            user.individualProductLocation.className
          );
          products_Individual_Price_Array = document.querySelectorAll(
            `${user.individualProductLocation.tagName}${classes}`
          );
        } else if (user.individualProductLocation.className.length === 0) {
          let attribute = attributesCombine(
            user.individualProductLocation.attribute
          );
          products_Individual_Price_Array = document.querySelectorAll(
            `${user.individualProductLocation.tagName}${attribute}`
          );
        }
      }

      // products_Individual_Price_Array = document.querySelectorAll(
      //   "dd[data-cart-item-regular-price]"
      // );

      if (user.productTotalLocation.tagName !== "") {
        if (
          user.productTotalLocation.attribute.length !== 0 &&
          user.productTotalLocation.className.length !== 0
        ) {
          let attribute = attributesCombine(
            user.productTotalLocation.attribute
          );
          let classes = classesCombine(user.productTotalLocation.className);

          products_Individual_TotalPrice_Array = document.querySelectorAll(
            `${user.productTotalLocation.tagName}${attribute}${classes}`
          );
        } else if (user.productTotalLocation.attribute.length === 0) {
          let classes = classesCombine(user.productTotalLocation.className);
          products_Individual_TotalPrice_Array = document.querySelectorAll(
            `${user.productTotalLocation.tagName}${classes}`
          );
        } else if (user.productTotalLocation.className.length === 0) {
          let attribute = attributesCombine(
            user.productTotalLocation.attribute
          );
          products_Individual_TotalPrice_Array = document.querySelectorAll(
            `${user.productTotalLocation.tagName}${attribute}`
          );
        }
      }

      if (products_Individual_Price_Array.length > cartData.items.length) {
        console.log(products_Individual_Price_Array);
        let tempArr = Array.prototype.slice.call(
          products_Individual_Price_Array,
          0
        );
        if (tempArr.length % 2 !== 0) tempArr.pop();
        console.log(tempArr);
        products_Individual_Price_Array = [];
        products_Individual_TotalPrice_Array = [];
        for (let i = 0; i < tempArr.length; i++) {
          if (i % 2 === 0) {
            products_Individual_Price_Array.push(tempArr[i]);
          } else {
            products_Individual_TotalPrice_Array.push(tempArr[i]);
          }
        }
      }

      console.log("individual" + products_Individual_Price_Array);
      console.log("total" + products_Individual_TotalPrice_Array);
      // products_Individual_TotalPrice_Array = document.querySelectorAll(
      //   `span[data-cart-item-regular-price]`
      // );

      // console.log(String(checkoutButton));

      //  product_Title_array = document.querySelectorAll(
      //    'form[action^="/cart"] a[data-cart-item-title]'
      //  );

      //  product_images = document.querySelectorAll(
      //    'form[action^="/cart"] img[data-cart-item-image]'
      //  );
      //

      //Product Listing
      let arr = Array.prototype.slice.call(inputArray, 0);
      console.log(shopifyThemeId);
      if (shopifyThemeId === 796) {
        for (let i = -1; i < arr.length - 1; i++) {
          arr.splice(i + 1, 1);
        }
      }

      console.log(arr);

      for (let i = 0; i < arr.length; i++) {
        var id = arr[i].id.split("_");
        let productId = id[id.length - 1].split(":")[0];
        let productTitle = cartData.items[i].title;
        let productImage = cartData.items[i].image;
        let priceDiv = "not-found";
        if (products_Individual_Price_Array.length !== 0) {
          priceDiv = products_Individual_Price_Array[i];
        }

        let totalDiv = "not-found";
        if (products_Individual_TotalPrice_Array.length !== 0) {
          totalDiv = products_Individual_TotalPrice_Array[i];
        }

        // productPrice = String(
        //   parseInt(
        //     products_Individual_TotalPrice_Array[i].innerText
        //       .split(" ")[1]
        //       .replace(/,/g, "")
        //   ) / parseInt(arr[i].value.replace(/,/g, ""))
        // );

        let obj = {
          productName: productTitle,
          productId: productId,
          productImage: productImage,
          originalProductQuantity: String(cartData.items[i].quantity),
          // price: products_Individual_Price_Array[i].innerText.split(" ")[1],
          price: String(cartData.items[i].price / 100),
          priceDiv: priceDiv,
          totalPrice: String(
            (cartData.items[i].price / 100) * cartData.items[i].quantity
          ),
          totalPriceDiv: totalDiv,
          inputDiv: arr[i],
        };
        products.push(obj);
      }

      function createPtag(discountValue, YproductName) {
        let p = `You are eligible for a discount of ${discountValue}% off on ${YproductName}`;
        return p;
      }

      function setEventListeners(totalPriceTag) {
        checkoutButton = document.querySelectorAll(
          'form[action^="/cart"] [type="submit"]'
        );

        if (shopifyThemeId === 796) {
          checkoutButton = checkoutButton[0];
        } else if (shopifyThemeId === 766) {
          checkoutButton = checkoutButton[0];
        } else {
          checkoutButton = checkoutButton[1];
        }

        // console.log(checkoutButton);

        inputArray = document.querySelectorAll(
          'form[action^="/cart"] [type="number"]'
        );

        if (inputArray.length === 0)
          inputArray = document.querySelectorAll(
            'form[action^="/cart"] [type="text"]'
          );

        // products_Individual_Price_Array = document.querySelectorAll(
        //   "dd[data-cart-item-regular-price]"
        // );
        if (user.individualProductLocation.tagName !== "") {
          if (
            user.individualProductLocation.attribute.length !== 0 &&
            user.individualProductLocation.className.length !== 0
          ) {
            let attribute = attributesCombine(
              user.individualProductLocation.attribute
            );
            let classes = classesCombine(
              user.individualProductLocation.className
            );

            products_Individual_Price_Array = document.querySelectorAll(
              `${user.individualProductLocation.tagName}${attribute}${classes}`
            );
          } else if (user.individualProductLocation.attribute.length === 0) {
            let classes = classesCombine(
              user.individualProductLocation.className
            );
            products_Individual_Price_Array = document.querySelectorAll(
              `${user.individualProductLocation.tagName}${classes}`
            );
          } else if (user.individualProductLocation.className.length === 0) {
            let attribute = attributesCombine(
              user.individualProductLocation.attribute
            );
            products_Individual_Price_Array = document.querySelectorAll(
              `${user.individualProductLocation.tagName}${attribute}`
            );
          }
        }

        // products_Individual_TotalPrice_Array = document.querySelectorAll(
        //   `${totalPriceTag}[data-cart-item-regular-price]`
        // );
        if (user.productTotalLocation.tagName !== "") {
          if (
            user.productTotalLocation.attribute.length !== 0 &&
            user.productTotalLocation.className.length !== 0
          ) {
            let attribute = attributesCombine(
              user.productTotalLocation.attribute
            );
            let classes = classesCombine(user.productTotalLocation.className);

            products_Individual_TotalPrice_Array = document.querySelectorAll(
              `${user.productTotalLocation.tagName}${attribute}${classes}`
            );
          } else if (user.productTotalLocation.attribute.length === 0) {
            let classes = classesCombine(user.productTotalLocation.className);
            products_Individual_TotalPrice_Array = document.querySelectorAll(
              `${user.productTotalLocation.tagName}${classes}`
            );
          } else if (user.productTotalLocation.className.length === 0) {
            let attribute = attributesCombine(
              user.productTotalLocation.attribute
            );
            products_Individual_TotalPrice_Array = document.querySelectorAll(
              `${user.productTotalLocation.tagName}${attribute}`
            );
          }
        }

        if (products_Individual_Price_Array.length > cartData.items.length) {
          console.log(products_Individual_Price_Array);
          let tempArr = Array.prototype.slice.call(
            products_Individual_Price_Array,
            0
          );
          if (tempArr.length % 2 !== 0) tempArr.pop();
          console.log(tempArr);
          products_Individual_Price_Array = [];
          products_Individual_TotalPrice_Array = [];
          for (let i = 0; i < tempArr.length; i++) {
            if (i % 2 === 0) {
              products_Individual_Price_Array.push(tempArr[i]);
            } else {
              products_Individual_TotalPrice_Array.push(tempArr[i]);
            }
          }
        }

        console.log("individual" + products_Individual_Price_Array);
        console.log("total" + products_Individual_TotalPrice_Array);

        // console.log(String(checkoutButton));

        //  product_Title_array = document.querySelectorAll(
        //    'form[action^="/cart"] a[data-cart-item-title]'
        //  );

        //  product_images = document.querySelectorAll(
        //    'form[action^="/cart"] img[data-cart-item-image]'
        //  );

        // Later, you can stop observing
        observer.disconnect();

        //subtotal
        console.log(products);

        let subTotal = 0;
        let discountTotal = 0;
        let individualProductDiscount = [];
        let productTotalDiscount = [];
        let buyXgetYDiscounts = [];
        products.forEach((each) => {
          let productTotal =
            parseInt(each.originalProductQuantity) * parseInt(each.price);
          // console.log(productTotal);
          subTotal += productTotal;
          let discountObj = findPriceRule(
            parseInt(each.originalProductQuantity),
            parseInt(each.productId)
          );
          console.log(discountObj);
          let discount;
          if (discountObj.discountType === "%") {
            discount = discountObj.applicableDiscount;
            let calculatedDiscount = (discount / 100) * parseInt(each.price);
            let individualPrice = parseInt(each.price) - calculatedDiscount;
            individualProductDiscount.push(individualPrice);
            console.log(
              individualPrice * parseInt(each.originalProductQuantity)
            );
            let productTotalPrice =
              individualPrice * parseInt(each.originalProductQuantity);
            productTotalDiscount.push(productTotalPrice);
            if (discount !== 0) {
              discountTotal +=
                calculatedDiscount * parseInt(each.originalProductQuantity);
            }
          } else {
            discount = discountObj.applicableDiscount;
            discount = discount * parseInt(each.originalProductQuantity);
            console.log(discount);
            // console.log(discount);
            let individualPrice =
              (productTotal - parseInt(discount)) /
              each.originalProductQuantity;
            individualProductDiscount.push(individualPrice);
            // console.log(parseInt(discount) * 2);
            let productTotalPrice = productTotal - parseInt(discount);
            productTotalDiscount.push(productTotalPrice);
            if (discount !== "0") {
              discountTotal += discount;
            }
          }

          //buyXgetY
          let buyXgetY = findBuyXgetY(
            parseInt(each.originalProductQuantity),
            parseInt(each.productId)
          );
          if (buyXgetY.applicableDiscount !== 0) {
            buyXgetYDiscounts.push(buyXgetY);
          }
        });

        let customTemplate = user.Customtemplate.template;
        console.log(customTemplate);

        console.log(subTotal, discountTotal);
        console.log(individualProductDiscount);
        console.log(productTotalDiscount);
        let discountedSubtotal = subTotal - discountTotal;
        console.log(discountedSubtotal);
        console.log("heyy");

        if (user.Customtemplate.showCustomTemplate) {
          if (user.Customtemplate.location.subtotalPrice) {
            // (true)
            let savedPrice = String(Math.round(subTotal - discountedSubtotal));
            let startIndex = customTemplate.search(":diff");
            let subtotalSave = customTemplate.split("");
            console.log(subtotalSave);
            subtotalSave.splice(
              startIndex,
              5,
              `${shopifyCurrency}.${savedPrice}`
            );
            console.log(subtotalSave.join(""));
            if (subTotal_Location) {
              if (discountedSubtotal !== subTotal) {
                subTotal_Location.innerHTML = `<del style="font-size:0.8em;font-weight:600;color:grey">${shopifyCurrency}. ${String(
                  Math.round(subTotal)
                )}.00</del><br> <ins style="text-decoration:none">${shopifyCurrency}. ${String(
                  String(Math.round(discountedSubtotal))
                )}.00</ins><br><span style="color:#ef5e64;font-weight:600">${subtotalSave.join(
                  ""
                )}</span>`;
              } else {
                subTotal_Location.innerHTML = `<ins style="text-decoration:none">${shopifyCurrency}. ${String(
                  String(subTotal)
                )}.00</ins>`;
              }
            }
          }
        }

        if (user.Customtemplate.showCustomTemplate) {
          if (user.Customtemplate.location.individualPrice) {
            // (true)
            for (let i = 0; i < individualProductDiscount.length; i++) {
              let savedPrice = String(
                parseInt(products[i].price) -
                  Math.round(individualProductDiscount[i])
              );
              let startIndex = customTemplate.search(":diff");
              let IndividualSave = customTemplate.split("");
              console.log(IndividualSave);
              IndividualSave.splice(
                startIndex,
                5,
                `${shopifyCurrency}.${savedPrice}`
              );
              console.log(IndividualSave.join(""));
              if (products[i].priceDiv) {
                if (
                  individualProductDiscount[i] !== parseInt(products[i].price)
                ) {
                  products[
                    i
                  ].priceDiv.innerHTML = `<del style="font-size:0.8em;font-weight:600;color:grey">${shopifyCurrency}. ${
                    products[i].price
                  }.00</del> <br><ins style="text-decoration:none">${shopifyCurrency}. ${String(
                    String(Math.round(individualProductDiscount[i]))
                  )}.00</ins><br><span style="color:#ef5e64;font-weight:600">${IndividualSave.join(
                    ""
                  )}</span>
              `;
                }
              }
            }
          }
        }

        if (user.Customtemplate.showCustomTemplate) {
          if (user.Customtemplate.location.totalPrice) {
            for (let i = 0; i < productTotalDiscount.length; i++) {
              let originalTotal =
                parseInt(products[i].originalProductQuantity) *
                parseInt(products[i].price);
              console.log(
                products[i].originalProductQuantity,
                products[i].price
              );
              console.log(productTotalDiscount[i]);
              let savedPrice = String(
                originalTotal - Math.round(productTotalDiscount[i])
              );
              let startIndex = customTemplate.search(":diff");
              let totalSave = customTemplate.split("");
              console.log(totalSave);
              totalSave.splice(
                startIndex,
                5,
                `${shopifyCurrency}.${savedPrice}`
              );
              console.log(totalSave.join(""));
              if (products[i].totalPriceDiv) {
                if (productTotalDiscount[i] !== originalTotal) {
                  products[
                    i
                  ].totalPriceDiv.innerHTML = `<del style="font-size:0.8em;font-weight:600;color:grey">${shopifyCurrency}. ${String(
                    originalTotal
                  )}.00</del><br> <ins style="text-decoration:none">${shopifyCurrency}. ${String(
                    String(Math.round(productTotalDiscount[i]))
                  )}.00</ins><br><span style="color:#ef5e64;font-weight:600">${totalSave.join(
                    ""
                  )}</span>`;
                }
              }
            }
          }
        }

        //Buy X get Y Popup
        let modalDiv = document.createElement("div");
        modalDiv.style.width = "fit-content";
        modalDiv.style.padding = "1em";
        modalDiv.style.position = "absolute";
        modalDiv.style.left = "0";
        modalDiv.style.right = "0";
        modalDiv.style.marginLeft = "auto";
        modalDiv.style.marginRight = "auto";
        modalDiv.style.top = "3%";
        modalDiv.style.zIndex = "99999";
        modalDiv.style.background = "#f4f6f8";
        modalDiv.style.border = "1px solid #bec0c2";
        modalDiv.style.borderRadius = "4px";
        let p = document.createElement("p");
        let buttonsDiv = document.createElement("div");
        buttonsDiv.style.textAlign = "right";
        let saveButton = document.createElement("button");
        saveButton.innerText = "OK";
        //   saveButton.style.marginLeft = "0.7em";
        saveButton.style.background = "#337CA0";
        saveButton.style.padding = "0.2em 1em";
        saveButton.style.color = "white";
        saveButton.style.border = "1px solid grey";
        saveButton.style.borderRadius = "14px";
        saveButton.style.float = "right";
        saveButton.onclick = () => {
          modalDiv.style.display = "none";
        };
        //   let clearButton = document.createElement("button");
        //   clearButton.innerText = "Clear";
        //   clearButton.style.border = "1px solid grey";
        //   clearButton.style.borderRadius = "4px";

        //   buttonsDiv.appendChild(clearButton);
        buttonsDiv.appendChild(saveButton);
        modalDiv.appendChild(p);
        // modalDiv.appendChild(modalImage);
        modalDiv.appendChild(buttonsDiv);
        modalDiv.style.display = "none";
        document.querySelector("body").appendChild(modalDiv);

        let cartItemIds = [];
        console.log(buyXgetYDiscounts);
        let discountText = [];
        cartData.items.forEach((each) => {
          cartItemIds.push(each.variant_id);
        });
        console.log(cartItemIds);
        for (let i = 0; i < buyXgetYDiscounts.length; i++) {
          console.log(
            cartItemIds.indexOf(buyXgetYDiscounts[i].XproductId) === -1
          );
          console.log(
            createPtag(
              buyXgetYDiscounts[i].applicableDiscount,
              buyXgetYDiscounts[i].YproductName
            )
          );
          for (let j = 0; j < buyXgetYDiscounts[i].YproductId.length; j++) {
            if (
              cartItemIds.indexOf(buyXgetYDiscounts[i].YproductId[j]) === -1
            ) {
              discountText.push(
                createPtag(
                  buyXgetYDiscounts[i].applicableDiscount,
                  buyXgetYDiscounts[i].YproductName[j]
                )
              );
            }
          }
        }
        console.log(discountText);
        if (discountText.length > 0) {
          //   alert(
          //     discountText.join("\n") +
          //       "\nKindly add the products in cart to avail the discount."
          //   );
          p.innerText =
            discountText.join("\n") +
            "\nKindly add the products in cart to avail the discount.";
          modalDiv.style.display = "block";
        }

        //individualPrice

        function inputEvent(e) {
          var Id = e.target.id.split("_");
          let changedProductId = Id[Id.length - 1].split(":")[0];
          for (let i = 0; i < products.length; i++) {
            if (products[i].productId === changedProductId) {
              products[i].originalProductQuantity = e.target.value;
            }
          }
          console.log(products);

          // setEventListeners("dd");
          // Start observing the target node for configured mutations
          observer.observe(subTotal_Location, config);
        }

        inputArray.forEach((each) => {
          each.addEventListener("input", inputEvent);
        });
        console.log("event listeners set");
      }

      let customCheckoutbutton = document.createElement("button");
      customCheckoutbutton.type = "button";
      customCheckoutbutton.innerText = "Checkout";

      setEventListeners("span");
      // console.log(checkoutButton);

      fetch(`${hostedUrl}/api/test`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.success);
          if (data.success) {
            console.log("running");
            // console.log(customCheckoutbutton);
            // checkoutButton.attributes[0].value = "button"
            console.log(checkoutButton);
            // checkoutButton.insertAdjacentHTML(
            //   "afterend",
            //   "<button type=button' onclick='alert()'>Checkout</button>"
            // );
            // checkoutButton.style.display = "none"
            console.log(products);

            // function sendData(e) {
            //   alert();
            //   e.preventDefault();
            //   e.stopImmediatePropagation();
            //   console.log("clicked");

            // }
            // checkoutButton.addEventListener('click', () => {
            //   event.stopImmediatePropagation();
            //   console.log(products);
            // });
            // let cloneButton = checkoutButton.cloneNode(true);
            // console.log(cloneButton);
            // checkoutButton.parentNode.replaceChild(cloneButton,checkoutButton)
            checkoutButton.onclick = (e) => {
              e.preventDefault();
              async function getCartData() {
                let data = await fetch("/cart.js");
                data = await data.json();
                return data;
                //   .then((response) => response.json())
                //   .then((data) => {
                //     //   console.log(data);
                //       return data;
                //   });
              }
              let cart = getCartData();
              cart.then((response) => {
                response.shopDomain = shopDomain;
                console.log(response);
                // axios
                //   .post(`${hostedUrl}/custom-checkout`, {
                //     // or 'PUT'
                //     products,
                //     shopDomain,
                //   })
                //   .then((response) => {
                //     console.log("Success:", response);
                //     window.location = response.data.url;
                //   })
                //   .catch((error) => {
                //     console.error("Error:", error);
                //   });

                fetch(`${hostedUrl}/custom-checkout`, {
                  method: "POST",
                  // mode: "no-cors",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    response,
                  }), // body data type must match "Content-Type" header
                })
                  .then((data) => data.json())
                  .then((response) => {
                    console.log("Success:", response);
                    window.location = response.url;
                  });
              });
              // console.log(products);

              // e.stopImmediatePropagation();
              // e.target.disabled = !0;
              // e.preventDefault();
              // axios
              //   .post(`${hostedUrl}/custom-checkout`, {
              //     // or 'PUT'
              //     products,
              //     shopDomain,
              //   })
              //   .then((response) => {
              //     console.log("Success:", response);
              //     window.location = response.data.url;
              //   })
              //   .catch((error) => {
              //     console.error("Error:", error);
              //   });
              // let data = { username: "example" };
              // fetch(`${hostedUrl}/custom-checkout`, {
              //   method: "POST", // or 'PUT'
              //   headers: {
              //     "Content-Type": "application/json",
              //   },
              //   body: JSON.stringify(data),
              // })
              //   .then((response) => response.json())
              //   .then((data) => {
              //     console.log("Success:", data);
              //   })
              //   .catch((error) => {
              //     console.error("Error:", error);
              //   });

              console.log("clicked");
            };
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  function subtotalSelector() {
    // alert("Press shift and then select the div by clicking");

    var clicked = false;

    let modalDiv = document.createElement("div");
    modalDiv.style.width = "fit-content";
    modalDiv.style.padding = "1em";
    modalDiv.style.position = "absolute";
    modalDiv.style.left = "0";
    modalDiv.style.right = "0";
    modalDiv.style.marginLeft = "auto";
    modalDiv.style.marginRight = "auto";
    modalDiv.style.top = "3%";
    modalDiv.style.zIndex = "99999";
    modalDiv.style.background = "#f4f6f8";
    modalDiv.style.border = "1px solid #bec0c2";
    modalDiv.style.borderRadius = "4px";
    let p = document.createElement("p");
    p.innerText = "Select cart subtotal amount while holding the Shift key.";
    let modalImage = document.createElement("img");
    modalImage.src =
      "https://sacdnfiles.s3.ap-south-1.amazonaws.com/dicount+app/subtotalImg.png";
    modalImage.style.width = "29em";
    let buttonsDiv = document.createElement("div");
    buttonsDiv.style.textAlign = "right";
    let saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.style.marginLeft = "0.7em";
    saveButton.style.background = "#bac0e6";

    saveButton.style.color = "white";
    saveButton.style.border = "1px solid grey";
    saveButton.style.borderRadius = "4px";
    saveButton.disabled = true;

    let clearButton = document.createElement("button");
    clearButton.innerText = "Clear";
    clearButton.style.border = "1px solid grey";
    clearButton.style.borderRadius = "4px";

    buttonsDiv.appendChild(clearButton);
    buttonsDiv.appendChild(saveButton);
    modalDiv.appendChild(p);
    modalDiv.appendChild(modalImage);
    modalDiv.appendChild(buttonsDiv);

    document.querySelector("body").appendChild(modalDiv);
    function updateShift(event) {
      if (event.shiftKey && !clicked) {
        document.body.classList.add("shift-pressed");
        modalDiv.style.display = "none";
      } else {
        document.body.classList.remove("shift-pressed");
      }
    }
    function shiftClick(event) {
      if (event.shiftKey) {
        /* console.log("hi") */
        modalDiv.style.display = "block";
        saveButton.disabled = false;
        saveButton.style.background = "#9c6ade";
        clicked = true;
        event.target.classList.add("clicked");
        saveButton.addEventListener("click", () => {
          let className = [];
          let attributes = [];
          console.log(event.target.attributes);
          if (event.target.attributes.length > 0) {
            for (let j = 0; j < event.target.attributes.length; j++) {
              if (event.target.attributes[j].name === "class") {
                className = event.target.attributes[j].value.split(" ");
                for (let i = 0; i < className.length; i++) {
                  if (className[i] === "clicked") {
                    className.splice(i);
                  }
                }
              } else {
                attributes.push(event.target.attributes[j].name);
              }
            }
          }
          console.log(className, attributes);
          axios
            .post(`${hostedUrl}/subtotalSave`, {
              className: className,
              tagName: event.target.tagName.toLowerCase(),
              shopName: shopDomain,
              attributes: attributes,
            })
            .then((result) => {
              console.log(result);

              window.location = frontendUrl + "/tieredPricing/settings";
            })
            .catch((err) => console.log(err));
        });
        clearButton.addEventListener("click", () => {
          saveButton.style.background = "#bac0e6";
          saveButton.disabled = true;
          event.target.classList.remove("clicked");
          clicked = false;
          document.body.className = "";
        });
      }
    }
    var button = document.querySelector("button");
    button.addEventListener("mousemove", updateShift);
    window.addEventListener("keydown", updateShift);
    window.addEventListener("keyup", updateShift);
    window.addEventListener("click", shiftClick);
  }
  function totalSelector() {
    // alert("Press shift and then select the div by clicking");

    var clicked = false;

    let modalDiv = document.createElement("div");
    modalDiv.style.width = "fit-content";
    modalDiv.style.padding = "1em";
    modalDiv.style.position = "absolute";
    modalDiv.style.left = "0";
    modalDiv.style.right = "0";
    modalDiv.style.marginLeft = "auto";
    modalDiv.style.marginRight = "auto";
    modalDiv.style.top = "3%";
    modalDiv.style.zIndex = "99999";
    modalDiv.style.background = "#f4f6f8";
    modalDiv.style.border = "1px solid #bec0c2";
    modalDiv.style.borderRadius = "4px";
    let p = document.createElement("p");
    p.innerText = "Select product total amount while holding the Shift key.";
    let modalImage = document.createElement("img");
    modalImage.src =
      "https://sacdnfiles.s3.ap-south-1.amazonaws.com/dicount+app/totalImg.png";
    modalImage.style.width = "29em";
    let buttonsDiv = document.createElement("div");
    buttonsDiv.style.textAlign = "right";
    let saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.style.marginLeft = "0.7em";
    saveButton.style.background = "#bac0e6";

    saveButton.style.color = "white";
    saveButton.style.border = "1px solid grey";
    saveButton.style.borderRadius = "4px";
    saveButton.disabled = true;

    let clearButton = document.createElement("button");
    clearButton.innerText = "Clear";
    clearButton.style.border = "1px solid grey";
    clearButton.style.borderRadius = "4px";

    buttonsDiv.appendChild(clearButton);
    buttonsDiv.appendChild(saveButton);
    modalDiv.appendChild(p);
    modalDiv.appendChild(modalImage);
    modalDiv.appendChild(buttonsDiv);

    document.querySelector("body").appendChild(modalDiv);

    function updateShift(event) {
      if (event.shiftKey && !clicked) {
        document.body.classList.add("shift-pressed");
        modalDiv.style.display = "none";
      } else {
        document.body.classList.remove("shift-pressed");
      }
    }
    function shiftClick(event) {
      if (event.shiftKey) {
        /* console.log("hi") */
        modalDiv.style.display = "block";
        saveButton.disabled = false;
        saveButton.style.background = "#9c6ade";
        clicked = true;
        event.target.classList.add("clicked");
        saveButton.addEventListener("click", () => {
          let className = [];
          let attributes = [];
          console.log(event.target.attributes);
          if (event.target.attributes.length > 0) {
            for (let j = 0; j < event.target.attributes.length; j++) {
              if (event.target.attributes[j].name === "class") {
                className = event.target.attributes[j].value.split(" ");
                for (let i = 0; i < className.length; i++) {
                  if (className[i] === "clicked") {
                    className.splice(i);
                  }
                }
              } else {
                attributes.push(event.target.attributes[j].name);
              }
            }
          }
          console.log(className, attributes);
          axios
            .post(`${hostedUrl}/totalSave`, {
              className: className,
              tagName: event.target.tagName.toLowerCase(),
              shopName: shopDomain,
              attributes: attributes,
            })
            .then((result) => {
              console.log(result);

              window.location = frontendUrl + "/tieredPricing/settings";
            })
            .catch((err) => console.log(err));
        });
        clearButton.addEventListener("click", () => {
          saveButton.style.background = "#bac0e6";
          saveButton.disabled = true;
          event.target.classList.remove("clicked");
          clicked = false;
          document.body.className = "";
        });
      }
    }
    var button = document.querySelector("button");
    button.addEventListener("mousemove", updateShift);
    window.addEventListener("keydown", updateShift);
    window.addEventListener("keyup", updateShift);
    window.addEventListener("click", shiftClick);
  }
  function individualPriceSelector() {
    // alert("Press shift and then select the div by clicking");

    var clicked = false;

    let modalDiv = document.createElement("div");
    modalDiv.style.width = "fit-content";
    modalDiv.style.padding = "1em";
    modalDiv.style.position = "absolute";
    modalDiv.style.left = "0";
    modalDiv.style.right = "0";
    modalDiv.style.marginLeft = "auto";
    modalDiv.style.marginRight = "auto";
    modalDiv.style.top = "3%";
    modalDiv.style.zIndex = "99999";
    modalDiv.style.background = "#f4f6f8";
    modalDiv.style.border = "1px solid #bec0c2";
    modalDiv.style.borderRadius = "4px";
    let p = document.createElement("p");
    p.innerText =
      "Select individual product price while holding the Shift key.";
    let modalImage = document.createElement("img");
    modalImage.src =
      "https://sacdnfiles.s3.ap-south-1.amazonaws.com/dicount+app/priceImg.png";
    modalImage.style.width = "29em";
    let buttonsDiv = document.createElement("div");
    buttonsDiv.style.textAlign = "right";
    let saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.style.marginLeft = "0.7em";
    saveButton.style.background = "#bac0e6";

    saveButton.style.color = "white";
    saveButton.style.border = "1px solid grey";
    saveButton.style.borderRadius = "4px";
    saveButton.disabled = true;

    let clearButton = document.createElement("button");
    clearButton.innerText = "Clear";
    clearButton.style.border = "1px solid grey";
    clearButton.style.borderRadius = "4px";

    buttonsDiv.appendChild(clearButton);
    buttonsDiv.appendChild(saveButton);
    modalDiv.appendChild(p);
    modalDiv.appendChild(modalImage);
    modalDiv.appendChild(buttonsDiv);

    document.querySelector("body").appendChild(modalDiv);

    function updateShift(event) {
      if (event.shiftKey && !clicked) {
        document.body.classList.add("shift-pressed");
        modalDiv.style.display = "none";
      } else {
        document.body.classList.remove("shift-pressed");
      }
    }
    function shiftClick(event) {
      if (event.shiftKey) {
        /* console.log("hi") */
        modalDiv.style.display = "block";
        saveButton.disabled = false;
        saveButton.style.background = "#9c6ade";
        clicked = true;
        event.target.classList.add("clicked");
        saveButton.addEventListener("click", () => {
          let className = [];
          let attributes = [];
          console.log(event.target.attributes);
          if (event.target.attributes.length > 0) {
            for (let j = 0; j < event.target.attributes.length; j++) {
              if (event.target.attributes[j].name === "class") {
                className = event.target.attributes[j].value.split(" ");
                for (let i = 0; i < className.length; i++) {
                  if (className[i] === "clicked") {
                    className.splice(i);
                  }
                }
              } else {
                attributes.push(event.target.attributes[j].name);
              }
            }
          }
          console.log(className, attributes);
          axios
            .post(`${hostedUrl}/individualSave`, {
              className: className,
              tagName: event.target.tagName.toLowerCase(),
              shopName: shopDomain,
              attributes: attributes,
            })
            .then((result) => {
              console.log(result);

              window.location = frontendUrl + "/tieredPricing/settings";
            })
            .catch((err) => console.log(err));
        });
        clearButton.addEventListener("click", () => {
          saveButton.style.background = "#bac0e6";
          saveButton.disabled = true;
          event.target.classList.remove("clicked");
          clicked = false;
          document.body.className = "";
        });
      }
    }
    var button = document.querySelector("button");
    button.addEventListener("mousemove", updateShift);
    window.addEventListener("keydown", updateShift);
    window.addEventListener("keyup", updateShift);
    window.addEventListener("click", shiftClick);
  }

  //Ajax Cart selection
  function ajaxIndividualSelector() {
    // alert("Press shift and then select the div by clicking");

    var clicked = false;

    let modalDiv = document.createElement("div");
    modalDiv.style.width = "fit-content";
    modalDiv.style.padding = "1em";
    modalDiv.style.position = "absolute";
    modalDiv.style.left = "0";
    modalDiv.style.right = "0";
    modalDiv.style.marginLeft = "auto";
    modalDiv.style.marginRight = "auto";
    modalDiv.style.top = "3%";
    modalDiv.style.zIndex = "99999";
    modalDiv.style.background = "#f4f6f8";
    modalDiv.style.border = "1px solid #bec0c2";
    modalDiv.style.borderRadius = "4px";
    let p = document.createElement("p");
    p.innerText =
      "Select individual product price while holding the Shift key.";
    let modalImage = document.createElement("img");
    modalImage.src =
      "https://sacdnfiles.s3.ap-south-1.amazonaws.com/dicount+app/priceImg.png";
    modalImage.style.width = "29em";
    let buttonsDiv = document.createElement("div");
    buttonsDiv.style.textAlign = "right";
    let saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.style.marginLeft = "0.7em";
    saveButton.style.background = "#bac0e6";

    saveButton.style.color = "white";
    saveButton.style.border = "1px solid grey";
    saveButton.style.borderRadius = "4px";
    saveButton.disabled = true;

    let clearButton = document.createElement("button");
    clearButton.innerText = "Clear";
    clearButton.style.border = "1px solid grey";
    clearButton.style.borderRadius = "4px";

    buttonsDiv.appendChild(clearButton);
    buttonsDiv.appendChild(saveButton);
    modalDiv.appendChild(p);
    modalDiv.appendChild(modalImage);
    modalDiv.appendChild(buttonsDiv);

    document.querySelector("body").appendChild(modalDiv);

    function updateShift(event) {
      if (event.shiftKey && !clicked) {
        document.body.classList.add("shift-pressed");
        modalDiv.style.display = "none";
      } else {
        document.body.classList.remove("shift-pressed");
      }
    }
    function shiftClick(event) {
      if (event.shiftKey) {
        /* console.log("hi") */
        modalDiv.style.display = "block";
        saveButton.disabled = false;
        saveButton.style.background = "#9c6ade";
        clicked = true;
        event.target.classList.add("clicked");
        saveButton.addEventListener("click", () => {
          let className = [];
          let attributes = [];
          console.log(event.target.attributes);
          if (event.target.attributes.length > 0) {
            for (let j = 0; j < event.target.attributes.length; j++) {
              if (event.target.attributes[j].name === "class") {
                className = event.target.attributes[j].value.split(" ");
                for (let i = 0; i < className.length; i++) {
                  if (className[i] === "clicked") {
                    className.splice(i);
                  }
                }
              } else {
                attributes.push(event.target.attributes[j].name);
              }
            }
          }
          console.log(className, attributes);
          axios
            .post(`${hostedUrl}/ajaxIndividual`, {
              className: className,
              tagName: event.target.tagName.toLowerCase(),
              shopName: shopDomain,
              attributes: attributes,
            })
            .then((result) => {
              console.log(result);

              window.location = frontendUrl + "/tieredPricing/settings";
            })
            .catch((err) => console.log(err));
        });
        clearButton.addEventListener("click", () => {
          saveButton.style.background = "#bac0e6";
          saveButton.disabled = true;
          event.target.classList.remove("clicked");
          clicked = false;
          document.body.className = "";
        });
      }
    }
    var button = document.querySelector("button");
    button.addEventListener("mousemove", updateShift);
    window.addEventListener("keydown", updateShift);
    window.addEventListener("keyup", updateShift);
    window.addEventListener("click", shiftClick);
  }

  function ajaxTotalSelector() {
    // alert("Press shift and then select the div by clicking");
    // let frontendUrl = "http://localhost:3000"; //frontend url
    // let hostedUrl = "http://localhost:8080";
    // let shopDomain = Shopify.shop.split(".")[0];

    var clicked = false;

    let modalDiv = document.createElement("div");
    modalDiv.style.width = "fit-content";
    modalDiv.style.padding = "1em";
    modalDiv.style.position = "absolute";
    modalDiv.style.left = "0";
    modalDiv.style.right = "0";
    modalDiv.style.marginLeft = "auto";
    modalDiv.style.marginRight = "auto";
    modalDiv.style.top = "3%";
    modalDiv.style.zIndex = "99999";
    modalDiv.style.background = "#f4f6f8";
    modalDiv.style.border = "1px solid #bec0c2";
    modalDiv.style.borderRadius = "4px";
    let p = document.createElement("p");
    p.innerText = "Select product total amount while holding the Shift key.";
    let modalImage = document.createElement("img");
    modalImage.src =
      "https://sacdnfiles.s3.ap-south-1.amazonaws.com/dicount+app/totalImg.png";
    modalImage.style.width = "29em";
    let buttonsDiv = document.createElement("div");
    buttonsDiv.style.textAlign = "right";
    let saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.style.marginLeft = "0.7em";
    saveButton.style.background = "#bac0e6";

    saveButton.style.color = "white";
    saveButton.style.border = "1px solid grey";
    saveButton.style.borderRadius = "4px";
    saveButton.disabled = true;

    let clearButton = document.createElement("button");
    clearButton.innerText = "Clear";
    clearButton.style.border = "1px solid grey";
    clearButton.style.borderRadius = "4px";

    buttonsDiv.appendChild(clearButton);
    buttonsDiv.appendChild(saveButton);
    modalDiv.appendChild(p);
    modalDiv.appendChild(modalImage);
    modalDiv.appendChild(buttonsDiv);

    document.querySelector("body").appendChild(modalDiv);

    function updateShift(event) {
      if (event.shiftKey && !clicked) {
        document.body.classList.add("shift-pressed");
        modalDiv.style.display = "none";
      } else {
        document.body.classList.remove("shift-pressed");
      }
    }
    function shiftClick(event) {
      if (event.shiftKey) {
        /* console.log("hi") */
        modalDiv.style.display = "block";
        saveButton.disabled = false;
        saveButton.style.background = "#9c6ade";
        clicked = true;
        event.target.classList.add("clicked");
        saveButton.addEventListener("click", () => {
          let className = [];
          let attributes = [];
          console.log(event.target.attributes);
          if (event.target.attributes.length > 0) {
            for (let j = 0; j < event.target.attributes.length; j++) {
              if (event.target.attributes[j].name === "class") {
                className = event.target.attributes[j].value.split(" ");
                for (let i = 0; i < className.length; i++) {
                  if (className[i] === "clicked") {
                    className.splice(i);
                  }
                }
              } else {
                attributes.push(event.target.attributes[j].name);
              }
            }
          }
          console.log(className, attributes);
          axios
            .post(`${hostedUrl}/ajaxTotal`, {
              className: className,
              tagName: event.target.tagName.toLowerCase(),
              shopName: shopDomain,
              attributes: attributes,
            })
            .then((result) => {
              console.log(result);

              window.location = frontendUrl + "/tieredPricing/settings";
            })
            .catch((err) => console.log(err));
        });
        clearButton.addEventListener("click", () => {
          saveButton.style.background = "#bac0e6";
          saveButton.disabled = true;
          event.target.classList.remove("clicked");
          clicked = false;
          document.body.className = "";
        });
      }
    }
    var button = document.querySelector("button");
    button.addEventListener("mousemove", updateShift);
    window.addEventListener("keydown", updateShift);
    window.addEventListener("keyup", updateShift);
    window.addEventListener("click", shiftClick);
  }

  function ajaxSubtotalSelector() {
    // alert("Press shift and then select the div by clicking");

    var clicked = false;

    let modalDiv = document.createElement("div");
    modalDiv.style.width = "fit-content";
    modalDiv.style.padding = "1em";
    modalDiv.style.position = "absolute";
    modalDiv.style.left = "0";
    modalDiv.style.right = "0";
    modalDiv.style.marginLeft = "auto";
    modalDiv.style.marginRight = "auto";
    modalDiv.style.top = "3%";
    modalDiv.style.zIndex = "99999";
    modalDiv.style.background = "#f4f6f8";
    modalDiv.style.border = "1px solid #bec0c2";
    modalDiv.style.borderRadius = "4px";
    let p = document.createElement("p");
    p.innerText = "Select cart subtotal amount while holding the Shift key.";
    let modalImage = document.createElement("img");
    modalImage.src =
      "https://sacdnfiles.s3.ap-south-1.amazonaws.com/dicount+app/subtotalImg.png";
    modalImage.style.width = "29em";
    let buttonsDiv = document.createElement("div");
    buttonsDiv.style.textAlign = "right";
    let saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.style.marginLeft = "0.7em";
    saveButton.style.background = "#bac0e6";

    saveButton.style.color = "white";
    saveButton.style.border = "1px solid grey";
    saveButton.style.borderRadius = "4px";
    saveButton.disabled = true;

    let clearButton = document.createElement("button");
    clearButton.innerText = "Clear";
    clearButton.style.border = "1px solid grey";
    clearButton.style.borderRadius = "4px";

    buttonsDiv.appendChild(clearButton);
    buttonsDiv.appendChild(saveButton);
    modalDiv.appendChild(p);
    modalDiv.appendChild(modalImage);
    modalDiv.appendChild(buttonsDiv);

    document.querySelector("body").appendChild(modalDiv);
    function updateShift(event) {
      if (event.shiftKey && !clicked) {
        document.body.classList.add("shift-pressed");
        modalDiv.style.display = "none";
      } else {
        document.body.classList.remove("shift-pressed");
      }
    }
    function shiftClick(event) {
      if (event.shiftKey) {
        /* console.log("hi") */
        modalDiv.style.display = "block";
        saveButton.disabled = false;
        saveButton.style.background = "#9c6ade";
        clicked = true;
        event.target.classList.add("clicked");
        saveButton.addEventListener("click", () => {
          let className = [];
          let attributes = [];
          console.log(event.target.attributes);
          if (event.target.attributes.length > 0) {
            for (let j = 0; j < event.target.attributes.length; j++) {
              if (event.target.attributes[j].name === "class") {
                className = event.target.attributes[j].value.split(" ");
                for (let i = 0; i < className.length; i++) {
                  if (className[i] === "clicked") {
                    className.splice(i);
                  }
                }
              } else {
                attributes.push(event.target.attributes[j].name);
              }
            }
          }
          console.log(className, attributes);
          axios
            .post(`${hostedUrl}/ajaxSubtotal`, {
              className: className,
              tagName: event.target.tagName.toLowerCase(),
              shopName: shopDomain,
              attributes: attributes,
            })
            .then((result) => {
              console.log(result);

              window.location = frontendUrl + "/tieredPricing/settings";
            })
            .catch((err) => console.log(err));
        });
        clearButton.addEventListener("click", () => {
          saveButton.style.background = "#bac0e6";
          saveButton.disabled = true;
          event.target.classList.remove("clicked");
          clicked = false;
          document.body.className = "";
        });
      }
    }
    var button = document.querySelector("button");
    button.addEventListener("mousemove", updateShift);
    window.addEventListener("keydown", updateShift);
    window.addEventListener("keyup", updateShift);
    window.addEventListener("click", shiftClick);
  }
  function ajaxCheckoutSelector() {
    // alert("Press shift and then select the div by clicking");

    var clicked = false;

    let modalDiv = document.createElement("div");
    modalDiv.style.width = "fit-content";
    modalDiv.style.padding = "1em";
    modalDiv.style.position = "absolute";
    modalDiv.style.left = "0";
    modalDiv.style.right = "0";
    modalDiv.style.marginLeft = "auto";
    modalDiv.style.marginRight = "auto";
    modalDiv.style.top = "3%";
    modalDiv.style.zIndex = "99999";
    modalDiv.style.background = "#f4f6f8";
    modalDiv.style.border = "1px solid #bec0c2";
    modalDiv.style.borderRadius = "4px";
    let p = document.createElement("p");
    p.innerText = "Select Check Out button while holding the Shift key.";
    let modalImage = document.createElement("img");
    modalImage.src =
      "https://sacdnfiles.s3.ap-south-1.amazonaws.com/dicount+app/select_checkout_button.jpeg";
    modalImage.style.width = "29em";
    let buttonsDiv = document.createElement("div");
    buttonsDiv.style.textAlign = "right";
    let saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.style.marginLeft = "0.7em";
    saveButton.style.background = "#bac0e6";

    saveButton.style.color = "white";
    saveButton.style.border = "1px solid grey";
    saveButton.style.borderRadius = "4px";
    saveButton.disabled = true;

    let clearButton = document.createElement("button");
    clearButton.innerText = "Clear";
    clearButton.style.border = "1px solid grey";
    clearButton.style.borderRadius = "4px";

    buttonsDiv.appendChild(clearButton);
    buttonsDiv.appendChild(saveButton);
    modalDiv.appendChild(p);
    modalDiv.appendChild(modalImage);
    modalDiv.appendChild(buttonsDiv);

    document.querySelector("body").appendChild(modalDiv);
    function updateShift(event) {
      if (event.shiftKey && !clicked) {
        document.body.classList.add("shift-pressed");
        modalDiv.style.display = "none";
      } else {
        document.body.classList.remove("shift-pressed");
      }
    }
    function shiftClick(event) {
      event.preventDefault();
      if (event.shiftKey) {
        /* console.log("hi") */
        modalDiv.style.display = "block";
        saveButton.disabled = false;
        saveButton.style.background = "#9c6ade";
        clicked = true;
        event.target.classList.add("clicked");
        saveButton.addEventListener("click", () => {
          let className = [];
          let attributes = [];
          console.log(event.target.attributes);
          if (event.target.attributes.length > 0) {
            for (let j = 0; j < event.target.attributes.length; j++) {
              if (event.target.attributes[j].name === "class") {
                className = event.target.attributes[j].value.split(" ");
                for (let i = 0; i < className.length; i++) {
                  if (className[i] === "clicked") {
                    className.splice(i);
                  }
                }
              } else {
                attributes.push(event.target.attributes[j].name);
              }
            }
          }
          console.log(className, attributes);
          axios
            .post(`${hostedUrl}/ajaxCheckout`, {
              className: className,
              tagName: event.target.tagName.toLowerCase(),
              shopName: shopDomain,
              attributes: attributes,
            })
            .then((result) => {
              console.log(result);

              window.location = frontendUrl + "/tieredPricing/settings";
            })
            .catch((err) => console.log(err));
        });
        clearButton.addEventListener("click", () => {
          saveButton.style.background = "#bac0e6";
          saveButton.disabled = true;
          event.target.classList.remove("clicked");
          clicked = false;
          document.body.className = "";
        });
      }
    }
    var button = document.querySelector("button");
    button.addEventListener("mousemove", updateShift);
    window.addEventListener("keydown", updateShift);
    window.addEventListener("keyup", updateShift);
    window.addEventListener("click", shiftClick);
  }

  function renderWidget() {
    // fetch(`${hostedUrl}/userData`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     username: shopDomain,
    //   }), // body data type must match "Content-Type" header
    // })
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log(data);
    // let node = document.querySelector(
    //   `${data.data[0].widgetLocation.div.tagName}.${data.data[0].widgetLocation.div.className[0]}`
    // );
    let node;
    if (user.widgetLocation.div.tagName !== "") {
      if (
        user.widgetLocation.div.attribute.length !== 0 &&
        user.widgetLocation.div.className.length !== 0
      ) {
        node = document.querySelector(
          `${user.widgetLocation.div.tagName}[${user.widgetLocation.div.attribute[0]}].${user.widgetLocation.div.className[0]}`
        );
      } else if (user.widgetLocation.div.attribute.length === 0) {
        node = document.querySelector(
          `${user.widgetLocation.div.tagName}.${user.widgetLocation.div.className[0]}`
        );
      } else if (user.widgetLocation.div.className.length === 0) {
        node = document.querySelector(
          `${user.widgetLocation.div.tagName}[${user.widgetLocation.div.attribute[0]}]`
        );
      }
    }
    console.log(node);
    console.log(meta);
    let current_Product_VariantIds = [];
    let variantPrices = [];
    let variants = [];
    meta.product.variants.forEach((each) => {
      let obj = {
        id: each.id,
        price: Math.round(each.price / 100),
      };
      variants.push(obj);
      current_Product_VariantIds.push(each.id);
      variantPrices.push(Math.round(each.price / 100));
    });
    console.log(variants);
    console.log(current_Product_VariantIds);
    let applicablePriceRules = [];
    let applicableBuyXGetY = [];
    let variantPrice = 0;
    function applicableDiscounts(obj) {
      user.discount.forEach((each) => {
        for (let i = 0; i < each.productIds.length; i++) {
          if (each.productIds[i] === obj.id) {
            variantPrice = obj.price;
            if (each.priceRule.length > 0)
              each.priceRule.forEach((data) => applicablePriceRules.push(data));
            if (each.buyXgetY.length > 0)
              each.buyXgetY.forEach((data) => applicableBuyXGetY.push(data));
          }
        }
      });
    }

    // variants.forEach((variant) => applicableDiscounts(variant)); we will use this when we add variant wise price deduction feature
    applicableDiscounts(variants[0]); //since we are considering all variants have same price
    console.log(applicablePriceRules);
    console.log(applicableBuyXGetY);
    let tierData = [];
    console.log(variantPrice);
    console.log(user.tierDescription.templateType);
    let customTierTemplate = "";
    if (user.tierDescription.templateType === "custom") {
      customTierTemplate = user.tierDescription.customText;
    }
    //Price Rule P tags
    function createP1Tag(quantity, price, discount, discountType) {
      let discountedTotal = Math.round(quantity * price - discount * quantity);
      if (discountType === "%") {
        discountedTotal = Math.round(
          quantity * price - (discount / 100) * price * quantity
        );
      }
      console.log(shopifyCurrency);
      let discountPercentage = Math.round(
        ((quantity * price - discountedTotal) / (quantity * price)) * 100
      );
      if (discountType === "%") {
        discountPercentage = discount;
      }
      let p;
      if (user.tierDescription.templateType === "BuyQforE") {
        // (1)
        p = `<div style="padding-bottom: 1em">
                    <p style="color: ${
                      user.discountStyle[0].PricetextColor || "#006e5a"
                    }; font-size: 0.8em; font-weight: 600">
                      Buy ${String(
                        quantity
                      )} for  <span style="color: #babfc5; font-size: small"
                        ><del>${shopifyCurrency}.${String(price)}</del></span
                      >${shopifyCurrency}.${String(
          Math.round(discountedTotal / quantity)
        )} each <span style="
                        color: ${
                          user.discountStyle[0].PricetextColor2 || "#f17157"
                        };
                        font-size: medium;
                        font-weight: 600;
                      ">(${String(discountPercentage)}% off!)</span>
                    </p>
                    
                  </div>`;
      } else if (user.tierDescription.templateType === "BuyQforT") {
        // (true)
        p = `<div style="padding-bottom: 1em">
                    <p style="color: ${
                      user.discountStyle[0].PricetextColor || "#006e5a"
                    }; font-size: 0.8em; font-weight: 600">
                      Buy ${String(
                        quantity
                      )} for  <span style="color: #babfc5; font-size: small"
                        ><del>${shopifyCurrency}.${String(
          quantity * price
        )}</del></span
                      >${shopifyCurrency}.${String(
          discountedTotal
        )} <span style="
                        color: ${
                          user.discountStyle[0].PricetextColor2 || "#f17157"
                        };
                        font-size: medium;
                        font-weight: 600;
                      ">(${String(discountPercentage)}% off!)</span>
                    </p>
                    
                  </div>`;
      } else if (user.tierDescription.templateType === "custom") {
        let customText = customTierTemplate.split(" ");
        // console.log(customText);
        let quantityIndex = customText.indexOf("[Q]");
        let individualDiscountIndex = customText.indexOf("[E]");
        let totalDiscountIndex = customText.indexOf("[T]");
        let DiscountIndex = customText.indexOf("[D]%");
        console.log(
          quantityIndex,
          individualDiscountIndex,
          totalDiscountIndex,
          DiscountIndex
        );
        if (quantityIndex !== -1) {
          customText.splice(quantityIndex, 1, `${String(quantity)}`);
        }

        if (individualDiscountIndex !== -1) {
          customText.splice(
            individualDiscountIndex,
            1,
            `${shopifyCurrency}${String(
              Math.round(discountedTotal / quantity)
            )}`
          );
        }
        if (totalDiscountIndex !== -1) {
          customText.splice(
            totalDiscountIndex,
            1,
            `${shopifyCurrency}${String(discountedTotal)}`
          );
        }
        if (DiscountIndex !== -1) {
          customText.splice(DiscountIndex, 1, `${String(discountPercentage)}%`);
        }
        console.log(customText.join(" "));

        p = `<div style="padding-bottom: 1em">
                    <p style="color: ${
                      user.discountStyle[0].PricetextColor || "#006e5a"
                    }; font-size: 0.8em; font-weight: 600">
                      ${customText.join(" ")}
                    </p>
                    
                  </div>`;
      }
      tierData.push(p);
    }
    function createP2Tag(quantity, price, discount, discountType) {
      let discountedTotal = Math.round(quantity * price - discount * quantity);
      if (discountType === "%") {
        discountedTotal = Math.round(
          quantity * price - (discount / 100) * price * quantity
        );
      }
      let discountPercentage = Math.round(
        ((quantity * price - discountedTotal) / (quantity * price)) * 100
      );
      if (discountType === "%") {
        discountPercentage = discount;
      }
      let p;
      if (user.tierDescription.templateType === "BuyQforE") {
        // (1)
        p = `<p style="font-weight:700;color:${
          user.discountStyle[0].PricetextColor || "black"
        }">
                  Buy ${String(quantity)} for ${shopifyCurrency}. ${String(
          price - discount
        )} each (${String(discountPercentage)}% off! )
                      </p>`;
      } else if (user.tierDescription.templateType === "BuyQforT") {
        p = `<p style="font-weight:700;color:${
          user.discountStyle[0].PricetextColor || "black"
        }">
                  Buy ${String(quantity)} for ${shopifyCurrency}. ${String(
          discountedTotal
        )} (${String(discountPercentage)}% off! )
                      </p>`;
      } else if (user.tierDescription.templateType === "custom") {
        let customText = customTierTemplate.split(" ");
        // console.log(customText);
        let quantityIndex = customText.indexOf("[Q]");
        let individualDiscountIndex = customText.indexOf("[E]");
        let totalDiscountIndex = customText.indexOf("[T]");
        let DiscountIndex = customText.indexOf("[D]%");
        console.log(
          quantityIndex,
          individualDiscountIndex,
          totalDiscountIndex,
          DiscountIndex
        );
        if (quantityIndex !== -1) {
          customText.splice(quantityIndex, 1, `${String(quantity)}`);
        }

        if (individualDiscountIndex !== -1) {
          customText.splice(
            individualDiscountIndex,
            1,
            `${shopifyCurrency}${String(
              Math.round(discountedTotal / quantity)
            )}`
          );
        }
        if (totalDiscountIndex !== -1) {
          customText.splice(
            totalDiscountIndex,
            1,
            `${shopifyCurrency}${String(discountedTotal)}`
          );
        }
        if (DiscountIndex !== -1) {
          customText.splice(DiscountIndex, 1, `${String(discountPercentage)}%`);
        }
        console.log(customText.join(" "));

        p = `<p style="font-weight:700;color:${
          user.discountStyle[0].PricetextColor || "black"
        }">
                 ${customText.join(" ")}
                      </p>`;
      }
      tierData.push(p);
    }

    function createP3Tag(quantity, price, discount, discountType) {
      let discountedTotal = Math.round(quantity * price - discount * quantity);
      if (discountType === "%") {
        discountedTotal = Math.round(
          quantity * price - (discount / 100) * price * quantity
        );
      }
      let discountPercentage = Math.round(
        ((quantity * price - discountedTotal) / (quantity * price)) * 100
      );
      if (discountType === "%") {
        discountPercentage = discount;
      }
      console.log(discountedTotal);
      let p;
      if (user.tierDescription.templateType === "BuyQforE") {
        p = `
      <p style="color: ${
        user.discountStyle[0].PricetextColor || "#7f818c"
      }; font-weight: 400; font-size: ${
          String(user.discountStyle[0].PricetextSize) || "18"
        }px">
    Buy ${String(quantity)} for <del style="color:${
          user.discountStyle[0].PricetextColor || "#7f818c"
        }; font-weight: 400; font-size: 1em"
      >${shopifyCurrency}. ${String(price)}</del
    >${shopifyCurrency}. ${String(Math.round(discountedTotal / quantity))} each <span
      style="
        color:${user.discountStyle[0].PricetextColor2 || "#ff915a"};
        font-weight: 600;
        font-size: ${String(user.discountStyle[0].PricetextSize2) || "18"}px;
        padding-left: 0.5em;
      "
      >(${String(discountPercentage)}% OFF)</span
    >
  </p>`;
      } else if (user.tierDescription.templateType === "BuyQforT") {
        p = `
      <p style="color: ${
        user.discountStyle[0].PricetextColor || "#7f818c"
      }; font-weight: 400; font-size: ${
          String(user.discountStyle[0].PricetextSize) || "18"
        }px">
    Buy ${String(quantity)} for <del style="color:${
          user.discountStyle[0].PricetextColor || "#7f818c"
        }; font-weight: 400; font-size: 1em"
      >${shopifyCurrency}. ${String(quantity * price)}</del
    >${shopifyCurrency}. ${String(discountedTotal)} <span
      style="
        color:${user.discountStyle[0].PricetextColor2 || "#ff915a"};
        font-weight: 600;
        font-size: ${String(user.discountStyle[0].PricetextSize2) || "18"}px;
        padding-left: 0.5em;
      "
      >(${String(discountPercentage)}% OFF)</span
    >
  </p>`;
      } else if (user.tierDescription.templateType === "custom") {
        let customText = customTierTemplate.split(" ");
        // console.log(customText);
        let quantityIndex = customText.indexOf("[Q]");
        let individualDiscountIndex = customText.indexOf("[E]");
        let totalDiscountIndex = customText.indexOf("[T]");
        let DiscountIndex = customText.indexOf("[D]%");
        console.log(
          quantityIndex,
          individualDiscountIndex,
          totalDiscountIndex,
          DiscountIndex
        );
        if (quantityIndex !== -1) {
          customText.splice(quantityIndex, 1, `${String(quantity)}`);
        }

        if (individualDiscountIndex !== -1) {
          customText.splice(
            individualDiscountIndex,
            1,
            `${shopifyCurrency}${String(
              Math.round(discountedTotal / quantity)
            )}`
          );
        }
        if (totalDiscountIndex !== -1) {
          customText.splice(
            totalDiscountIndex,
            1,
            `${shopifyCurrency}${String(discountedTotal)}`
          );
        }
        if (DiscountIndex !== -1) {
          customText.splice(DiscountIndex, 1, `${String(discountPercentage)}%`);
        }
        console.log(customText.join(" "));

        p = `<p style="color: ${
          user.discountStyle[0].PricetextColor || "#7f818c"
        }; font-weight: 400; font-size: ${
          String(user.discountStyle[0].PricetextSize) || "18"
        }px">
                 ${customText.join(" ")}
                      </p>`;
      }

      tierData.push(p);
    }

    //BuyXgetY Ptags
    function createBP1Tag(quantity1, quantity2, product, discountValue) {
      if (discountValue === "100") {
        for (let i = 0; i < quantity2.length; i++) {
          let p = `<div style="padding-bottom: 1em">
        <p style="color: ${
          user.discountStyle[0].PricetextColor || "#006e5a"
        }; font-size: 0.8em; font-weight: 600">
          Buy ${String(quantity1)} and get ${String(quantity2[i])} ${
            product[i]
          } <span style="color: ${
            user.discountStyle[0].PricetextColor2 || "#f17157"
          };">free</span>
        </p>
      </div>`;
          tierData.push(p);
        }
      } else {
        for (let i = 0; i < quantity2.length; i++) {
          let p = `<div style="padding-bottom: 1em">
        <p style="color: ${
          user.discountStyle[0].PricetextColor || "#006e5a"
        }; font-size: 0.8em; font-weight: 600">
          Buy ${String(quantity1)} and get <span style="color: ${
            user.discountStyle[0].PricetextColor2 || "#f17157"
          };">${discountValue}%</span>  discount on ${quantity2[i]} ${
            product[i]
          }
        </p>
      </div>`;
          tierData.push(p);
        }
      }
    }
    function createBP2Tag(quantity1, quantity2, product, discountValue) {
      if (discountValue === "100") {
        for (let i = 0; i < quantity2.length; i++) {
          let p = `<p style="font-weight:700;color:${
            user.discountStyle[0].PricetextColor || "black"
          }">
                    Buy ${String(quantity1)} and get ${quantity2[i]} ${
            product[i]
          } free 
                        </p>`;
          tierData.push(p);
        }
      } else {
        for (let i = 0; i < quantity2.length; i++) {
          let p = `<p style="font-weight:700;color:${
            user.discountStyle[0].PricetextColor || "black"
          }">
                    Buy ${String(
                      quantity1
                    )} and get ${discountValue}% discount on ${quantity2[i]} ${
            product[i]
          }
                        </p>`;
          tierData.push(p);
        }
      }
    }

    function createBP3Tag(quantity1, quantity2, product, discountValue) {
      if (discountValue === "100") {
        for (let i = 0; i < quantity2.length; i++) {
          let p = `<p style="color: ${
            user.discountStyle[0].PricetextColor || "#7f818c"
          }; font-weight: 400; font-size: ${
            String(user.discountStyle[0].PricetextSize) || "18"
          }px">
    Buy ${String(quantity1)} and get ${quantity2[i]} ${product[i]} <span
      style="
        color: ${user.discountStyle[0].PricetextColor2 || "#ff915a"};
        font-weight: 600;
        font-size: ${String(user.discountStyle[0].PricetextSize2) || "18"}px;
        padding-left: 0.5em;
      "
      >free</span>
    `;
          tierData.push(p);
        }
      } else {
        for (let i = 0; i < quantity2.length; i++) {
          let p = `<p style="color: ${
            user.discountStyle[0].PricetextColor || "#7f818c"
          }; font-weight: 400; font-size:  ${
            String(user.discountStyle[0].PricetextSize) || "18"
          }px">
    Buy ${String(quantity1)} and get <span
      style="
        color:${user.discountStyle[0].PricetextColor2 || "#ff915a"};
        font-weight: 600;
        font-size: ${String(user.discountStyle[0].PricetextSize2) || "18"}px;
        padding-left: 0.5em;
      "
      >(${discountValue}% OFF)</span> discount on ${quantity2[i]} ${product[i]}
    `;
          tierData.push(p);
        }
      }
    }

    let widgetNumber = parseInt(user.widgetNumber);
    console.log(typeof widgetNumber);
    // let widgetNumber = 1;
    console.log(applicablePriceRules.length > 0);
    if (applicablePriceRules.length > 0) {
      applicablePriceRules.forEach((each) => {
        switch (widgetNumber) {
          case 1:
            createP1Tag(
              each.quantity,
              variantPrice,
              each.discount,
              each.discountType
            );
            break;
          case 2:
            createP2Tag(
              each.quantity,
              variantPrice,
              each.discount,
              each.discountType
            );
            break;
          case 3:
            createP3Tag(
              each.quantity,
              variantPrice,
              each.discount,
              each.discountType
            );
            break;
          default:
        }
      });
    }

    if (applicableBuyXGetY.length > 0) {
      applicableBuyXGetY.forEach((each) => {
        let productsArray = [];
        let quantityArray = [];
        console.log(each.yProduct);
        each.yProduct.forEach((product) => {
          productsArray.push(product.title);
          quantityArray.push(parseInt(product.quantity));
        });
        switch (widgetNumber) {
          case 1:
            createBP1Tag(
              each.quantity,
              quantityArray,
              productsArray,
              each.yDiscountValue
            );
            break;
          case 2:
            createBP2Tag(
              each.quantity,
              quantityArray,
              productsArray,
              each.yDiscountValue
            );
            break;
          case 3:
            createBP3Tag(
              each.quantity,
              quantityArray,
              productsArray,
              each.yDiscountValue
            );
            break;
          default:
        }
      });
    }

    console.log(tierData.join(" "));

    let widgetHTML;
    switch (widgetNumber) {
      case 1:
        widgetHTML = `
        <div
  style="
    padding: 2em 0.1em 1em;
    border: ${String(user.discountStyle[0].PriceborderWidth)}px ${
          user.discountStyle[0].PriceborderStyle
        } ${user.discountStyle[0].PriceborderColor};
    text-align: center;
    width: fit-content;
    border-radius: ${String(user.discountStyle[0].PriceborderRadius)}px;
    position: relative;
    margin-top:1em;
    margin-bottom: 1em;
    background-color:${user.discountStyle[0].PricebackGroundColor}
  "
  id="Variant 1"
>
  <span
    style="
      background-color: ${user.discountStyle[0].backGroundColor || "#006e5a"};
      color: ${user.discountStyle[0].textColor || "white"};
      font-size: small;
      padding: 0.7em;
      position: absolute;
      top: -2em;
      left: 26%;
      border: ${String(user.discountStyle[0].borderWidth) || "4"}px ${
          user.discountStyle[0].borderStyle || "solid"
        } #fff;
      border-radius: ${String(user.discountStyle[0].borderRadius) || "10"}px;
      font-weight: 500;
    "
    >${user.discountStyle[0].tierMessage}</span
  >
  ${tierData.join(" ")}
  <p style="color:grey;font-size:small">(Kindly add the items in cart for applicable discount)</p>
  
</div>
`;
        break;
      case 2:
        widgetHTML = `
        <div
  style="
    width: fit-content;
    
    margin-top: 1em;
  "
>
  <div
    style="padding: 1em 1em; text-align: left; border: ${
      String(user.discountStyle[0].borderWidth) || "1"
    }px ${user.discountStyle[0].borderStyle || "solid"}
   ${user.discountStyle[0].borderColor || "white"};background-color: ${
          user.discountStyle[0].backGroundColor || "#f1f2f2"
        };color:${user.discountStyle[0].textColor};border-radius:${
          String(user.discountStyle[0].borderRadius) || "0"
        }px"
  >
    <p style="font-weight: 700;color:${
      user.discountStyle[0].textColor || "white"
    }">${user.discountStyle[0].tierMessage}:</p>
  </div>
  <div style="padding: 1em 1em; text-align: center;border: ${
    String(user.discountStyle[0].PriceborderWidth) || "1"
  }px ${user.discountStyle[0].PriceborderStyle || "solid"}
   ${user.discountStyle[0].PriceborderColor || "#707e8c"};background-color: ${
          user.discountStyle[0].PricebackGroundColor || "#f1f2f2"
        };border-radius:${
          String(user.discountStyle[0].PriceborderRadius) || "0"
        }px">
    ${tierData.join(" ")}
      <p style="color:grey;font-size:small">(Kindly add the items in cart for applicable discount or free)</p>
  </div>
</div>
`;
        break;
      case 3:
        widgetHTML = `
        <div id="Variant 3" style="margin-top: 1em">
        Offers: 
  ${tierData.join(" ")}
    <p style="color:grey;font-size:small">(Kindly add the items in cart for applicable discount or free)</p>
</div>
`;
        break;

      default:
    }

    console.log(widgetHTML);

    if (applicablePriceRules.length > 0 || applicableBuyXGetY.length > 0) {
      if (user.widgetLocation.location === "Below") {
        node.insertAdjacentHTML("afterend", widgetHTML);
      } else if (user.widgetLocation.location === "Above") {
        node.insertAdjacentHTML("beforebegin", widgetHTML);
      }
    }
  }

  function renderAjaxCart(page) {
    async function getCartData() {
      let data = await fetch("/cart.js");
      data = await data.json();
      return data;
      //   .then((response) => response.json())
      //   .then((data) => {
      //     //   console.log(data);
      //       return data;
      //   });
    }
    let cart = getCartData();
    cart.then((response) => {
      let cartData = response;
      console.log(cartData);

      let cartButton = document.querySelector('a[href="/cart"]');
      
      cartButton.addEventListener("click", () => {

        setTimeout(() => {
          var checkoutButton;
          var inputArray;
          var products_Individual_Price_Array = [];
          var products_Individual_TotalPrice_Array = [];

          let products = [];

          // let shopifyThemeId = Shopify.theme.theme_store_id;
          // let shopifyCurrency = Shopify.currency.active;
          // let shopDomain = "super-assistant";
          // let hostedUrl = "https://app1.superassistant.io"; //backend url
          // let frontendUrl = "https://app.superassistant.io"; //frontend url

          // let user = {
          //   widgetLocation: {
          //     div: {
          //       className: [],
          //       attribute: [],
          //     },
          //   },
          //   individualProductLocation: {
          //     className: [],
          //     attribute: [],
          //   },
          //   productTotalLocation: {
          //     className: [],
          //     attribute: [],
          //   },
          //   cartSubTotalLocation: {
          //     className: [],
          //     attribute: [],
          //   },
          //   ajaxLocations: {
          //     individualProduct_Ajax_Location: {
          //       className: ["cart-item__original-price", "cart-item__price"],
          //       attribute: [],
          //       tagName: "span",
          //     },
          //     productTotal_Ajax_Location: {
          //       className: ["grid__item", "one-half", "text-right"],
          //       attribute: [],
          //       tagName: "div",
          //     },
          //     cartSubTotal_Ajax_Location: {
          //       className: ["cart-drawer__subtotal-number"],
          //       attribute: ["data-cart-subtotal"],
          //       tagName: "span",
          //     },
          //     checkoutButton_Ajax_Location: {
          //       className: ["btn", "btn--loader", "cart-drawer__checkout"],
          //       tagName: "button",
          //     },
          //   },
          //   Customtemplate: {
          //     location: {
          //       individualPrice: true,
          //       totalPrice: true,
          //       subtotalPrice: true,
          //     },
          //     showCustomTemplate: true,
          //     template: "Save :diff",
          //   },
          //   tierDescription: {
          //     templateType: "BuyQforE",
          //     customText: "",
          //   },
          //   draftOrdersCreated: {
          //     buyXgetY: [],
          //     priceRule: ["842515284139"],
          //   },
          //   chargeId: "22358327467",
          //   paymentDone: true,
          //   isThemeUpdated: false,
          //   hasAjaxCart: true,
          //   discountStyle: [],
          //   generated_orders: [],
          //   _id: "608a5425c6f31330b8e6006f",
          //   name: "super-assistant",
          //   email: "varunshinde.10601@gmail.com",
          //   access_token: "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",
          //   myShopifyDomain: "super-assistant.myshopify.com",
          //   discount: [
          //     {
          //       productIds: [39484974792875],
          //       title: "test offer",
          //       priceRule: [
          //         {
          //           discount: 10,
          //           quantity: 2,
          //           discountType: "INR",
          //           tagName: "HOODIESALE",
          //         },
          //       ],
          //       targetSelection: "entitled",
          //       enable: true,
          //       buyXgetY: [],
          //     },
          //   ],
          //   createdAt: "2021-04-29T06:37:25.232Z",
          //   updatedAt: "2021-05-10T14:59:34.802Z",
          //   __v: 0,
          // };

          // let discounts = user.discount;

          //buyXgetY popup div

          // fetch(`${hostedUrl}/userData`, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({
          //     username: shopDomain,
          //   }), // body data type must match "Content-Type" header
          // })
          //   .then((response) => response.json())
          //   .then((user) => {
          //     console.log(user.data[0].discount);
          //     discounts.push(user.data[0].discount);
          //   });
          // console.log(discounts);
          // let Discounts = [
          //   {
          //     _id: "60796cccba0b1d32d8101d47",
          //     id: 0.7252650572965804,

          //     title: "Hoodie Sale",
          //     priceRule: [
          //       {
          //         discount: 30,
          //         quantity: 2,
          //         discountType: "INR",
          //         tagName: "HOODIESALE30OFF",
          //       },
          //       {
          //         discount: 50,
          //         quantity: 3,
          //         discountType: "INR",
          //         tagName: "HOODIESALE50OFF",
          //       },
          //     ],
          //     buyXgetY: [],
          //     targetSelection: "entitled",
          //     productIds: [39484974792875],
          //     enable: true,
          //   },
          // ];

          console.log(discounts);

          function findPriceRule(quantity, productId) {
            // let applicableDiscount = "0";
            // let discountType = "";
            let obj = {
              applicableDiscount: 0,
              discountType: "",
            };
            discounts.forEach((discount) => {
              if (discount.enable) {
                if (discount.productIds.indexOf(productId) !== -1) {
                  // console.log(discount);
                  for (let i = 0; i < discount.priceRule.length; i++) {
                    if (discount.priceRule[i].quantity === quantity) {
                      // console.log(discount.PriceRules[i]);
                      obj.applicableDiscount = discount.priceRule[i].discount;
                      obj.discountType = discount.priceRule[i].discountType;
                    }
                  }
                }
              }
            });
            return obj;
          }

          function findBuyXgetY(quantity, productId) {
            let obj = {
              applicableDiscount: 0,
              XproductId: 0,
              XproductName: "",
              YproductId: [],
              YproductName: [],
            };
            discounts.forEach((discount) => {
              if (discount.enable) {
                if (discount.productIds.indexOf(productId) !== -1) {
                  // console.log(discount);
                  for (let i = 0; i < discount.buyXgetY.length; i++) {
                    if (discount.buyXgetY[i].quantity === quantity) {
                      // console.log(discount.PriceRules[i]);
                      obj.applicableDiscount =
                        discount.buyXgetY[i].yDiscountValue;
                      obj.XproductId = productId;
                      discount.buyXgetY[i].yProduct.forEach((each) => {
                        obj.YproductId.push(each.id);
                        obj.YproductName.push(each.title);
                      });
                      cartData.items.forEach((item) => {
                        if (item.variant_id === productId) {
                          obj.XproductName = item.title;
                          return;
                        }
                      });
                    }
                  }
                }
              }
            });
            return obj;
          }

          // console.log(findBuyXgetY(1, 39414727180486));
          // console.log(findBuyXgetY(1, 39414728392902));

          // console.log(findPriceRule(2, 39414728392902));

          // console.log(findPriceRule(3, 39414727180486));

          console.log(user);

          function attributesCombine(arr) {
            let attribute = [];
            for (let i = 0; i < arr.length; i++) {
              attribute.push(`[${arr[i]}]`);
            }
            return attribute.join("");
          }
          function classesCombine(arr) {
            let classes = [];
            for (let i = 0; i < arr.length; i++) {
              classes.push(`.${arr[i]}`);
            }
            return classes.join("");
          }

          var subTotal_Location;
          if (user.ajaxLocations.cartSubTotal_Ajax_Location.tagName !== "") {
            if (
              user.ajaxLocations.cartSubTotal_Ajax_Location.attribute.length !==
                0 &&
              user.ajaxLocations.cartSubTotal_Ajax_Location.className.length !==
                0
            ) {
              let attribute = attributesCombine(
                user.ajaxLocations.cartSubTotal_Ajax_Location.attribute
              );
              let classes = classesCombine(
                user.ajaxLocations.cartSubTotal_Ajax_Location.className
              );
              console.log(
                `${user.ajaxLocations.cartSubTotal_Ajax_Location.tagName}${attribute}${classes}`
              );
              subTotal_Location = document.querySelector(
                `${user.ajaxLocations.cartSubTotal_Ajax_Location.tagName}${attribute}${classes}`
              );
            } else if (
              user.ajaxLocations.cartSubTotal_Ajax_Location.attribute.length ===
                0 &&
              user.ajaxLocations.cartSubTotal_Ajax_Location.className.length ===
                0
            ) {
              console.log(
                `${user.ajaxLocations.cartSubTotal_Ajax_Location.tagName}`
              );
              const tagsCollection = document.querySelectorAll(
                `${user.ajaxLocations.cartSubTotal_Ajax_Location.tagName}`
              );
              let tempArr = Array.prototype.slice.call(tagsCollection, 0);
              const tagWithNoAttributes = tempArr.find(
                (tag) => tag.attributes.length === 0
              );
              console.log(tagWithNoAttributes);
              subTotal_Location = tagWithNoAttributes;
            } else if (
              user.ajaxLocations.cartSubTotal_Ajax_Location.attribute.length ===
              0
            ) {
              let classes = classesCombine(
                user.ajaxLocations.cartSubTotal_Ajax_Location.className
              );
              console.log(
                `${user.ajaxLocations.cartSubTotal_Ajax_Location.tagName}${classes}`
              );
              subTotal_Location = document.querySelector(
                `${user.ajaxLocations.cartSubTotal_Ajax_Location.tagName}${classes}`
              );
            } else if (
              user.ajaxLocations.cartSubTotal_Ajax_Location.className.length ===
              0
            ) {
              let attribute = attributesCombine(
                user.ajaxLocations.cartSubTotal_Ajax_Location.attribute
              );
              console.log(
                `${user.ajaxLocations.cartSubTotal_Ajax_Location.tagName}${attribute}`
              );
              subTotal_Location = document.querySelector(
                `${user.ajaxLocations.cartSubTotal_Ajax_Location.tagName}${attribute}`
              );
              if (page === "collections") {
                if (shopifyThemeId === 679) {
                  subTotal_Location = document.querySelectorAll(
                    `${user.ajaxLocations.cartSubTotal_Ajax_Location.tagName}${attribute}`
                  );
                  subTotal_Location =
                    subTotal_Location[subTotal_Location.length - 1];
                }
              }
            }
          }

          console.log(subTotal_Location);
          // if (user.cartSubTotalLocation.tagName !== "") {
          //   if (user.cartSubTotalLocation.attribute.length === 0) {
          // subTotal_Location = document.querySelector(`${user.cartSubTotalLocation.tagName}.${user.cartSubTotalLocation.className[0]}`);

          //   } else if (user.cartSubTotalLocation.className.length === 0) {
          // subTotal_Location = document.querySelector(`${user.cartSubTotalLocation.tagName}[${user.cartSubTotalLocation.attribute[0]}]`);

          //   } else {
          //     subTotal_Location = document.querySelector(`${user.cartSubTotalLocation.tagName}[${user.cartSubTotalLocation.attribute[0]}].${user.cartSubTotalLocation.className[0]}`);

          //   }
          // }
          // var subTotal_Location = document.querySelector(".cart-subtotal__price");

          const config = { attributes: true, childList: true, subtree: true };

          console.log("reached");
          //Listening to post req changes

          const callback = function (mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            // setTimeout(() => {
            for (const mutation of mutationsList) {
              if (mutation.type === "childList") {
                console.log("A child node has been added or removed.");
                setEventListeners("dd");
                location.reload();
              } else if (mutation.type === "attributes") {
                console.log(
                  "The " + mutation.attributeName + " attribute was modified."
                );
                setEventListeners("dd");
                location.reload();
              }
            }
            // }, 200);
          };

          // Create an observer instance linked to the callback function
          const observer = new MutationObserver(callback);

          if (user.ajaxLocations.checkoutButton_Ajax_Location.tagName !== "") {
            let classes = classesCombine(
              user.ajaxLocations.checkoutButton_Ajax_Location.className
            );
            console.log(
              `${user.ajaxLocations.checkoutButton_Ajax_Location.tagName}${classes}[type="submit"]`
            );
            checkoutButton = document.querySelector(
              `${user.ajaxLocations.checkoutButton_Ajax_Location.tagName}${classes}[type="submit"]`
            );
            if (page === "products") {
              if (shopifyThemeId === 679) {
                checkoutButton = document.querySelectorAll(
                  `${user.ajaxLocations.checkoutButton_Ajax_Location.tagName}${classes}[type="submit"]`
                );
                checkoutButton = checkoutButton[1];
              }
            }
          }

          // if (shopifyThemeId === 796) {
          //   checkoutButton = checkoutButton[0];
          // } else if (shopifyThemeId === 766) {
          //   checkoutButton = checkoutButton[0];
          // } else {
          //   checkoutButton = checkoutButton[1];
          // }

          inputArray = document.querySelectorAll(
            'form[action^="/cart"] [type="number"]'
          );

          if (inputArray.length === 0)
            inputArray = document.querySelectorAll(
              'form[action^="/cart"] [type="text"]'
            );

          if (shopifyThemeId === 796) {
            inputArray = document.querySelectorAll(
              'form[action^="/cart"] [type="text"]'
            );
          }
          // console.log(inputArray);
          //  = document.querySelectorAll(
          //   `${}`
          // );

          if (
            user.ajaxLocations.individualProduct_Ajax_Location.tagName !== ""
          ) {
            if (
              user.ajaxLocations.individualProduct_Ajax_Location.attribute
                .length !== 0 &&
              user.ajaxLocations.individualProduct_Ajax_Location.className
                .length !== 0
            ) {
              let attribute = attributesCombine(
                user.ajaxLocations.individualProduct_Ajax_Location.attribute
              );
              let classes = classesCombine(
                user.ajaxLocations.individualProduct_Ajax_Location.className
              );
              console.log(
                `${user.ajaxLocations.individualProduct_Ajax_Location.tagName}${attribute}${classes}`
              );
              products_Individual_Price_Array = document.querySelectorAll(
                `${user.ajaxLocations.individualProduct_Ajax_Location.tagName}${attribute}${classes}`
              );
            } else if (
              user.ajaxLocations.individualProduct_Ajax_Location.attribute
                .length === 0
            ) {
              let classes = classesCombine(
                user.ajaxLocations.individualProduct_Ajax_Location.className
              );
              console.log(
                `${user.ajaxLocations.individualProduct_Ajax_Location.tagName}${classes}`
              );
              products_Individual_Price_Array = document.querySelectorAll(
                `${user.ajaxLocations.individualProduct_Ajax_Location.tagName}${classes}`
              );
            } else if (
              user.ajaxLocations.individualProduct_Ajax_Location.className
                .length === 0
            ) {
              let attribute = attributesCombine(
                user.ajaxLocations.individualProduct_Ajax_Location.attribute
              );
              console.log(
                `${user.ajaxLocations.individualProduct_Ajax_Location.tagName}${attribute}`
              );
              products_Individual_Price_Array = document.querySelectorAll(
                `${user.ajaxLocations.individualProduct_Ajax_Location.tagName}${attribute}`
              );
            }
          }

          // products_Individual_Price_Array = document.querySelectorAll(
          //   "dd[data-cart-item-regular-price]"
          // );

          if (user.ajaxLocations.productTotal_Ajax_Location.tagName !== "") {
            if (
              user.ajaxLocations.productTotal_Ajax_Location.attribute.length !==
                0 &&
              user.ajaxLocations.productTotal_Ajax_Location.className.length !==
                0
            ) {
              let attribute = attributesCombine(
                user.ajaxLocations.productTotal_Ajax_Location.attribute
              );
              let classes = classesCombine(
                user.ajaxLocations.productTotal_Ajax_Location.className
              );
              console.log(
                `${user.ajaxLocations.productTotal_Ajax_Location.tagName}${attribute}${classes}`
              );
              products_Individual_TotalPrice_Array = document.querySelectorAll(
                `${user.ajaxLocations.productTotal_Ajax_Location.tagName}${attribute}${classes}`
              );
            } else if (
              user.ajaxLocations.productTotal_Ajax_Location.attribute.length ===
              0
            ) {
              let classes = classesCombine(
                user.ajaxLocations.productTotal_Ajax_Location.className
              );
              console.log(
                `${user.ajaxLocations.productTotal_Ajax_Location.tagName}${classes}`
              );
              products_Individual_TotalPrice_Array = document.querySelectorAll(
                `${user.ajaxLocations.productTotal_Ajax_Location.tagName}${classes}`
              );
            } else if (
              user.ajaxLocations.productTotal_Ajax_Location.className.length ===
              0
            ) {
              let attribute = attributesCombine(
                user.ajaxLocations.productTotal_Ajax_Location.attribute
              );
              console.log(
                `${user.ajaxLocations.productTotal_Ajax_Location.tagName}${attribute}`
              );
              products_Individual_TotalPrice_Array = document.querySelectorAll(
                `${user.ajaxLocations.productTotal_Ajax_Location.tagName}${attribute}`
              );
            }
          }

          if (products_Individual_Price_Array.length > cartData.items.length) {
            console.log(products_Individual_Price_Array);
            let tempArr = Array.prototype.slice.call(
              products_Individual_Price_Array,
              0
            );
            if (tempArr.length % 2 !== 0) tempArr.pop();
            console.log(tempArr);
            products_Individual_Price_Array = [];
            products_Individual_TotalPrice_Array = [];
            for (let i = 0; i < tempArr.length; i++) {
              if (i % 2 === 0) {
                products_Individual_Price_Array.push(tempArr[i]);
              } else {
                products_Individual_TotalPrice_Array.push(tempArr[i]);
              }
            }
          }

          console.log(products_Individual_Price_Array);
          console.log(products_Individual_TotalPrice_Array);
          // products_Individual_TotalPrice_Array = document.querySelectorAll(
          //   `span[data-cart-item-regular-price]`
          // );

          // console.log(String(checkoutButton));

          //  product_Title_array = document.querySelectorAll(
          //    'form[action^="/cart"] a[data-cart-item-title]'
          //  );

          //  product_images = document.querySelectorAll(
          //    'form[action^="/cart"] img[data-cart-item-image]'
          //  );
          //

          //Product Listing
          let arr = Array.prototype.slice.call(inputArray, 0);
          console.log(shopifyThemeId);
          if (shopifyThemeId === 796) {
            for (let i = -1; i < arr.length - 1; i++) {
              arr.splice(i + 1, 1);
            }
          }

          console.log(arr);

          for (let i = 0; i < arr.length; i++) {
            // var id = arr[i].id.split("_");
            // let productId = id[id.length - 1].split(":")[0];
            let productId = cartData.items[i].id;
            let productTitle = cartData.items[i].title;
            let productImage = cartData.items[i].image;
            let priceDiv = "not-found";
            if (products_Individual_Price_Array.length !== 0) {
              priceDiv = products_Individual_Price_Array[i];
            }

            let totalDiv = "not-found";
            if (products_Individual_TotalPrice_Array.length !== 0) {
              totalDiv = products_Individual_TotalPrice_Array[i];
            }

            // productPrice = String(
            //   parseInt(
            //     products_Individual_TotalPrice_Array[i].innerText
            //       .split(" ")[1]
            //       .replace(/,/g, "")
            //   ) / parseInt(arr[i].value.replace(/,/g, ""))
            // );

            let obj = {
              productName: productTitle,
              productId: productId,
              productImage: productImage,
              originalProductQuantity: String(cartData.items[i].quantity),
              // price: products_Individual_Price_Array[i].innerText.split(" ")[1],
              price: String(cartData.items[i].price / 100),
              priceDiv: priceDiv,
              totalPrice: String(
                (cartData.items[i].price / 100) * cartData.items[i].quantity
              ),
              totalPriceDiv: totalDiv,
              inputDiv: arr[i],
            };
            products.push(obj);
          }

          function createPtag(discountValue, YproductName) {
            let p = `You are eligible for a discount of ${discountValue}% off on ${YproductName}`;
            return p;
          }

          function setEventListeners(totalPriceTag) {
            if (
              user.ajaxLocations.checkoutButton_Ajax_Location.tagName !== ""
            ) {
              let classes = classesCombine(
                user.ajaxLocations.checkoutButton_Ajax_Location.className
              );
              checkoutButton = document.querySelector(
                `${user.ajaxLocations.checkoutButton_Ajax_Location.tagName}${classes}[type="submit"]`
              );
              if (page === "products") {
                if (shopifyThemeId === 679) {
                  checkoutButton = document.querySelectorAll(
                    `${user.ajaxLocations.checkoutButton_Ajax_Location.tagName}${classes}[type="submit"]`
                  );
                  checkoutButton = checkoutButton[1];
                }
              }

              // if (shopifyThemeId === 796) {
              //   checkoutButton = checkoutButton[0];
              // } else {
              //   checkoutButton = checkoutButton[1];
              // }

              // console.log(checkoutButton);

              inputArray = document.querySelectorAll(
                'form[action^="/cart"] [type="number"]'
              );

              if (inputArray.length === 0)
                inputArray = document.querySelectorAll(
                  'form[action^="/cart"] [type="text"]'
                );

              // products_Individual_Price_Array = document.querySelectorAll(
              //   "dd[data-cart-item-regular-price]"
              // );
              if (
                user.ajaxLocations.individualProduct_Ajax_Location.tagName !==
                ""
              ) {
                if (
                  user.ajaxLocations.individualProduct_Ajax_Location.attribute
                    .length !== 0 &&
                  user.ajaxLocations.individualProduct_Ajax_Location.className
                    .length !== 0
                ) {
                  let attribute = attributesCombine(
                    user.ajaxLocations.individualProduct_Ajax_Location.attribute
                  );
                  let classes = classesCombine(
                    user.ajaxLocations.individualProduct_Ajax_Location.className
                  );
                  console.log(
                    `${user.ajaxLocations.individualProduct_Ajax_Location.tagName}${attribute}${classes}`
                  );
                  products_Individual_Price_Array = document.querySelectorAll(
                    `${user.ajaxLocations.individualProduct_Ajax_Location.tagName}${attribute}${classes}`
                  );
                } else if (
                  user.ajaxLocations.individualProduct_Ajax_Location.attribute
                    .length === 0
                ) {
                  let classes = classesCombine(
                    user.ajaxLocations.individualProduct_Ajax_Location.className
                  );
                  console.log(
                    `${user.ajaxLocations.individualProduct_Ajax_Location.tagName}${classes}`
                  );
                  products_Individual_Price_Array = document.querySelectorAll(
                    `${user.ajaxLocations.individualProduct_Ajax_Location.tagName}${classes}`
                  );
                } else if (
                  user.ajaxLocations.individualProduct_Ajax_Location.className
                    .length === 0
                ) {
                  let attribute = attributesCombine(
                    user.ajaxLocations.individualProduct_Ajax_Location.attribute
                  );
                  console.log(
                    `${user.ajaxLocations.individualProduct_Ajax_Location.tagName}${attribute}`
                  );
                  products_Individual_Price_Array = document.querySelectorAll(
                    `${user.ajaxLocations.individualProduct_Ajax_Location.tagName}${attribute}`
                  );
                }
              }

              // products_Individual_TotalPrice_Array = document.querySelectorAll(
              //   `${totalPriceTag}[data-cart-item-regular-price]`
              // );
              if (
                user.ajaxLocations.productTotal_Ajax_Location.tagName !== ""
              ) {
                if (
                  user.ajaxLocations.productTotal_Ajax_Location.attribute
                    .length !== 0 &&
                  user.ajaxLocations.productTotal_Ajax_Location.className
                    .length !== 0
                ) {
                  let attribute = attributesCombine(
                    user.ajaxLocations.productTotal_Ajax_Location.attribute
                  );
                  let classes = classesCombine(
                    user.ajaxLocations.productTotal_Ajax_Location.className
                  );
                  console.log(
                    `${user.ajaxLocations.productTotal_Ajax_Location.tagName}${attribute}${classes}`
                  );
                  products_Individual_TotalPrice_Array =
                    document.querySelectorAll(
                      `${user.ajaxLocations.productTotal_Ajax_Location.tagName}${attribute}${classes}`
                    );
                } else if (
                  user.ajaxLocations.productTotal_Ajax_Location.attribute
                    .length === 0
                ) {
                  let classes = classesCombine(
                    user.ajaxLocations.productTotal_Ajax_Location.className
                  );
                  console.log(
                    `${user.ajaxLocations.productTotal_Ajax_Location.tagName}${classes}`
                  );
                  products_Individual_TotalPrice_Array =
                    document.querySelectorAll(
                      `${user.ajaxLocations.productTotal_Ajax_Location.tagName}${classes}`
                    );
                } else if (
                  user.ajaxLocations.productTotal_Ajax_Location.className
                    .length === 0
                ) {
                  let attribute = attributesCombine(
                    user.ajaxLocations.productTotal_Ajax_Location.attribute
                  );
                  console.log(
                    `${user.ajaxLocations.productTotal_Ajax_Location.tagName}${attribute}`
                  );
                  products_Individual_TotalPrice_Array =
                    document.querySelectorAll(
                      `${user.ajaxLocations.productTotal_Ajax_Location.tagName}${attribute}`
                    );
                }
              }

              if (
                products_Individual_Price_Array.length > cartData.items.length
              ) {
                console.log(products_Individual_Price_Array);
                let tempArr = Array.prototype.slice.call(
                  products_Individual_Price_Array,
                  0
                );
                if (tempArr.length % 2 !== 0) tempArr.pop();
                console.log(tempArr);
                products_Individual_Price_Array = [];
                products_Individual_TotalPrice_Array = [];
                for (let i = 0; i < tempArr.length; i++) {
                  if (i % 2 === 0) {
                    products_Individual_Price_Array.push(tempArr[i]);
                  } else {
                    products_Individual_TotalPrice_Array.push(tempArr[i]);
                  }
                }
              }

              console.log("individual" + products_Individual_Price_Array);
              console.log("total" + products_Individual_TotalPrice_Array);

              // console.log(String(checkoutButton));

              //  product_Title_array = document.querySelectorAll(
              //    'form[action^="/cart"] a[data-cart-item-title]'
              //  );

              //  product_images = document.querySelectorAll(
              //    'form[action^="/cart"] img[data-cart-item-image]'
              //  );

              // Later, you can stop observing
              observer.disconnect();

              //subtotal
              console.log(products);

              let subTotal = 0;
              let discountTotal = 0;
              let individualProductDiscount = [];
              let productTotalDiscount = [];
              let buyXgetYDiscounts = [];
              products.forEach((each) => {
                let productTotal =
                  parseInt(each.originalProductQuantity) * parseInt(each.price);
                // console.log(productTotal);
                subTotal += productTotal;
                let discountObj = findPriceRule(
                  parseInt(each.originalProductQuantity),
                  parseInt(each.productId)
                );
                console.log(discountObj);
                let discount;
                if (discountObj.discountType === "%") {
                  discount = discountObj.applicableDiscount;
                  let calculatedDiscount =
                    (discount / 100) * parseInt(each.price);
                  let individualPrice =
                    parseInt(each.price) - calculatedDiscount;
                  individualProductDiscount.push(individualPrice);
                  console.log(
                    individualPrice * parseInt(each.originalProductQuantity)
                  );
                  let productTotalPrice =
                    individualPrice * parseInt(each.originalProductQuantity);
                  productTotalDiscount.push(productTotalPrice);
                  if (discount !== 0) {
                    discountTotal +=
                      calculatedDiscount *
                      parseInt(each.originalProductQuantity);
                  }
                } else {
                  discount = discountObj.applicableDiscount;
                  discount = discount * parseInt(each.originalProductQuantity);
                  console.log(discount);
                  // console.log(discount);
                  let individualPrice =
                    (productTotal - parseInt(discount)) /
                    each.originalProductQuantity;
                  individualProductDiscount.push(individualPrice);
                  // console.log(parseInt(discount) * 2);
                  let productTotalPrice = productTotal - parseInt(discount);
                  productTotalDiscount.push(productTotalPrice);
                  if (discount !== "0") {
                    discountTotal += discount;
                  }
                }

                //buyXgetY
                let buyXgetY = findBuyXgetY(
                  parseInt(each.originalProductQuantity),
                  parseInt(each.productId)
                );
                if (buyXgetY.applicableDiscount !== 0) {
                  buyXgetYDiscounts.push(buyXgetY);
                }
              });

              let customTemplate = user.Customtemplate.template;
              console.log(customTemplate);

              console.log(subTotal, discountTotal);
              console.log(individualProductDiscount);
              console.log(productTotalDiscount);
              let discountedSubtotal = subTotal - discountTotal;
              console.log(discountedSubtotal);
              console.log("heyy");

              if (user.Customtemplate.showCustomTemplate) {
                if (user.Customtemplate.location.subtotalPrice) {
                  // (true)
                  let savedPrice = String(
                    Math.round(subTotal - discountedSubtotal)
                  );
                  let startIndex = customTemplate.search(":diff");
                  let subtotalSave = customTemplate.split("");
                  console.log(subtotalSave);
                  subtotalSave.splice(
                    startIndex,
                    5,
                    `${shopifyCurrency}.${savedPrice}`
                  );
                  console.log(subtotalSave.join(""));
                  if (subTotal_Location) {
                    if (discountedSubtotal !== subTotal) {
                      subTotal_Location.innerHTML = `<del style="font-size:0.8em;font-weight:600;color:grey">${shopifyCurrency}. ${String(
                        Math.round(subTotal)
                      )}.00</del><br> <ins style="text-decoration:none">${shopifyCurrency}. ${String(
                        String(Math.round(discountedSubtotal))
                      )}.00</ins><br><span style="color:#ef5e64;font-weight:600">${subtotalSave.join(
                        ""
                      )}</span>`;
                    } else {
                      subTotal_Location.innerHTML = `<ins style="text-decoration:none">${shopifyCurrency}. ${String(
                        String(subTotal)
                      )}.00</ins>`;
                    }
                  }
                }
              }

              if (user.Customtemplate.showCustomTemplate) {
                if (user.Customtemplate.location.individualPrice) {
                  // (true)
                  for (let i = 0; i < individualProductDiscount.length; i++) {
                    let savedPrice = String(
                      parseInt(products[i].price) -
                        Math.round(individualProductDiscount[i])
                    );
                    let startIndex = customTemplate.search(":diff");
                    let IndividualSave = customTemplate.split("");
                    console.log(IndividualSave);
                    IndividualSave.splice(
                      startIndex,
                      5,
                      `${shopifyCurrency}.${savedPrice}`
                    );
                    console.log(IndividualSave.join(""));
                    if (products[i].priceDiv) {
                      if (
                        individualProductDiscount[i] !==
                        parseInt(products[i].price)
                      ) {
                        products[
                          i
                        ].priceDiv.innerHTML = `<del style="font-size:0.8em;font-weight:600;color:grey">${shopifyCurrency}. ${
                          products[i].price
                        }.00</del> <br><ins style="text-decoration:none">${shopifyCurrency}. ${String(
                          String(Math.round(individualProductDiscount[i]))
                        )}.00</ins><br><span style="color:#ef5e64;font-weight:600">${IndividualSave.join(
                          ""
                        )}</span>
                `;
                      }
                    }
                  }
                }
              }

              if (user.Customtemplate.showCustomTemplate) {
                if (user.Customtemplate.location.totalPrice) {
                  for (let i = 0; i < productTotalDiscount.length; i++) {
                    let originalTotal =
                      parseInt(products[i].originalProductQuantity) *
                      parseInt(products[i].price);
                    console.log(
                      products[i].originalProductQuantity,
                      products[i].price
                    );
                    console.log(productTotalDiscount[i]);
                    let savedPrice = String(
                      originalTotal - Math.round(productTotalDiscount[i])
                    );
                    let startIndex = customTemplate.search(":diff");
                    let totalSave = customTemplate.split("");
                    console.log(totalSave);
                    totalSave.splice(
                      startIndex,
                      5,
                      `${shopifyCurrency}.${savedPrice}`
                    );
                    console.log(totalSave.join(""));
                    if (products[i].totalPriceDiv) {
                      if (productTotalDiscount[i] !== originalTotal) {
                        products[
                          i
                        ].totalPriceDiv.innerHTML = `<del style="font-size:0.8em;font-weight:600;color:grey">${shopifyCurrency}. ${String(
                          originalTotal
                        )}.00</del><br> <ins style="text-decoration:none">${shopifyCurrency}. ${String(
                          String(Math.round(productTotalDiscount[i]))
                        )}.00</ins><br><span style="color:#ef5e64;font-weight:600">${totalSave.join(
                          ""
                        )}</span>`;
                      }
                    }
                  }
                }
              }

              //Buy X get Y Popup
              let modalDiv = document.createElement("div");
              modalDiv.style.width = "fit-content";
              modalDiv.style.padding = "1em";
              modalDiv.style.position = "absolute";
              modalDiv.style.left = "0";
              modalDiv.style.right = "0";
              modalDiv.style.marginLeft = "auto";
              modalDiv.style.marginRight = "auto";
              modalDiv.style.top = "3%";
              modalDiv.style.zIndex = "99999";
              modalDiv.style.background = "#f4f6f8";
              modalDiv.style.border = "1px solid #bec0c2";
              modalDiv.style.borderRadius = "4px";
              let p = document.createElement("p");
              let buttonsDiv = document.createElement("div");
              buttonsDiv.style.textAlign = "right";
              let saveButton = document.createElement("button");
              saveButton.innerText = "OK";
              //   saveButton.style.marginLeft = "0.7em";
              saveButton.style.background = "#337CA0";
              saveButton.style.padding = "0.2em 1em";
              saveButton.style.color = "white";
              saveButton.style.border = "1px solid grey";
              saveButton.style.borderRadius = "14px";
              saveButton.style.float = "right";
              saveButton.onclick = () => {
                modalDiv.style.display = "none";
              };
              //   let clearButton = document.createElement("button");
              //   clearButton.innerText = "Clear";
              //   clearButton.style.border = "1px solid grey";
              //   clearButton.style.borderRadius = "4px";

              //   buttonsDiv.appendChild(clearButton);
              buttonsDiv.appendChild(saveButton);
              modalDiv.appendChild(p);
              // modalDiv.appendChild(modalImage);
              modalDiv.appendChild(buttonsDiv);
              modalDiv.style.display = "none";
              document.querySelector("body").appendChild(modalDiv);

              let cartItemIds = [];
              console.log(buyXgetYDiscounts);
              let discountText = [];
              cartData.items.forEach((each) => {
                cartItemIds.push(each.variant_id);
              });
              console.log(cartItemIds);
              for (let i = 0; i < buyXgetYDiscounts.length; i++) {
                console.log(
                  cartItemIds.indexOf(buyXgetYDiscounts[i].XproductId) === -1
                );
                console.log(
                  createPtag(
                    buyXgetYDiscounts[i].applicableDiscount,
                    buyXgetYDiscounts[i].YproductName
                  )
                );
                for (
                  let j = 0;
                  j < buyXgetYDiscounts[i].YproductId.length;
                  j++
                ) {
                  if (
                    cartItemIds.indexOf(buyXgetYDiscounts[i].YproductId[j]) ===
                    -1
                  ) {
                    discountText.push(
                      createPtag(
                        buyXgetYDiscounts[i].applicableDiscount,
                        buyXgetYDiscounts[i].YproductName[j]
                      )
                    );
                  }
                }
              }
              console.log(discountText);
              if (discountText.length > 0) {
                //   alert(
                //     discountText.join("\n") +
                //       "\nKindly add the products in cart to avail the discount."
                //   );
                p.innerText =
                  discountText.join("\n") +
                  "\nKindly add the products in cart to avail the discount.";
                modalDiv.style.display = "block";
              }

              //individualPrice

              function inputEvent(e) {
                var Id = e.target.id.split("_");
                let changedProductId = Id[Id.length - 1].split(":")[0];
                for (let i = 0; i < products.length; i++) {
                  if (products[i].productId === changedProductId) {
                    products[i].originalProductQuantity = e.target.value;
                  }
                }
                console.log(products);

                // setEventListeners("dd");
                // Start observing the target node for configured mutations
                observer.observe(subTotal_Location, config);
              }

              inputArray.forEach((each) => {
                each.addEventListener("input", inputEvent);
              });
              console.log("event listeners set");
            }
          }

          let customCheckoutbutton = document.createElement("button");
          customCheckoutbutton.type = "button";
          customCheckoutbutton.innerText = "Checkout";

          setEventListeners("span");
          // console.log(checkoutButton);

          fetch(`${hostedUrl}/api/test`)
            .then((response) => response.json())
            .then((data) => {
              console.log(data.success);
              if (data.success) {
                console.log("running");
                // console.log(customCheckoutbutton);
                // checkoutButton.attributes[0].value = "button"
                console.log(checkoutButton);
                // checkoutButton.insertAdjacentHTML(
                //   "afterend",
                //   "<button type=button' onclick='alert()'>Checkout</button>"
                // );
                // checkoutButton.style.display = "none"
                console.log(products);

                // function sendData(e) {
                //   alert();
                //   e.preventDefault();
                //   e.stopImmediatePropagation();
                //   console.log("clicked");

                // }
                // checkoutButton.addEventListener('click', () => {
                //   event.stopImmediatePropagation();
                //   console.log(products);
                // });
                // let cloneButton = checkoutButton.cloneNode(true);
                // console.log(cloneButton);
                // checkoutButton.parentNode.replaceChild(cloneButton,checkoutButton)
                checkoutButton.onclick = (e) => {
                  e.preventDefault();
                  async function getCartData() {
                    let data = await fetch("/cart.js");
                    data = await data.json();
                    return data;
                    //   .then((response) => response.json())
                    //   .then((data) => {
                    //     //   console.log(data);
                    //       return data;
                    //   });
                  }
                  let cart = getCartData();
                  cart.then((response) => {
                    response.shopDomain = shopDomain;
                    console.log(response);
                    // axios
                    //   .post(`${hostedUrl}/custom-checkout`, {
                    //     // or 'PUT'
                    //     products,
                    //     shopDomain,
                    //   })
                    //   .then((response) => {
                    //     console.log("Success:", response);
                    //     window.location = response.data.url;
                    //   })
                    //   .catch((error) => {
                    //     console.error("Error:", error);
                    //   });

                    fetch(`${hostedUrl}/custom-checkout`, {
                      method: "POST",
                      // mode: "no-cors",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        response,
                      }), // body data type must match "Content-Type" header
                    })
                      .then((data) => data.json())
                      .then((response) => {
                        console.log("Success:", response);
                        window.location = response.url;
                      });
                  });
                  // console.log(products);

                  // e.stopImmediatePropagation();
                  // e.target.disabled = !0;
                  // e.preventDefault();
                  // axios
                  //   .post(`${hostedUrl}/custom-checkout`, {
                  //     // or 'PUT'
                  //     products,
                  //     shopDomain,
                  //   })
                  //   .then((response) => {
                  //     console.log("Success:", response);
                  //     window.location = response.data.url;
                  //   })
                  //   .catch((error) => {
                  //     console.error("Error:", error);
                  //   });
                  // let data = { username: "example" };
                  // fetch(`${hostedUrl}/custom-checkout`, {
                  //   method: "POST", // or 'PUT'
                  //   headers: {
                  //     "Content-Type": "application/json",
                  //   },
                  //   body: JSON.stringify(data),
                  // })
                  //   .then((response) => response.json())
                  //   .then((data) => {
                  //     console.log("Success:", data);
                  //   })
                  //   .catch((error) => {
                  //     console.error("Error:", error);
                  //   });

                  console.log("clicked");
                };
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }, 2000);
      });
    });
  }
}

async function initTieredPricing() {
  try {
    let temp = await fetch(`${hostedUrl}/api/userData`, {
      method: "POST",
      // mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: shopDomain,
      }), // body data type must match "Content-Type" header
    });
    temp = await temp.json();
    console.log(temp.data[0]);
    user = temp.data[0];
    discounts = temp.data[0].discount;

    console.log(user.Discountenable);

    if (user.Discountenable) {
      const styles = [
        "color: white",
        "background:#45b3e0",
        "font-weight:600",
        "padding:0.3em",
      ].join(";");

      const message = " Ã°Å¸Å½â€°Tiered Discounts by Super Assistant: ready";

      // 3. Using the styles and message variable
      console.log("%c%s", styles, message);

      // let cart = await fetch(
      //   "https://super-assistant-demo2.myshopify.com/cart/cart.js"
      // );
      // cart = await cart.json();
      // console.log(cart);
      console.log('now will run start function');
      startTieredPricing();
    } else {
      const styles = [
        "color: white",
        "background:#45b3e0",
        "font-weight:600",
        "padding:0.3em",
      ].join(";");

      const message = " Ã°Å¸Å½â€°Tiered Discounts by Super Assistant: disabled";

      // 3. Using the styles and message variable
      console.log("%c%s", styles, message);
    }
  } catch (error) {
    console.log(error);
    console.log("app not working");
  }
}

initTieredPricing();
// start();
