const geometry = new THREE.BoxGeometry(6, 0.2, 4);
const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
const area = new THREE.Mesh(geometry, material);
area.position.y = 0.1;
area.position.z = 4;
area.material.transparent = true;
area.material.opacity = 0;

export default area;
