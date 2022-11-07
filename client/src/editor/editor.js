let color = "#42445A";
const objects = [];
const shops = [];
const group = new THREE.Group();

const exporter = new THREE.GLTFExporter();

//! Color picker
const pickr = Pickr.create({
  el: ".color-picker",
  theme: "nano",
  closeOnScroll: true,
  padding: 2,
  inline: true,
  swatches: [
    "rgba(244, 67, 54, 1)",
    "rgba(233, 30, 99, 0.95)",
    "rgba(156, 39, 176, 0.9)",
    "rgba(103, 58, 183, 0.85)",
    "rgba(63, 81, 181, 0.8)",
    "rgba(33, 150, 243, 0.75)",
    "rgba(3, 169, 244, 0.7)",
    "rgba(0, 188, 212, 0.7)",
    "rgba(0, 150, 136, 0.75)",
    "rgba(76, 175, 80, 0.8)",
    "rgba(139, 195, 74, 0.85)",
    "rgba(205, 220, 57, 0.9)",
    "rgba(255, 235, 59, 0.95)",
    "rgba(255, 193, 7, 1)",
  ],

  components: {
    preview: true,
    opacity: true,
    hue: true,

    interaction: {
      hex: true,
      rgba: true,
      // hsla: true,
      // hsva: true,
      // cmyk: true,
      input: true,
      // clear: true,
      clear: true,
      save: true,
    },
  },
});

pickr
  .on("save", (c, instance) => {
    hex = c.toHEXA();
    color = `#${hex[0]}${hex[1]}${hex[2]}`;
    pickr.hide();
  })
  .on("clear", () => {
    color = "#42445A";
    pickr.hide();
  });

//~ THREEJS ~//
//* SCENE
const scene = new THREE.Scene();

//* SIZE
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const aspect = size.width / size.height;
const fov = 45;
let near = 0.1;
let far = 100;

//* Plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    visible: false,
  })
);
plane.name = "ground";
plane.rotation.x = -Math.PI * 0.5;
plane.position.set(0.5, 0, 0.5);
scene.add(plane);

//* Highlight
const highlight = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
  })
);
highlight.rotation.x = -Math.PI * 0.5;
highlight.position.set(0.5, 0, 0.5);
scene.add(highlight);

// Raycast
const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;

window.addEventListener("mousemove", (e) => {
  mousePosition.x = (e.clientX / size.width) * 2 - 1;
  mousePosition.y = -(e.clientY / size.height) * 2 + 1;
  raycaster.setFromCamera(mousePosition, camera);
  intersects = raycaster.intersectObjects(scene.children);
  scene.children.forEach((element) => {
    if (element.name == "cube") {
      element.position.y = 0.5;
    }
  });
  intersects.forEach((element) => {
    if (element.object.name == "ground") {
      const highlightPos = new THREE.Vector3()
        .copy(element.point)
        .floor()
        .addScalar(0.5);

      highlight.position.set(highlightPos.x, 0, highlightPos.z);
    }
    if (element.object.name == "cube") {
      element.object.position.y = 1;
    }
  });
});

//* GRID
const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

//* CAMERA
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
scene.add(camera);
camera.position.set(10, 15, -22);

//* RENDERER
const canvas = document.getElementById("webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);

//* CONTROLLER
const controls = new THREE.OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.enabled = true;
controls.enableDamping = true;
controls.update();

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  highlight.material.opacity = Math.sin(elapsedTime * 4) + 1;

  // * Rendering out to screen
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  // Updating the camera aspect
  camera.aspect - size.width / size.height;
  camera.updateProjectionMatrix();

  // Updating the renderer
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// window.addEventListener("dblclick", () => {
//   // if (document.fullscreenElement) {
//   //   document.exitFullscreen();
//   // } else {
//   //   canvas.requestFullscreen();
//   // }
//   const hex = pickr.getColor().toHEXA();
//   color = `#${hex[0]}${hex[1]}${hex[2]}`;
//   pickr.hide();
// });

//! Place on screen
const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereBufferGeometry(0.3, 100, 100);
const torusGeometry = new THREE.TorusBufferGeometry(0.3, 0.1, 16, 100);
const cylinderGeometry = new THREE.CylinderBufferGeometry(0.3, 0.3, 1, 100);
const coneGeometry = new THREE.ConeBufferGeometry(0.3, 1, 50);
const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 1);

let geometry = cubeGeometry;
window.addEventListener("dblclick", (e) => {
  if (
    objects.find((ele) => {
      return (
        ele.position.x === highlight.position.x &&
        ele.position.z === highlight.position.z
      );
    })
  )
    return;

  intersects.forEach((element) => {
    if (element.object.name == "ground") {
      const cubeMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: color,
        transparent: true,
      });
      const clone = new THREE.Mesh(geometry, cubeMaterial);
      clone.position.copy(highlight.position);
      clone.position.y = 0.5;
      group.add(clone);
      clone.material = cubeMaterial;
      clone.name = "cube";
      objects.push(clone);
    }
  });
});

scene.add(group);

document.getElementById("save").addEventListener("click", (e) => {
  let data;
  const url =
    "https://database-34912-default-rtdb.firebaseio.com/products/shops.json";
  //TODO: Export the whole data and import and scale in the main
  exporter.parse(
    group,
    (res) => {
      data = res;
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
          window.location.href = "./payment-plans.html";
        })
        .catch((err) => {
          console.log(err)
          window.location.href = "./payment-plans.html";
        });
    },
    { binary: true }
  );
}); 

document.querySelectorAll(".options").forEach((ele) => {
  ele.addEventListener("click", (e) => {
    document.querySelectorAll(".options").forEach((ele) => {
      ele.classList.remove("active");
    });
    ele.classList.add("active");
    console.log(ele.getAttribute("data-value"));
    switch (ele.getAttribute("data-value")) {
      case "Cube":
        geometry = cubeGeometry;
        break;
      case "Cylinder":
        geometry = cylinderGeometry;
        break;
      case "Sphere":
        geometry = sphereGeometry;
        break;
      case "Torrus":
        geometry = torusGeometry;
        break;
      case "Cone":
        geometry = coneGeometry;
        break;
      case "Plane":
        geometry = planeGeometry;
        break;
      default:
        geometry = cubeGeometry;
        break;
    }
  });
});
