window.gltfLoader = new THREE.GLTFLoader();
class Reticle extends THREE.Object3D {
  constructor() {
    super();

    this.loader = new THREE.GLTFLoader();
    this.loader.load(
      "https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf",
      (gltf) => {
        this.add(gltf.scene);
      }
    );

    this.visible = false;
  }
}
//! Model
window.gltfLoader.load(
  "../assets/shoe/scene.gltf",
  function (gltf) {
    console.log(gltf);
    gltf.scene.scale.set(0.04, 0.04, 0.04);
    gltf.scene.children[0].children[0].children[0].children.forEach(
      (element) => {
        element.castShadow = true;
      }
    );
    window.mesh3 = gltf.scene;
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100);
  },
  (err) => console.log(err)
);

window.DemoUtils = {
  createLitScene() {
    const scene = new THREE.Scene();

    const light = new THREE.AmbientLight(0xffffff, 1);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(10, 15, 10);

    directionalLight.castShadow = true;

    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    planeGeometry.rotateX(-Math.PI / 2);

    const shadowMesh = new THREE.Mesh(
      planeGeometry,
      new THREE.ShadowMaterial({
        color: 0x111111,
        opacity: 0.2,
      })
    );

    shadowMesh.name = "shadowMesh";
    shadowMesh.receiveShadow = true;
    shadowMesh.position.y = 10000;

    scene.add(shadowMesh);
    scene.add(light);
    scene.add(directionalLight);

    return scene;
  },
};

function onNoXRDevice() {
  document.body.classList.add("unsupported");
}
