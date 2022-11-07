const texture = {};

texture.ground = new Promise((res, rej) => {
  const loader = new THREE.TextureLoader();
  loader.load("images/ground.jpg", (texture) => {
    res(texture);
  });
});

texture.sky = new Promise((res, rej) => {
  const loader = new THREE.TextureLoader();
  loader.load("images/city.png", (texture) => {
    res(texture);
  });
});

texture.building1 = new Promise((res, rej) => {
  const loader = new THREE.TextureLoader();
  loader.load("images/building.jpg", (texture) => {
    res(texture);
  });
});

texture.wooden = new Promise((res, rej) => {
  const loader = new THREE.TextureLoader();
  loader.load("images/wooden.jpg", (texture) => {
    res(texture);
  });
});

// texture.scene = new Promise((res, rej) => {
//   const loader = new THREE.TextureLoader();
//   loader.load("images/sky.jpg", (texture) => {
//     res(texture);
//   });
// });

export default texture;
