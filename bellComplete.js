const s_url = "http://localhost:8080";
 //https://push-notification-backend.superassistant.io



const public_vapid_key =
  "BJfiHyy_qFOmXwlk4ntA7BYLWFSWYDC-5Yv6lD6Di7TwmNwpIcJbtWlyIRwIHIRDgtRtXdh2jtrMEgxaCzVUP9c";


  Notification.requestPermission().then(function (s) {
    if (s === "granted") {
        const url = `https://${Shopify.shop}/apps/super-assistant-push/push-notification/serviceWorker.js`;
        const options = {
          scope: "/apps/super-assistant-push/push-notification/",
        }
        navigator.serviceWorker
          .register(url, options)
          .then(function (registration) {
            console.log(registration)
           
            registration.pushManager.getSubscription()
            .then((subscriptions)=>{
              
              if(subscriptions){
                 console.log(JSON.stringify(subscriptions))
                 send(subscriptions)
              }else{
                subscribe(registration);
              }
            })
           
          })
          .catch(function (t) {
            console.log(t)
          });
        }else{
          console.log("blocked")
        }
    }) 

    function subscribe(registration) {
      // navigator.serviceWorker.ready
      //   .then(async function (registration) {
          // const response = await fetch('./vapidPublicKey');
          const vapidPublicKey =
            "BJfiHyy_qFOmXwlk4ntA7BYLWFSWYDC-5Yv6lD6Di7TwmNwpIcJbtWlyIRwIHIRDgtRtXdh2jtrMEgxaCzVUP9c";
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          })
        //})
        .then(function (subscription) {
          console.log("Subscribed",  JSON.stringify(subscription));
          localStorage.setItem("subscription", JSON.stringify(subscription));
         send(subscription) 
          // return fetch('register', {
          //   method: 'post',
          //   headers: {
          //     'Content-type': 'application/json'
          //   },
          //   body: JSON.stringify({
          //     subscription: subscription
          //   })
          // });
        });
    }

    function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }


 

function include(file) {
  var script = document.createElement("script");
  script.src = file;
  script.type = "text/javascript";
  document.head.appendChild(script);
}

if (location.search) {
  var getParams = function (url) {
    var params = {};
    var parser = document.createElement("a");
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  };
  const obj = getParams(location.href);

  if (obj.utm_campaignType) {
    localStorage.setItem("superAssistant-source", obj.utm_source);
    localStorage.setItem("superAssistant-campaignId", obj.utm_campaignId);
    localStorage.setItem("superAssistant-campaignType", obj.utm_campaignType);
  }
}

///make functions for different pages check///

const at_thank_you_page = () => {
  if (Shopify.checkout) {
    if (Shopify.checkout.created_at) {
      return 1;
    }
  }
};

///If thankyou page visited update db and that particular campaign!///
if (at_thank_you_page()) {
  console.log(
    "On thank You Page!",
    localStorage.getItem("superAssistant-campaignType")
  );

  if (localStorage.getItem("superAssistant-campaignType") === "backInStock") {
    fetch(
      `${s_url}/api/backInStock/updateBackInStockRevenue/${localStorage.getItem(
        "superAssistant-campaignId"
      )}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          revenue: parseFloat(Shopify.checkout.total_price),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => console.log(res));
  }

  if (
    localStorage.getItem("superAssistant-campaignType") === "abandoned_cart"
  ) {
    fetch(
      `${s_url}/api/abandonedCart/updateAbandonedCartRevenueCart/${localStorage.getItem(
        "superAssistant-campaignId"
      )}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          revenue: parseFloat(Shopify.checkout.total_price),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => console.log(res));
  }

  if (localStorage.getItem("superAssistant-campaignType") === "priceDrop") {
    fetch(
      `${s_url}/api/priceDrop/updatePriceDropRevenue/${localStorage.getItem(
        "superAssistant-campaignId"
      )}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          revenue: parseFloat(Shopify.checkout.total_price),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => console.log(res));
  }

  if (
    localStorage.getItem("superAssistant-campaignType") === "regularCampaign"
  ) {
    fetch(
      `${s_url}/api/compaign/updateCampaignRevenue/${localStorage.getItem(
        "superAssistant-campaignId"
      )}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          revenue: parseFloat(Shopify.checkout.total_price),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => console.log(res));
  }
}

//ipaddress
function callback(data) {
  localStorage.setItem("superAssistant-ipInfo", JSON.stringify(data));
  customerInfo = data;
  console.log(data);
}

var script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://geolocation-db.com/jsonp";
var h = document.getElementsByTagName("script")[0];
h.parentNode.insertBefore(script, h);

// fetch("https://geolocation-db.com/jsonp")

const sendBrowserPrompt = () => {
  //allow notification
  console.log("herereerererer");
  if ("serviceWorker" in navigator) {
    send().catch((err) => console.log(err));
  }
};

