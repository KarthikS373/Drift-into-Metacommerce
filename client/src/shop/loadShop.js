const loadBuilding = () =>
  new Promise((res, rej) => {
    const loader = new THREE.GLTFLoader();
    loader.load(
      "assets/models/shop1/scene.gltf",
      (gltf) => {
        console.log(gltf);
        res([gltf]);
      },
      (xhr) => {
        console.log("Loading... " + (xhr.loaded / xhr.total) * 100 + "%");
      },
      (err) => {
        rej(err);
      }
    );
  });

export const loadShoeRack = () =>
  new Promise((res, rej) => {
    const loader = new THREE.FBXLoader();
    loader.load(
      "assets/models/uploads_files_994317_SHOE+RACK-METAL.FBX",
      (gltf) => {
        console.log(gltf);
        res([gltf]);
      },
      (xhr) => {
        console.log("Loading... " + (xhr.loaded / xhr.total) * 100 + "%");
      },
      (err) => {
        rej(err);
      }
    );
  });

export const loadCosmetics = () =>
  new Promise((res, rej) => {
    const loader = new THREE.FBXLoader();
    loader.load(
      "assets/models/shkaf_fbx.fbx",
      (gltf) => {
        console.log(gltf);
        res([gltf]);
      },
      (xhr) => {
        console.log("Loading... " + (xhr.loaded / xhr.total) * 100 + "%");
      },
      (err) => {
        rej(err);
      }
    );
  });

export default loadBuilding;
