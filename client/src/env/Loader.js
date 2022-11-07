class Loader {
  constructor(url, animationList, scale) {
    this.loader = new THREE.FBXLoader();
    this.animationPromises = [];
    let animations = [];
    const modelPromise = new Promise((res, rej) => {
      this.loader.load(url, function (object) {
        object.scale.set(scale, scale, scale);
        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        object.castShadow = true;
        object.receiveShadow = true;
        res(object);
      });
    });

    animationList.forEach((element, index) => {
      this.animationPromises[index] = new Promise((res, rej) => {
        this.loader.load(animationList[index], function (object) {
          object.scale.set(scale, scale, scale);
          animations[index * 1] = object.animations[0];
          res(index);
        });
      });
    });

    const joinerPromise = Promise.all(this.animationPromises);

    this.mesh = new Promise((res, rej) => {
      Promise.all([modelPromise, joinerPromise]).then((data) => {
        const object = data[0];
        if (animations.length > 0) {
          object.animations = animations;
        }
        res(object);
      });
    });
  }

  getModel(modes) {
    return this.mesh;
  }
}

export default Loader;
