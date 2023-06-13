import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0x3400ff, 0.3);
// directionalLight.position.set(-2, 3, 4);
// scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5, 10, 2);
pointLight.position.set(1, 1.4, 1.2);
scene.add(pointLight);

const hemisphereLight = new THREE.HemisphereLight(0xffff44, 0xffffee, 0.1);
scene.add(hemisphereLight);

// const rectAreaLight = new THREE.RectAreaLight(0xff00ff, 2, 4, 4);
// rectAreaLight.position.z = 4;
// rectAreaLight.lookAt(new THREE.Vector3());
// scene.add(rectAreaLight);

// const spotLight = new THREE.SpotLight("orange", 0.5, 10, Math.PI * 0.1, 0.25, 2);
// spotLight.position.set(0, 2, 3);
// scene.add(spotLight);

// Helpers

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1);
// scene.add(pointLightHelper);

// Material
const material = new THREE.MeshStandardMaterial({
  roughness: 0.4,
  side: THREE.DoubleSide,
});

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Axes helper
const axes = new THREE.AxesHelper(22);
scene.add(axes);

const clock = new THREE.Clock();

// gui.add(ambientLight, "intensity").min(0).max(1).step(0.01);

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