const checkBrowserPrompt = async () => {
  console.log("here");
  await fetch(`${s_url}/api/settings/getSettings/${Shopify.shop}`)
    .then((res) => res.json())
    .then(async (res) => {
      if (res.data.settings[0].enable) {
        await fetch(`${s_url}/api/optIns/getOptIns/${Shopify.shop}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        })
          .then((res) => res.json())
          .then((res) => {
            const data = res.data.optIns[0];
            const time = data.timings.desktop;
            if (data.browserPrompt) {
              setTimeout(function () {
                initCss();
                init(data);
                sendBrowserPrompt();
              }, time * 1000);
              localStorage.setItem("superAssistant-done", "ok");
            } else {
              setTimeout(function () {
                initCss();
                init(data);
              }, time * 1000);
              localStorage.setItem("superAssistant-done", "ok");
            }
          });
      }
    });
};

if (!(localStorage.getItem("superAssistant-done") === "ok")) {
  checkBrowserPrompt();
}

//check for service worker

// fetch(`${s_url}/api/settings/getSettings/${Shopify.shop}`).then(res => res.json())
// .then(async (res) => {
//     if(res.data.settings[0].enable){
//         fetch(
//             `${s_url}/api/optIns/getOptIns/email-editor77.myshopify.com`,
//             {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//                 accept: "application/json",
//               },
//             }
//             ).then(res => res.json()).then(res => {
//               const data = res.data.optIns[0];
//               const time = data.timings.desktop;
//               console.log('time',time*1000);

//               setTimeout(function(){

//               },time*1000)

//         })
//     }
// })

var subs;

const send_welcome_notifications = async (arr) => {
  for (var i = 0; i < arr.length; i++) {
    await fetch(
      `${s_url}/api/welcomeNotifications/getWelcomeNotificationsInfo/${Shopify.shop}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        fetch(`${s_url}/api/subscription/subscribe_One/${Shopify.shop}`, {
          method: "POST",
          body: JSON.stringify({
            obj: arr[i],
            compaignId: res.data._id,
            subscription: subs,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {})
          .catch((err) => console.log(err));
      });
  }
};

var Bell = `
<div id="mySidenav" class="sidenav" style="display:flex">
    <p class="side1" style="margin-top: 20px;display: none;margin-left: 5px;">{{%BELL_STATEMENT%}}</p>
   
    <a href="javascript:void(0)" onclick="{{%ALERT%}}({{%PRODUCT_ID%}})" id="alert" class="side2"  style="font-weight:'bold';margin-top: 10px;display: none;color: blue;">ALERT</a>
    <a href="javascript:void(0)" onclick="closeNav()" class="closebtn" style="width:10px" onclick="closeNav()">&times;</a>

</div>


<div style="font-size:20px;cursor:pointer;display:block;" onclick="openNav()" class="bell">
  <div style="background-color: black;width: 50px;height: 80px;">
    <i class="fas fa-bell" style="margin-top: 28px; margin-left: 20px"></i>
  </div>
</div>
`;
//
var priceDropArr = JSON.parse(localStorage.getItem("superAssistant-priceDrop"));
var backInStock = JSON.parse(
  localStorage.getItem("superAssistant-backInStock")
);

const renderBell = (automation) => {
  console.log(window.screen.width)
  console.log("autu", automation);
  //TODO:
  if (automation.backInStock.valid || automation.priceDrop.valid) {
    if (location.href.split("/")[4]) {
      
      var prod = location.href.split("/")[4];
      fetch(`/products/${prod}.js`)
        .then((res) => res.json())
        .then((prod) => {
          console.log(prod);
          if (prod) {
            console.log(priceDropArr.includes(prod.id))
            if (prod && prod.available) {
              if (
                priceDropArr &&
                priceDropArr.length > 0 &&
                priceDropArr.includes(prod.id)
              ) {
                Bell = Bell.replace(
                  "{{%BELL_STATEMENT%}}",
                  "We will notify you when the price drops."
                );
                document.querySelector("side2").innerHTML = "";
              } else {
                Bell = Bell.replace(
                  "{{%BELL_STATEMENT%}}",
                  `Get Notification when price drops below Rs. ${
                    prod.variants[0].price / 100
                  }`
                );
              }
              Bell = Bell.replace("{{%ALERT%}}", `newPriceDropAlert`);
              Bell = Bell.replace("{{%PRODUCT_ID%}}", prod.id);
              Bell = Bell.replace("{{%PRODUCT_PRICE%}}", prod.variants[0].price / 100);
              if (automation.priceDrop.valid) {
                initBell();
              }
            } else {
              if (
                backInStock &&
                backInStock.length > 0 &&
                backInStock.includes(prod.id)
              ) {
                Bell = Bell.replace(
                  "{{%BELL_STATEMENT%}}",
                  "We will notify you when the item is back in stock."
                );
                //document.querySelector("side2").innerHTML = "";
              } else {
                Bell = Bell.replace(
                  "{{%BELL_STATEMENT%}}",
                  `Get Notified when ${prod.title} is back in stock !`
                );
              }
              Bell = Bell.replace("{{%ALERT%}}", `newBackInStockAlert`);
              Bell = Bell.replace("{{%PRODUCT_ID%}}", prod.id);
              if (automation.backInStock.valid) {
                initBell();
              }
            }
          }
        })
        .catch((err) => console.log(err));

      initBellCss();
    } else {
      console.log("not on product page");
    }
  }
};

const newPriceDropAlert = async (productId) => {
  console.log("newPriceDropAlert");

  if (!priceDropArr || priceDropArr.length === 0) {
    const arr = [];
    arr.push(productId);
    localStorage.setItem("superAssistant-priceDrop", JSON.stringify(arr));
  }

  if (backInStock && backInStock.length > 0) {
    if (backInStock.includes(productId)) {
      backInStock.splice(backInStock.indexOf(productId), 1);
      localStorage.setItem(
        "superAssistant-backInStock",
        JSON.stringify(backInStock)
      );
    }
  }

  if (priceDropArr && priceDropArr.length > 0) {
    if (!priceDropArr.includes(productId)) {
      priceDropArr.push(productId);
      localStorage.setItem(
        "superAssistant-priceDrop",
        JSON.stringify(priceDropArr)
      );
    }
  }

  document.querySelector(".side1").innerHTML =
    "We will notify you when the price drops.";
  document.querySelector(".side2").innerHTML = "";
console.log(subs);
console.log(productId);
  if (productId && subs) {
    if (location.href.split("/")[4]) {
      var prod = location.href.split("/")[4];
      fetch(`/products/${prod}.js`)
        .then((res) => res.json())
        .then((prod) => {
          console.log(prod);
          console.log(subs)
          if (prod) {
            fetch(`${s_url}/api/settings/productDataPriceDrop/${Shopify.shop}`, {
              method: "POST",
              body: JSON.stringify({
                id : prod.id,
                price : prod.variants[0].price / 100,
                subscription : subs
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => {console.log(res.data)})
              .catch((err) => console.log(err));
       
          }
        })
        .catch((err) => console.log(err));

      initBellCss();
    } else {
      console.log("not on product page");
    }
  }
};

const newBackInStockAlert = async (productId) => {
  console.log("newBackInStockAlert");
  document.querySelector(".side1").innerHTML =
    "We will notify you when the item is back in stock.";
  document.querySelector(".side2").innerHTML = "";

  if (!backInStock || backInStock.length === 0) {
    const arr = [];
    arr.push(productId);
    localStorage.setItem("superAssistant-backInStock", JSON.stringify(arr));
  }

  if (backInStock && backInStock.length > 0) {
    if (!backInStock.includes(productId)) {
      backInStock.push(productId);
      localStorage.setItem(
        "superAssistant-backInStock",
        JSON.stringify(backInStock)
      );
    }
  }

  if (priceDropArr && priceDropArr.length > 0) {
    if (priceDropArr.includes(productId)) {
      priceDropArr.splice(priceDropArr.indexOf(productId), 1);
      localStorage.setItem(
        "superAssistant-priceDrop",
        JSON.stringify(priceDropArr)
      );
    }
  }


};

const automation = async (subs) => {
  await fetch(`${s_url}/api/automation/getAutomation/${Shopify.shop}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      //console.log(res.data.automation);
      const automation = res.data.automation;
      console.log("yay", subs);

      renderBell(automation);

      if (automation.welcomeNotifications.valid) {
        if (!localStorage.getItem("superAssistant-welcome")) {
          localStorage.setItem("superAssistant-welcome", "done");

          const arr = [];

          fetch(`${s_url}/api/settings/getSettings/${Shopify.shop}`, {
            method: "GET",
          })
            .then((res) => res.json())
            .then((res) => {
              if (automation.welcomeNotifications.schedule.reminder1.valid) {
                const reminder1 =
                  automation.welcomeNotifications.schedule.reminder1;
                var dt = new Date(Date.now());
                dt.setSeconds(dt.getSeconds() + reminder1.value);

                var obj = {};
                obj.sendNow = false;
                obj.schedule = {
                  valid: true,
                  value: dt,
                };
                obj.compaignTitle = reminder1.title;
                obj.compaignMessage = reminder1.message;
                obj.advanced = false;
                obj.compaignType = "welcome";
                obj.primaryLink = reminder1.primaryLink;
                obj.image = automation.welcomeNotifications.heroImage;

                console.log(obj);
                obj.compaignPhoto = res.data.settings[0].storeLogo;
                arr.push(obj);
              }

              if (automation.welcomeNotifications.schedule.reminder2.valid) {
                const reminder2 =
                  automation.welcomeNotifications.schedule.reminder2;
                var dt = new Date(Date.now());
                dt.setSeconds(dt.getSeconds() + reminder2.value);
                console.log(dt.getTime());

                var obj = {};
                obj.sendNow = false;
                obj.schedule = {
                  valid: true,
                  value: dt,
                };
                obj.compaignTitle = reminder2.title;
                obj.compaignMessage = reminder2.message;
                obj.advanced = false;
                obj.compaignType = "welcome";
                obj.primaryLink = reminder2.primaryLink;
                obj.image = automation.welcomeNotifications.heroImage;

                console.log(obj);
                obj.compaignPhoto = res.data.settings[0].storeLogo;

                arr.push(obj);
              }

              if (automation.welcomeNotifications.schedule.reminder3.valid) {
                const reminder3 =
                  automation.welcomeNotifications.schedule.reminder3;
                var dt = new Date(Date.now());
                dt.setSeconds(dt.getSeconds() + reminder3.value);
                console.log(dt.getTime());

                var obj = {};
                obj.sendNow = false;
                obj.schedule = {
                  valid: true,
                  value: dt,
                };
                obj.compaignTitle = reminder3.title;
                obj.compaignMessage = reminder3.message;
                obj.advanced = false;
                obj.compaignType = "welcome";
                obj.primaryLink = reminder3.primaryLink;
                obj.image = automation.welcomeNotifications.heroImage;

                console.log(obj);
                obj.compaignPhoto = res.data.settings[0].storeLogo;

                arr.push(obj);
              }

              console.log(arr);

              if (arr.length > 0) {
                send_welcome_notifications(arr);
              }
            });
        }
      }
    });
};

let browserName;
let devicePlatform = navigator.platform;

if (localStorage.getItem("superAssistant-done") === "ok") {
  send().catch((err) => console.log(err));
}

async function send(subscription) {

  //registring unique id
  if (!localStorage.getItem("superAssistant-deviceId")) {
    localStorage.setItem("superAssistant-deviceId", Date.now());
  }
  if(!localStorage.getItem("super-assistant-customerId-set")){
    localStorage.setItem("super-assistant-customerId-set",false)
  }
  

  //notification popping other then allow data of browser device return object
  // const subscription = await register.pushManager.subscribe({
  //   userVisibleOnly: true,
  //   applicationServerKey: urlBase64ToUint8Array(public_vapid_key),
  // });
console.log(subscription)
  // var expirationTime = subscription.expirationTime
  // console.log('expTIME',expirationTime)

  automation(subscription);

  subs = subscription;
  let customerId;

  console.log("Push Registered....");

  if (meta.page && meta.page.customerId) {
    customerId = meta.page.customerId;
    if (meta.page.customerId) {
      localStorage.setItem("superAssistant-customer", customerId);
    }
  }
  console.log( localStorage.getItem("superAssistant-customer"))

  var isOpera =
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;
  var isFirefox = typeof InstallTrigger !== "undefined";
  var isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && safari.pushNotification)
    );
  var isIE = /*@cc_on!@*/ false || !!document.documentMode;
  var isEdge = !isIE && !!window.StyleMedia;
  var isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
  var isBlink = (isChrome || isOpera) && !!window.CSS;

  if (isOpera) {
    browserName = "Opera";
  } else if (isFirefox) {
    browserName = "Firefox";
  } else if (isSafari) {
    browserName = "Safari";
  } else if (isIE) {
    browserName = "IE";
  } else if (isEdge) {
    browserName = "Edge";
  } else if (isChrome) {
    browserName = "Chrome";
  } else if (isBlink) {
    browserName = "Blink";
  } else {
    browserName = "Other";
  }

  console.log("fetch",  localStorage.getItem("superAssistant-ipInfo"));

  if (localStorage.getItem("superAssistant-subscription")) {

    // const oldSubscription = localStorage.getItem("superAssistant-subscription");
    // console.log("new  endpoint", subscription);
    // console.log("old  endpoint", oldSubscription);
    //if (subscription.endpoint !== oldSubscription.endpoint) {
     // console.log("refreshed endpoint", subscription);
     //JSON.parse(oldSubscription)
      // await fetch(
      //   `${s_url}/api/subscription/updateSubscription`,
      //   {
      //     method: "POST",
      //     body: JSON.stringify({
      //       oldSubscription,
      //       subscription,
      //       // deviceId: localStorage.getItem("superAssistant-deviceId"),
      //     }),

      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // )
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log("subscription refreshed!",data);
      //     localStorage.setItem(
      //       "superAssistant-subscription",
      //       JSON.stringify(subscription)
      //     );
      //     if(data.status === "success"){
      //       localStorage.setItem(
      //         ,
      //         JSON.stringify(subscription)
      //       );
      //     }
      //   })
      //   .catch((err) => console.log(err));
    // } else {
    //   console.log("subscription is still active")
      // await fetch(
      //   `${s_url}/api/subscription/createSubscription/${window.Shopify.shop}`,
      //   {
      //     method: "POST",
      //     body: JSON.stringify({
      //       subscription,
      //       customerId: localStorage.getItem("superAssistant-customer"),
      //       deviceId: localStorage.getItem("superAssistant-deviceId"),
      //       customerInfo: customerInfo,
      //       browserName,
      //       devicePlatform,
      //     }),

      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // )
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log("subs created",data);
      //     localStorage.setItem(
      //       "superAssistant-subscription",
      //       subscription.endpoint
      //     );
      //     // if(data.status === "success"){
      //     //     localStorage.removeItem("superAssistant-backInStock");
      //     //     localStorage.removeItem("superAssistant-priceDrop");
      //     // }
      //   })
      //   .catch((err) => console.log(err));
    //}
  } else {
    await fetch(
      `${s_url}/api/subscription/createSubscription/${window.Shopify.shop}`,
      {
        method: "POST",
        body: JSON.stringify({
          subscription,
          customerId: localStorage.getItem("superAssistant-customer"),
          deviceId: localStorage.getItem("superAssistant-deviceId"),
          customerInfo: customerInfo,
          browserName,
          devicePlatform,
        }),

        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(" posting new subscription",);
        localStorage.setItem(
          "superAssistant-subscription",
          JSON.stringify(subscription)
        );
        if(localStorage.getItem("superAssistant-customer")){
          localStorage.setItem("super-assistant-customerId-set",true)
        }
        if (data.status === "success") {
          localStorage.removeItem("superAssistant-backInStock");
          localStorage.removeItem("superAssistant-priceDrop");
        }
      })
      .catch((err) => console.log(err));
  }

  // console.log("push sent...");
}

let customerStatus = localStorage.getItem("super-assistant-customerId-set")

console.log(customerStatus)
console.log(localStorage.getItem("superAssistant-customer"))
console.log(window.Shopify.shop)

if(customerStatus==="false"){
  console.log("condition 1 pass")
  if(localStorage.getItem("superAssistant-customer")){

    console.log("here in customer")
    fetch(
      `${s_url}/api/subscription/updateCustomer/${window.Shopify.shop}`,
      {
        method: "POST",
        body: JSON.stringify({

          customerId: localStorage.getItem("superAssistant-customer"),
          deviceId: localStorage.getItem("superAssistant-deviceId"),
          
        }),

        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => res.json())
      .then((data) => {
        console.log("customer Data Updated",);
        if (data.status === "success") {
          localStorage.setItem("super-assistant-customerId-set",true)
     
        }
         
      })
      .catch((err) => console.log(err)); 
    
  }

  }




function urlBase64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/// ABANDONED CART LOGIC ///

//update cart function when the cart has items and updated it is called
//it fetches cart items and select the item image which has highest price
//call the scheduleAbandonedCart api to schedule the notifications
const updateCart = async (obj) => {
  await fetch(
    `${s_url}/api/abandonedCart/updateAbandonedCart/${Shopify.shop}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    }
  )
    .then((res) => res.json())
    .then((res) => {
      if (!localStorage.getItem("superAssistant-cart-done")) {
        fetch("/cart.js")
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            const cart_items = res.items;

            //selecct the highest price cart item
            const max = cart_items.reduce(function (prev, current) {
              return prev.final_price > current.final_price ? prev : current;
            });

            console.log(max.image, cart_items);

            // if(localStorage.getItem('superAssistant-customer')){

            //sending in the date when the cart is updated to be checked in the backend
            var date = new Date(Date.now());
            const obj = {
              token: res.token,
              items: res.item_count,
              customerId: localStorage.getItem("superAssistant-customer"),
              deviceId: localStorage.getItem("superAssistant-deviceId"),
              image: max.image,
              scheduled_at: date,
            };

            console.log("scheduled", obj);

            fetch(`${s_url}/api/automation/getAutomation/${Shopify.shop}`, {
              method: "GET",
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.data.automation.abandonedCartRecovery.valid) {
                  localStorage.setItem("superAssistant-cart-done", "OK");
                  fetch(
                    `${s_url}/api/abandonedCart/scheduleAbandonedCart/${Shopify.shop}`,
                    {
                      method: "post",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(obj),
                    }
                  )
                    .then((res) => res.json())
                    .then((res) => console.log(res));
                }
              });
            //}
          });
      }
    });
};

var cart;

//Calling every 2s to check for updates in cart and if there is an update and cart items are more than 0
//then calling the updateCart function defined above
setInterval(function () {
  fetch("/cart.js")
    .then((res) => res.json())
    .then((res) => {
      if (!localStorage.getItem("superAssistant-cart")) {
        localStorage.setItem(
          "superAssistant-cart",
          JSON.stringify({ token: res.token, items: res.item_count })
        );
        localStorage.setItem("superAssistant-cartFlag", "true");
        console.log("cart updated");

        const date = new Date(Date.now());

        const obj = {
          cartId: res.token.trim(),
          items: res.item_count,
          cart_update_time: date,
        };
        console.log("thank thank");
        updateCart(obj);
        return;
      }

      cart = JSON.parse(localStorage.getItem("superAssistant-cart"));

      if (at_thank_you_page() && res.item_count === 0) {
        if (localStorage.getItem("superAssistant-cartFlag") === "true") {
          const date = new Date(Date.now());
          const obj2 = {
            cartId: res.token.trim(),
            items: res.item_count,
            cart_update_time: date,
          };
          console.log("wank thank");
          updateCart(obj2);
        }
        localStorage.setItem("superAssistant-cartFlag", "false");
        localStorage.removeItem("superAssistant-cart-done");
      }

      if (res.item_count > 0) {
        localStorage.setItem("superAssistant-cartFlag", "true");
      }

      if (
        (res.token !== cart.token || res.item_count !== cart.items) &&
        localStorage.getItem("superAssistant-cartFlag") === "true"
      ) {
        console.log("cart updated");

        if (res.item_count > 0) {
          localStorage.removeItem("superAssistant-cart-done");
        }

        const date = new Date(Date.now());

        const obj = {
          cartId: res.token.trim(),
          items: res.item_count,
          cart_update_time: date,
        };
        console.log("point of interest thank");
        localStorage.setItem(
          "superAssistant-cart",
          JSON.stringify({ token: res.token, items: res.item_count })
        );
        updateCart(obj);
        localStorage.setItem("superAssistant-cartFlag", "false");
      }
    });
}, 2000);

//////////////////////////RENDERING/////////////////////////////////////

//{{%PROMPT_TITLE%}}
//{{%PROMPT_DESCRIPTION%}}

//{{%STORE_LOGO%}}
//{{%CUSTOM_PROMPT_TITLE%}}
//{{%CUSTOM_PROMPT_DESCRIPTION%}}
//{{%LATER%}}
//{{%ALLOW%}}

function initBellCss() {
  var link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute(
    "href",
    "https://sacdnfiles.s3.ap-south-1.amazonaws.com/push-notification/push-notification-rendering.css"
  );
  document.head.appendChild(link);
}

async function initBell() {
  await fetch(`${s_url}/api/settings/getSettings/${Shopify.shop}`)
    .then((res) => res.json())
    .then(async (res) => {
      if (res.data.settings[0].enable) {
        var span = document.createElement("span");
        span.innerHTML = Bell;
        document.body.appendChild(span);

        include("https://kit.fontawesome.com/3092e7cd23.js");
      }
    });
}

function openNav() {
  document.getElementById("mySidenav").style.width = "600px";
  document.getElementById("mySidenav").style.fontSize= "20px";
  document.getElementById("alert").style.fontSize = "20px";
  if(window.screen.width<600){
    document.getElementById("mySidenav").style.width = "350px";
    document.getElementById("mySidenav").style.display = "block";
    document.getElementById("mySidenav").style.fontSize= "15px";
  document.getElementById("alert").style.fontSize = "15px";
  document.getElementById("alert").style.marginTop = "-10px"

  }
  document.querySelector(".bell").style.display = "none";
  document.querySelector(".side1").style.display = "block";
  document.querySelector(".side2").style.display = "block";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0px";
  document.querySelector(".bell").style.display = "block";
  document.querySelector(".side1").style.display = "none";
  document.querySelector(".side2").style.display = "none";
}

function sendProductDataPriceDrop()
{
  
    if (location.href.split("/")[4]) {
      var prod = location.href.split("/")[4];
      fetch(`/products/${prod}.js`)
        .then((res) => res.json())
        .then((prod) => {
          console.log(prod);
          if (prod) {
            fetch(`${s_url}/api/settings/productDataPriceDrop/${Shopify.shop}`, {
              method: "POST",
              body: JSON.stringify({
                id : prod.id,
                price : prod.variants[0].price / 100
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => {})
              .catch((err) => console.log(err));
       
          }
        })
        .catch((err) => console.log(err));

      initBellCss();
    } else {
      console.log("not on product page");
    }
  

}

const main_prompt = `
  <div class="modal-content-wrapper" style="display: none;">
  <div class="image-modal-content">
      <img src="https://www.aitrillion.com/wp-content/uploads/2019/11/push-allow-not.png"
      style="width: 400px;height: auto;" 
      data-title="{{%PROMPT_TITLE%}}"
      data-description="{{%PROMPT_DESCRIPTION%}}"
      >
  </div>
</div>

<div class="image-modal-popup">
  <div class="wrapper">
      <span>&times;</span>
      <img src="" alt="Image Modal">
      <div class="description" style="font-size: 25px;margin-top:30px;">
          <h1>This is placeholder content</h1>
          <br/>
          <h2 style="font-size: 18px;">This content will be overwritten when the modal opens</h2>
          <br/>
          <br/>
          <h3 style="font-size: 18px;">powered by <a href="https://superassistant.io">powered by Super Assistant</a></h3>
      </div>
  </div>
</div>
`;

const main_prompt_two = `
<div id="block" style="position: fixed;top: 20%;left: 50%;transform: translate(-50%, -50%);width: 50%;margin:5px;padding: 20px;background-color:white;border-radius:5px;width: 350px;height: auto;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)">
  <div >
      <div style="display:flex;">
        <div class="Polaris-Stack__Item">
          <img src="{{%STORE_LOGO%}}" style="height:auto; width:35px" />
        </div>
        <div >
          <div style="width: auto;margin-left:20px">
              <div><span class="Polaris-TextStyle--variationStrong">{{%CUSTOM_PROMPT_TITLE%}}</span></div>
              <div style="margin-top:10px;">
                  <div><span class="Polaris-TextStyle--variationSubdued">{{%CUSTOM_PROMPT_DESCRIPTION%}}</span></div>
              </div>
          </div>
        </div>
      </div>
  </div>
  <div>
      <div style="margin-top:20px;margin-left:200px;display: flex;">
        <div style="margin-top:5px">
          <a id="fade-out1" style="color:{{%TEXT_COLOR_1%}};cursor:pointer;margin-right:20px;">
              {{%LATER%}}
          </a>
        </div>
        <div>
          <button onclick="sendBrowserPrompt()" id="fade-out2" style="border-radius:5px;background-color:{{%BACKGROUND_COLOR%}};cursor:pointer;color:white;padding:5px">
              <span style="color:{{%TEXT_COLOR%}};">{{%ALLOW%}}</span>
          </button>
        </div>
      </div>
  </div>
`;

async function start(data) {
  console.log("data", data);
  let display_prompt = main_prompt;
  let display_prompt_2 = main_prompt_two;

  if (
    data.customPrompt.enable &&
    !data.customPrompt.customPromptOverlay.enable
  ) {
    display_prompt_2 = display_prompt_2.replace(
      "{{%STORE_LOGO%}}",
      data.storeLogo
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%CUSTOM_PROMPT_TITLE%}}",
      data.customPrompt.title
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%CUSTOM_PROMPT_DESCRIPTION%}}",
      data.customPrompt.description
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%LATER%}}",
      data.customPrompt.later.text
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%ALLOW%}}",
      data.customPrompt.allow.text
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%BACKGROUND_COLOR%}}",
      `hsla(${data.customPrompt.backgroundColour.hue},${
        data.customPrompt.backgroundColour.saturation * 100
      }%,${data.customPrompt.backgroundColour.brightness * 100}%,1)`
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%TEXT_COLOR%}}",
      `hsla(${data.customPrompt.textColour.hue},${
        data.customPrompt.textColour.saturation * 100
      }%,${data.customPrompt.textColour.brightness * 100}%,1)`
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%TEXT_COLOR_1%}}",
      `hsla(${data.customPrompt.later.textColor.hue},${
        data.customPrompt.later.textColor.saturation * 100
      }%,${data.customPrompt.later.textColor.brightness * 100}%,1)`
    );

    var span = document.createElement("div");
    span.innerHTML = display_prompt_2;
    span.setAttribute("style", "position:fixed;top:0;");
    document.body.appendChild(span);

    var elem = document.getElementById("block"),
      fadeInInterval,
      fadeOutInterval;

    document.getElementById("fade-out1").addEventListener("click", function () {
      clearInterval(fadeInInterval);
      clearInterval(fadeOutInterval);

      elem.fadeOut = function (timing) {
        var newValue = 1;
        elem.style.opacity = 1;

        fadeOutInterval = setInterval(function () {
          if (newValue > 0) {
            newValue -= 0.01;
          } else if (newValue < 0) {
            elem.style.opacity = 0;
            elem.style.display = "none";
            clearInterval(fadeOutInterval);
          }

          elem.style.opacity = newValue;
        }, timing);
      };
      elem.fadeOut(2);
    });

    document.getElementById("fade-out2").addEventListener("click", function () {
      clearInterval(fadeInInterval);
      clearInterval(fadeOutInterval);

      elem.fadeOut = function (timing) {
        var newValue = 1;
        elem.style.opacity = 1;

        fadeOutInterval = setInterval(function () {
          if (newValue > 0) {
            newValue -= 0.01;
          } else if (newValue < 0) {
            elem.style.opacity = 0;
            elem.style.display = "none";
            clearInterval(fadeOutInterval);
          }

          elem.style.opacity = newValue;
        }, timing);
      };
      elem.fadeOut(2);
    });
  }

  if (data.browserPromptOverlay.enableOverlay) {
    display_prompt = display_prompt.replace(
      "{{%PROMPT_TITLE%}}",
      data.browserPromptOverlay.title
    );
    display_prompt = display_prompt.replace(
      "{{%PROMPT_DESCRIPTION%}}",
      data.browserPromptOverlay.message
    );

    var span = document.createElement("span");
    span.innerHTML = display_prompt;
    document.body.appendChild(span);
    //document.querySelector('body').innerHTML = display_prompt;
    //document.querySelector(".custom_prompt").setAttribute("style","display: none;");

    const lightboxImages = document.querySelectorAll(
      ".image-modal-content img"
    );

    // dynamically selects all elements inside modal popup
    const modalElement = (element) =>
      document.querySelector(`.image-modal-popup ${element}`);

    const body = document.querySelector("body");

    // closes modal on clicking anywhere and adds overflow back
    document.addEventListener("click", () => {
      body.style.overflow = "auto";
      modalPopup.style.display = "none";
    });

    const modalPopup = document.querySelector(".image-modal-popup");

    // loops over each modal content img and adds click event functionality
    lightboxImages.forEach((img) => {
      const data = img.dataset;
      body.style.overflow = "hidden";
      modalPopup.style.display = "block";
      modalElement("h1").innerHTML = data.title;
      modalElement("h2").innerHTML = data.description;
      modalElement("h3").innerHTML =
        '<div>powered by <a href="http://superassistant.io"><img src="https://res.cloudinary.com/dg5o9ga4k/image/upload/v1622840164/push-notifications/orrie341firy4iklniie.png" alt="Superassistant" style="width:50px;" /></a></div>';
      modalElement("img").src = img.src;
    });
  }

  if (
    data.customPrompt.customPromptOverlay.enable &&
    data.customPrompt.enable
  ) {
    console.log(
      data.customPrompt.backgroundColour,
      `hsla(${data.customPrompt.backgroundColour.hue * 100},${
        data.customPrompt.backgroundColour.saturation * 100
      }%,${data.customPrompt.backgroundColour.brightness * 100}%,0)`
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%STORE_LOGO%}}",
      data.storeLogo
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%CUSTOM_PROMPT_TITLE%}}",
      data.customPrompt.title
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%CUSTOM_PROMPT_DESCRIPTION%}}",
      data.customPrompt.description
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%LATER%}}",
      data.customPrompt.later.text
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%ALLOW%}}",
      data.customPrompt.allow.text
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%BACKGROUND_COLOR%}}",
      `hsla(${data.customPrompt.backgroundColour.hue},${
        data.customPrompt.backgroundColour.saturation * 100
      }%,${data.customPrompt.backgroundColour.brightness * 100}%,1)`
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%TEXT_COLOR%}}",
      `hsla(${data.customPrompt.textColour.hue},${
        data.customPrompt.textColour.saturation * 100
      }%,${data.customPrompt.textColour.brightness * 100}%,1)`
    );
    display_prompt_2 = display_prompt_2.replace(
      "{{%TEXT_COLOR_1%}}",
      `hsla(${data.customPrompt.later.textColor.hue},${
        data.customPrompt.later.textColor.saturation * 100
      }%,${data.customPrompt.later.textColor.brightness * 100}%,1)`
    );

    //console.log(display_prompt_2);

    var span = document.createElement("div");
    span.innerHTML = display_prompt_2;
    span.setAttribute("style", "position:fixed;top:0;");
    document.body.appendChild(span);

    var elem = document.getElementById("block"),
      fadeInInterval,
      fadeOutInterval;

    document.getElementById("fade-out1").addEventListener("click", function () {
      clearInterval(fadeInInterval);
      clearInterval(fadeOutInterval);

      elem.fadeOut = function (timing) {
        var newValue = 1;
        elem.style.opacity = 1;

        fadeOutInterval = setInterval(function () {
          if (newValue > 0) {
            newValue -= 0.01;
          } else if (newValue < 0) {
            elem.style.opacity = 0;
            elem.style.display = "none";
            clearInterval(fadeOutInterval);
          }

          elem.style.opacity = newValue;
        }, timing);
      };
      elem.fadeOut(2);
    });

    document.getElementById("fade-out2").addEventListener("click", function () {
      clearInterval(fadeInInterval);
      clearInterval(fadeOutInterval);

      elem.fadeOut = function (timing) {
        var newValue = 1;
        elem.style.opacity = 1;

        fadeOutInterval = setInterval(function () {
          if (newValue > 0) {
            newValue -= 0.01;
          } else if (newValue < 0) {
            elem.style.opacity = 0;
            elem.style.display = "none";
            clearInterval(fadeOutInterval);
          }

          elem.style.opacity = newValue;
        }, timing);
      };
      elem.fadeOut(2);
    });

    display_prompt = display_prompt.replace(
      "{{%PROMPT_TITLE%}}",
      data.customPrompt.customPromptOverlay.customPromptOverlayTitle
    );
    display_prompt = display_prompt.replace(
      "{{%PROMPT_DESCRIPTION%}}",
      data.customPrompt.customPromptOverlay.customPromptOverlayMessage
    );

    var span = document.createElement("span");
    span.innerHTML = display_prompt;
    document.body.appendChild(span);

    const lightboxImages = document.querySelectorAll(
      ".image-modal-content img"
    );

    // dynamically selects all elements inside modal popup
    const modalElement = (element) =>
      document.querySelector(`.image-modal-popup ${element}`);

    const body = document.querySelector("body");

    // closes modal on clicking anywhere and adds overflow back
    document.addEventListener("click", () => {
      body.style.overflow = "auto";
      modalPopup.style.display = "none";
    });

    const modalPopup = document.querySelector(".image-modal-popup");

    // loops over each modal content img and adds click event functionality
    lightboxImages.forEach((img) => {
      const data = img.dataset;
      body.style.overflow = "hidden";
      modalPopup.style.display = "block";
      modalElement("h1").innerHTML = data.title;
      modalElement("h2").innerHTML = data.description;
      modalElement("h3").innerHTML =
        '<div>powered by <a href="http://superassistant.io"><img src="https://res.cloudinary.com/dg5o9ga4k/image/upload/v1622840164/push-notifications/orrie341firy4iklniie.png" alt="Superassistant" style="width:50px;" /></a></div>';
      modalElement("img").src = img.src;
    });
  }

  localStorage.setItem("superAssistant-done", "ok");
  console.log(display_prompt);
}

