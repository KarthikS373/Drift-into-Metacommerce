const list = [];

fetch("https://database-34912-default-rtdb.firebaseio.com/products/cart.json")
  .then((res) => res.json())
  .then((data) => {
    const items = data || {};
    let price = 0;
    let itemCount = 0;
    Object.values(items).forEach((ele) => {
      price += ele.price;
      itemCount += 1;
      const element = `
          <div class="cart-body__item">
            <div class="cart-body__itemdetail">
              <div class="cart-body__itemname">${ele.name}</div>
              <div class="cart-body__itemquantity">${ele.quantity}x</div>
            </div>
            <div class="cart-body__itemprice">Rs.${
              ele.price * ele.quantity
            }</div>
        </div>
        `;
      list.push(element);
    });
    fetch("view-cart.html")
      .then((res) => res.text())
      .then((cart) => {
        $("body").append(cart);
        $("#itemCount").text(`Items: ${itemCount}`);
        $("#totalPrice").text(`Total Rs.${price}`);

        $("#show-cart").on("click", (e) => {
          document.querySelector(".cart-wrapper").classList.toggle("show");
        });
        list.forEach((ele) => {
          document
            .querySelector(".cart-body")
            .insertAdjacentHTML("beforeend", ele);
        });
      });
    $(".cart-checkout__button").on("click", () => {
      //TODO: Add razor pay
      
    });
  })
  .catch((err) => {
    console.log(err);
  });
