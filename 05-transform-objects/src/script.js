import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();

// Axes helper
const axesHelper = new THREE.AxesHelper(33);
scene.add(axesHelper);

// Group
const group = new THREE.Group();
[
  { pos: [0, 0, 1], color: 0xff0000 },
  { pos: [0, 1, 1], color: 0xe03404 },
  { pos: [1, 0, 1], color: 0x00ff00 },
  { pos: [0, 2, 1], color: 0x31004f },
  { pos: [3, 0, 2], color: 0x0000ff },
  { pos: [1, 2, 2], color: 0x02300f },
  { pos: [2, 0, 3], color: 0x4700ee },
  { pos: [2, 2, 2], color: 0xf6a077 },
].forEach((data) => {
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: data.color }),
  );
  cube.position.set(...data.pos);
  group.add(cube);
});

group.scale.set(2, 1, 0.2);
group.rotation.reorder('YXZ');
group.rotation.set(Math.PI / 2, 0, Math.PI / 2);

scene.add(group);

// Sizes
const sizes = { width: 1400, height: 900 };

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(1, 4, 14);
scene.add(camera);

// Renderer
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
