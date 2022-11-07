$(document).ready(function () {
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");

  const navLeft = menu.getBoundingClientRect().left;

  hamburger.addEventListener("click", () => {
    if (navLeft < 0) {
      menu.classList.toggle("show");
    }
  });

  var prevScrollpos = window.pageYOffset;
  window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      document.getElementById("header").style.top = "0";
    } else {
      document.getElementById("header").style.top = "-80px";
    }
    prevScrollpos = currentScrollPos;
  };

  ClickedDot = (count) => {
    SwitchActiveDot(count);
    shoe3D = document.getElementById("3d-dom");
    shoe_img = document.getElementById("shoe-img");

    if (count === 1) {
      shoe3D.classList.remove("off");
      shoe_img.classList.add("off");
    } else {
      shoe3D.classList.add("off");
      shoe_img.classList.remove("off");
    }
  };

  SwitchActiveDot = (count) => {
    if (count === 1) {
      document.getElementById("dot-1").classList.remove("active");
      document.getElementById("dot-2").classList.add("active");
      document.querySelector("body").style.backgroundColor = "white";
    } else {
      document.getElementById("dot-1").classList.add("active");
      document.getElementById("dot-2").classList.remove("active");
      document.querySelector("body").style.backgroundColor = "var(--bg)";
    }
  };

  gsap.from(".logo", { opacity: 0, duration: 1, delay: 0.5, y: -10 });
  gsap.from(".hamburger", { opacity: 0, duration: 1, delay: 0.5, y: -10 });
  gsap.from(".cart", { opacity: 0, duration: 1, delay: 1, x: -10 });
  gsap.from(".shoe-figure", { opacity: 0, duration: 1, delay: 1.5, x: -100 });
  gsap.from(".shoe-img", { opacity: 0, duration: 1, delay: 2, y: -50 });
  gsap.from(".dots", { opacity: 0, duration: 1, delay: 2.2, y: 50 });
  gsap.from(".shoe-info", { opacity: 0, duration: 1, delay: 2.5, y: -50 });
  gsap.from(".size", { opacity: 0, duration: 1, delay: 3, x: -100 });
  gsap.from(".count", { opacity: 0, duration: 1, delay: 3, x: 100 });
  gsap.from(".price-title", { opacity: 0, duration: 1, delay: 3.5, y: 50 });
  gsap.from(".price-button", { opacity: 0, duration: 1, delay: 3.5, y: -50 });
  gsap.from(".nav-item", {
    opacity: 0,
    duration: 1,
    delay: 1.2,
    y: 30,
    stagger: 0.2,
  });
});

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer();
var finalCameraPosition = 10;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = "3d-dom";
renderer.domElement.classList.add("off");

document.getElementById("shoe-div").appendChild(renderer.domElement);

window.addEventListener("resize", function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

if (window.innerWidth <= 767) {
  var Start = function () {
    camera.position.set(0, 0, 30);
  };
} else {
  var Start = function () {
    camera.position.set(0, 0, 15);
  };
}

var ambiantLight = new THREE.AmbientLight(0xffffff, 1);

scene.add(ambiantLight);
scene.background = new THREE.Color(0xffffff);

controls = new THREE.OrbitControls(camera, renderer.domElement);

var loader = new THREE.GLTFLoader();

loader.load("assets/models/shoes/scene.gltf", function (gltf) {
  gltf.scene.position.set(5, -15, 7);
  scene.add(gltf.scene);
});

let frame = 0;
var Update = function () {
  if (frame == 0) {
    Start();
    frame += 1;
  }
};

var Render = function () {
  renderer.render(scene, camera);
};

var GameLoop = function () {
  requestAnimationFrame(GameLoop);

  Update();
  Render();
};

GameLoop();

$(".size-total").on("click", (e) => {
  $(".size-total").removeClass("active");
  e.currentTarget.classList.add("active");
});

$("#add-to-cart").on("click", (e) => {
  //TODO: Add cart
  const data = {
    brand: "Nike Air jordan 1",
    description:
      "This is a genuine product of Nike India Private Limited. The product comes with a standard brand warranty of 180 days.",
    id: "akggiar",
    image: "/Images/pic1.png",
    name: "Nike  Air jordan 1",
    price: 8295,
    varient: "8.6",
    quantity: 1,
  };
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
