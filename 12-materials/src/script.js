import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const sizes = { width: window.innerWidth, height: window.innerHeight };

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Textures
const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load("textures/door/color.jpg");
const alphaTexture = textureLoader.load("textures/door/alpha.jpg");
const heightTexture = textureLoader.load("textures/door/height.jpg");
const normalTexture = textureLoader.load("textures/door/normal.jpg");
const ambTexture = textureLoader.load("textures/door/ambientOcclusion.jpg");
const metalnessTexture = textureLoader.load("textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("textures/matcaps/1.png");
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");

colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;

// Objects

// const material = new THREE.MeshBasicMaterial({
//   map: colorTexture,
//   alphaMap: alphaTexture,
//   transparent: true,
//   opacity: 0.5,
//   side: THREE.DoubleSide,
// });

const material = new THREE.MeshNormalMaterial({
  normalMap: normalTexture,
});

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.x = 1.5;
sphere.position.z = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
plane.position.z = 1.5;

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.2, 16, 32), material);
torus.position.x = -1.5;
torus.position.z = 1.5;

scene.add(plane, sphere, torus);

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 5;
scene.add(camera);

// Axes
const axesHelper = new THREE.AxesHelper(22);
scene.add(axesHelper);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.2 * elapsedTime;
  torus.rotation.y = 0.2 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
