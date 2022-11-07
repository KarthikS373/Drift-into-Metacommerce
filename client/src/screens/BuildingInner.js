import light from "../env/Light.js";
import Loader from "../env/Loader.js";
import plane from "../env/shapes/Plane.js";
import scene from "../env/Scene.js";
import texture from "../env/Texture.js";

const folder = "src/screens/";
const loader = new THREE.OBJLoader();
const root = document.querySelector(".root");

const BuildScene = (character) => {
  scene.add(character);
  character.position.set(0, 0, 0);
  scene.add(light);
  texture.wooden.then((map) => {
    plane.material.map = map;
    plane.material.needsUpdate = true;
    // scene.add(plane);
  });

  const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(50, 50),
    new THREE.MeshBasicMaterial({
      color: "#9D6055",
      side: THREE.DoubleSide,
    })
  );
  scene.add(floor);
  floor.rotation.x = Math.PI * 0.5;

  const wallMaterial = new THREE.MeshBasicMaterial({
    color: "#C39473",
    side: THREE.DoubleSide,
  });
  const wallGeometry = new THREE.PlaneBufferGeometry(40, 40);

  const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall1.rotation.y = Math.PI * 0.5;
  wall1.position.set(20, 0, 0);
  scene.add(wall1);

  const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall2.rotation.y = Math.PI * 0.5;
  wall2.position.set(-20, 0, 0);
  scene.add(wall2);

  const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
  // wall3.rotation.y = Math.PI * 0.5;
  wall3.position.set(0, 0, -20);
  scene.add(wall3);

  const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
  // wall4.rotation.y = Math.PI * 0.5;
  wall4.position.set(0, 0, 20);
  scene.add(wall4);

  // root.appendChild

  // loader.load(
  //   folder + "Interior1/mall.obj",
  //   (building) => {
  //     building.position.set(0, plane.position.y + 0.1, -25);
  //     building.scale.set(0.05, 0.05, 0.05);
  //     root.style.height = "40vh";
  //     root.style.backgroundColor = "transparent";
  //     root.innerHTML = "";
  //     scene.add(building);
  //   },
  //   function (xhr) {
  //     root.style.height = "100vh";
  //     root.style.backgroundColor = "black";
  //     root.innerHTML = `Loading ${(xhr.loaded / xhr.total) * 100} %`;
  //   },
  //   function (error) {
  //     console.log("An error happened" + error);
  //   }
  // );
};

export default BuildScene;
