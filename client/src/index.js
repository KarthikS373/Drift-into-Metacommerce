import camera from "./env/Camera.js";
import eventEmitter from "./env/EventEmitter.js";
import keyListener from "./env/KeyListener.js";
import light from "./env/Light.js";
import machine from "./env/LoopMachine.js";
import renderer from "./env/Renderer.js";
import resize from "./env/Resize.js";
import scene from "./env/Scene.js";
import plane from "./env/shapes/Plane.js";
import sky from "./env/shapes/Sky.js";
import "./Bootstrap.js";
import Npc from "./character/Npc.js";

const buildBoxes = (coords) => {
  const box = new THREE.Box3();
  const { x, y, z } = coords;
  box.set(
    new THREE.Vector3(x - 1, y, z - 0.5),
    new THREE.Vector3(x + 1, y + 2, z + 0.5)
  );
  const helper = new THREE.Box3Helper(box, "red");
  console.log(box, helper);
  scene.add(helper);
  return box;
};

camera.position.set(0, 1.8, -3);
scene.add(light);
scene.add(plane);
scene.add(sky);

renderer.setClearColor("red");

scene.fog = new THREE.Fog("#ffeded", 10, 16);

keyListener.setCaster((data) => {
  console.log(data);
  eventEmitter.dispatch("keyListener", data);
});

keyListener.start();
machine.start();
resize.start(renderer);

// soundHandler.setAsLoop("environment");
// soundHandler.setVolume("environment", 0.3);
// soundHandler.play("environment");
const clickHandle = (event) => {
  if (event.keyCode == 13) {
    window.open(
      `./room.html?room=4c04fe92-5556-4f76-b31c-79c96498f6f4&user=${USER}`
    );
  }
};

let _npc = null;

eventEmitter.subscribe("child_added", (data) => {
  console.log(data);
  if (data.playerId != data.addedPlayer.id) {
    eventEmitter.dispatch("startclickCallback", {});
    Npc.then((npc) => {
      // const mixer = new THREE.AnimationMixer(npc);
      // console.log(npc);
      // const idle = mixer.clipAction(npc.animations[0]);
      // idle.play();

      // const clock = new THREE.Clock();

      // machine.addCallback(() => {
      //   if (mixer) mixer.update(clock.getDelta());
      // });

      // mixer.addEventListener("finished", () => {
      //   idle.reset();
      //   idle.play();
      // });

      _npc = npc;
      scene.add(npc);
    });
  }
});

eventEmitter.subscribe("child_removed", (data) => {
  console.log("Removing npc");
  eventEmitter.dispatch("stopclickCallback", {});
  if (data.playerId != data.removedKey.id) {
    if (_npc) {
      scene.remove(_npc);
    }
  }
});

eventEmitter.subscribe("coord", (data) => {
  if (_npc) {
    eventEmitter.dispatch("position_tracking", _npc);
    _npc.position.set(
      data.characterState.x,
      data.characterState.y,
      data.characterState.z
    );
  }
});
