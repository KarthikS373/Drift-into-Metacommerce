const geometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
const plane = new THREE.Mesh(geometry, material);
plane.receiveShadow = true;

export default plane;
