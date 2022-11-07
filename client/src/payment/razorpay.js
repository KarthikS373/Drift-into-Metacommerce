import create_UUID from "../Utils/uuid.js";
import { loadExternalScript } from "../Utils/loadScript.js";

export const handlePayment = (name, amount, cb) => {
  loadExternalScript("https://checkout.razorpay.com/v1/checkout.js").then(
    function () {
      var options = {
        key: "rzp_test_6Buajx79l1X9At",
        protocol: "https",
        hostname: "api.razorpay.com",
        amount: amount,
        currency: "INR",
        name: "Drift",
        description: `Order-${create_UUID()}`,
        image:
          "https://th.bing.com/th/id/OIP.XHnrgMveRLD2y4kbC88-_wHaFj?pid=ImgDet&rs=1",
        save: false,
        prefill: {
          name: name,
        },
        theme: {
          color: "#0053C3",
        },
        handler: function (transaction, err) {
          cb(transaction);
        },
        callback_url: "http://127.0.0.1:5500/client/shop.html",
      };

      window.rzpay = new Razorpay(options);
      rzpay.open();
    }
  );
};
