import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const sizes = { width: window.innerWidth, height: window.innerHeight };

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    canvas.requestFullscreen?.() ?? canvas.webkitRequestFullscreen?.();
  } else {
    document.exitFullscreen?.() ?? document.webkitExitFullscreen?.();
  }
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Custom geometry
const count = 500;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = Math.random() - 0.5;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", positionsAttribute);

const material = new THREE.MeshBasicMaterial({ color: 0xe4b633, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sphere
const geometry2 = new THREE.SphereGeometry(1, 16, 16);
const material2 = new THREE.MeshBasicMaterial({ color: 0x4abb73, wireframe: true });
const mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.position.y = 3;
scene.add(mesh2);

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5;
camera.position.x = 2;
camera.position.y = 1;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Axes
const axesHelper = new THREE.AxesHelper(22);
scene.add(axesHelper);

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
