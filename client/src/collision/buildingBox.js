import machine from "../env/LoopMachine.js";
import scene from "../env/Scene.js";
import characterBox from "./characterBox.js";
import cleanUp from "../env/CleanUp.js";

const buildingBox = (mesh) => {
  const box = new THREE.Box3();
  // const helper = new THREE.Box3Helper(box, "red");
  box.setFromObject(mesh);
  // scene.add(helper);
  return box;
};

const buildings = [];

export const addBuilding = (mesh, building) => {
  //   console.log(mesh);
  scene.add(mesh);
  mesh.scale.set(0.003, 0.003, 0.003);
  mesh.position.set(building.coordinates.x, 0, building.coordinates.z);
  buildings.push(mesh);
  const building1Box = buildingBox(mesh);
  let flag = true,
    current = this;
  const root = document.querySelector(".root");
  const clickCallback = () => {
    if (building1Box.intersectsBox(characterBox)) {
      if (flag) {
        root.innerHTML = `Press Enter`;
        flag = false;
        window.addEventListener("keydown", clickHandle);
      }
    } else {
      if (!flag && current == this) {
        window.removeEventListener("keydown", clickHandle);
        root.innerHTML = "";
        flag = true;
      }
    }
  };

  const clickHandle = (event) => {
    if (event.keyCode == 13) {
      console.log("ENTERED");
      cleanUp(clickCallback);
    }
  };
  machine.addCallback(clickCallback);
};

export default buildingBox;