function init(data) {
  console.log("that data", data);
  start(data);
}

// ADD CSS FILE
function initCss() {
  var link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute(
    "href",
    "https://cdn.jsdelivr.net/gh/utkarsh-777/push-notification-rendering/rendering1.css"
  );
  document.head.appendChild(link);
}
// }
// });

//IP INFO//

// /////////FIREBASE_CLOUD_MESSAGING///////////////

// // function include(file) {
// //     var script  = document.createElement('script');
// //     script.src  = file;
// //     script.type = 'text/javascript';
// //     script.defer = true;

// //     document.getElementsByTagName('head').item(0).appendChild(script);
// // }

// // include('https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js');
// // importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js');
// // importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-messaging.js');

// // var firebaseConfig = {
// //     apiKey: "AIzaSyCSggOesDadXd34oc7roO85Nau9zZ9bZMM",
// //     authDomain: "push-notifications-28ffa.firebaseapp.com",
// //     projectId: "push-notifications-28ffa",
// //     storageBucket: "push-notifications-28ffa.appspot.com",
// //     messagingSenderId: "588232808675",
// //     appId: "1:588232808675:web:500ff089ed34926a34cdd6"
// //   };

// // //firebase.initializeApp(firebaseConfig);

// // firebase.initializeApp(firebaseConfig);

// // const messaging = firebase.messaging();

// // function initFirebaseMessagingRegistration() {
// //     messaging
// //         .requestPermission()
// //         .then(function () {
// //             messageElement.innerHTML = "Got notification permission";
// //             console.log("Got notification permission");
// //             return messaging.getToken();
// //         })
// //         .then(function async(token) {
// //             // print the token on the HTML page
// //             tokenElement.innerHTML = "Token is " + token;
// //         })
// //         .catch(function (err) {
// //             errorElement.innerHTML = "Error: " + err;
// //             console.log("Didn't get notification permission", err);
// //         });
// // }

//Chirag sir code  
 
