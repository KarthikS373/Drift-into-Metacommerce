import scene from "../env/Scene.js";

const loader = new THREE.GLTFLoader();

const locs = [
  {
    x: 2.9846353195233237,
    y: 0,
    z: -6.869287586925513,
  },
  {
    x: 2.9846353195233237,
    y: 0,
    z: -17.918437586927084,
  },
  {
    x: 2.9846353195233237,
    y: 0,
    z: -26.506687586927775,
  },
  {
    x: 14.108736898123812,
    y: 0,
    z: -27.515413461884773,
  },
];

let active = 0;
const url =
  "https://database-34912-default-rtdb.firebaseio.com/products/shops.json";
fetch(url)
  .then((res) => res.json())
  .then((shops) => {
    console.log(shops);
    if (shops) {
      Object.values(shops).forEach((i) => {
        if (active < locs.length) {
          const blob = JSON.stringify(i);
          loader.load(
            window.URL.createObjectURL(new Blob([blob])),
            (group) => {
              console.log(group);
              group.scene.scale.set(2, 2, 2);
              group.scene.position.set(
                locs[active].x,
                locs[active].y,
                locs[active].z
              );
              active++;
              scene.add(group.scene);
            },
            (xhr) => {
              console.log(`loading ${xhr.loaded}`);
            },
            (err) => console.log(err)
          );
        }
        console.log(i);
      });
    }
  })
  .catch((err) => console.log(err));
