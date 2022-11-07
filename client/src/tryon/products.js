import {
  BakeryItems,
  Chips,
  Chocolate,
  Drinks,
  Stationary,
  Toileteries,
  Shoe,
  Glasses,
} from "../../assets/db/db.js";

const params = new URLSearchParams(window.location.search);
const type = params.get("type");

let active = 0;
let DOM = Shoe;

switch (type) {
  case "drink":
    DOM = Drinks;
    break;

  case "chips":
    DOM = Chips;
    break;

  case "chocolate":
    DOM = Chocolate;
    break;

  case "bakeryItems":
    DOM = BakeryItems;
    break;

  case "stationary":
    DOM = Stationary;
    break;

  case "toileteries":
    DOM = Toileteries;
    break;

  case "glasses":
    DOM = Glasses;
    break;

  default:
    DOM = Shoe;
    console.log("def");
    break;
}

let selectedSize = "S";
const setDom = (title, subtitle, desc, price, varient = [], image = "") => {
  let maxActive = DOM.length;
  $(".info-subtitle").text(subtitle);
  $(".info-title").text(title);
  $(".info-description").text(desc);
  $(".price-title").text(`Rs.${price}`);

  $(".size-content").html("");
  $("#shoe-img").attr("src", image);
  var flag = true;
  varient.forEach((element) => {
    const active = flag ? "active" : "";
    $(".size-content").append(
      `<button class="size-total ${active}" data-id=${element.id}> ${element}</button>`
    );
    flag = false;
  });
  $(".size-total").on("click", (e) => {
    $(".size-total").removeClass("active");
    selectedSize = e.currentTarget.innerText;
    e.currentTarget.classList.add("active");
  });
};

const item__count = $("#item_count");
let quantity = parseInt(item__count.text());
console.log(quantity);
$("#item__increment").on("click", () => {
  quantity += 1;
  item__count.text(quantity.toString());
});
$("#item__decrement").on("click", () => {
  if (quantity > 0) quantity -= 1;

  item__count.text(quantity.toString());
});

setDom(
  DOM[active].name,
  DOM[active].brand,
  DOM[active].description,
  DOM[active].price,
  ["S", "M", "L"],
  DOM[active].image
);

$("#add-to-cart").on("click", (e) => {
  //TODO: Add cart
  const data = { ...DOM[active], varient: selectedSize, quantity: quantity };
  const url =
    "https://database-34912-default-rtdb.firebaseio.com/products/cart.json";
  fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      Toastify({
        text: "Product added successfully",
        duration: 2000,
        destination: null,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "left",
        stopOnFocus: false,
        style: {
          background: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
        },
        onClick: () => {},
      }).showToast();
    })
    .catch((err) => console.log(err));
});
