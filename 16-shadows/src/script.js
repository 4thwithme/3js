import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

// Debug
const gui = new dat.GUI();

// Textures
const texturesLoader = new THREE.TextureLoader();
const backedShadow = texturesLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = texturesLoader.load("/textures/simpleShadow.jpg");

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(2, 2, -1);

directionalLight.castShadow = false;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.top = 3;
directionalLight.shadow.camera.right = 3;
directionalLight.shadow.camera.bottom = -3;
directionalLight.shadow.camera.left = -3;
directionalLight.shadow.radius = 3;

scene.add(directionalLight);

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);
directionalLightCameraHelper.visible = false;

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
  // new THREE.MeshBasicMaterial({
  //   map: backedShadow,
  // })
);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = 0;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.set(0, 0.5, 0);
sphere.castShadow = false;

const SPHERE_SHADOW_SIZE = 1.5;
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(SPHERE_SHADOW_SIZE, SPHERE_SHADOW_SIZE),
  new THREE.MeshBasicMaterial({
    alphaMap: simpleShadow,
    color: 0x000000,
    transparent: true,
  })
);
sphereShadow.lookAt(sphere.position);
sphereShadow.position.set(sphere.position.x, plane.position.y + 0.0001, sphere.position.z);

scene.add(sphereShadow);

scene.add(sphere, plane);

const sizes = { width: window.innerWidth, height: window.innerHeight };

// Spot Light
// const spotLight = new THREE.SpotLight(0xffffff, 0.3, 9, Math.PI * 0.1);
// spotLight.position.set(0, 3, 2);
// spotLight.lookAt(sphere.position);
// spotLight.castShadow = false;
// spotLight.shadow.camera.near = 1;
// spotLight.shadow.camera.far = 5;
// const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// spotLightHelper.visible = false;
// scene.add(spotLight, spotLight.target, spotLightHelper);

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 0.3, 5, 1);
const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLight.position.set(-1, 1, 0);
pointLight.castShadow = false;
pointLight.shadow.camera.near = 0.4;
pointLight.shadow.camera.far = 2;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLightHelper.visible = false;

scene.add(pointLight, pointLightHelper);

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
const axesHelper = new THREE.AxesHelper(22);
scene.add(axesHelper);

gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

const clock = new THREE.Clock();

const tick = () => {
  // Update controls
  controls.update();

  const elapsedTime = clock.getElapsedTime();
  sphere.position.x = Math.cos(elapsedTime);
  sphere.position.z = Math.sin(elapsedTime);
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 2)) + 0.5;
  sphereShadow.position.set(sphere.position.x, plane.position.y + 0.0001, sphere.position.z);
  sphereShadow.material.opacity = 1 / sphere.position.y - 0.3;
  // Render
  renderer.shadowMap.enabled = false;
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
