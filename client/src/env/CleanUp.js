import renderer from "./Renderer.js";
import scene from "./Scene.js";
import machine from "./LoopMachine.js";
import BuildScene from "../screens/BuildingInner.js";

const cleanUp = (cleanCallback) => {
  let character = null;
  document.querySelector(".root").innerHTML = "";
  renderer.setClearColor("black");
  scene.background = new THREE.Color("black");
  scene.fog = new THREE.Fog("#ffeded", 0.001, 2000);
  while (scene.children.length > 0) {
    if (scene.children[0].player) character = scene.children[0];
    scene.remove(scene.children[0]);
  }
  if (scene.geometry) scene.geometry.dispose();

  if (scene.material) {
    sceneect.keys(scene.material).forEach((prop) => {
      if (!scene.material[prop]) return;
      if (
        scene.material[prop] !== null &&
        typeof scene.material[prop].dispose === "function"
      )
        scene.material[prop].dispose();
      0;
    });
    scene.material.dispose();
  }

  machine.removeCallback(cleanCallback);

  BuildScene(character);
};

export default cleanUp;
