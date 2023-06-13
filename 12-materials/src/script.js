import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

// Debug panel
const gui = new GUI();

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
const cubeTextureLoader = new THREE.CubeTextureLoader();

const colorTexture = textureLoader.load("textures/door/color.jpg");
const alphaTexture = textureLoader.load("textures/door/alpha.jpg");
const heightTexture = textureLoader.load("textures/door/height.jpg");
const normalTexture = textureLoader.load("textures/door/normal.jpg");
const ambTexture = textureLoader.load("textures/door/ambientOcclusion.jpg");
const metalnessTexture = textureLoader.load("textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("textures/matcaps/3.png");
const gradientTexture = textureLoader.load("textures/gradients/5.jpg");

const environmentMapTexture = cubeTextureLoader.load([
  "textures/environmentMaps/4/px.png",
  "textures/environmentMaps/4/nx.png",
  "textures/environmentMaps/4/py.png",
  "textures/environmentMaps/4/ny.png",
  "textures/environmentMaps/4/pz.png",
  "textures/environmentMaps/4/nz.png",
]);

gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.gradientMap = false;

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

// const material = new THREE.MeshNormalMaterial({
//   // normalMap: normalTexture,
//   // flatShading: true,
// });

// const material = new THREE.MeshMatcapMaterial({
//   matcap: matcapTexture,
// });

// const material = new THREE.MeshDepthMaterial({});

// const material = new THREE.MeshLambertMaterial({ map: colorTexture, side: THREE.DoubleSide });

// const material = new THREE.MeshPhongMaterial({
//   map: colorTexture,
//   side: THREE.DoubleSide,
//   shininess: 10,
//   specular: new THREE.Color(0x1188ff),
//   normalMap: normalTexture,
//   normalScale: new THREE.Vector2(0.5, 0.5),
// });

// const material = new THREE.MeshToonMaterial({
//   gradientMap: gradientTexture,
//   side: THREE.DoubleSide,
// });

const material = new THREE.MeshStandardMaterial({
  map: colorTexture,
  aoMap: ambTexture,
  aoMapIntensity: 1,
  displacementMap: heightTexture,
  displacementScale: 0.05,
  metalnessMap: metalnessTexture,
  roughnessMap: roughnessTexture,
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(3, 3),
  alphaMap: alphaTexture,
  transparent: true,
  envMap: environmentMapTexture,
});

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.geometry.setAttribute("uv2", new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));
sphere.position.x = 1.5;
sphere.position.z = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute("uv2", new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));
plane.position.z = 1.5;

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.2, 64, 64), material);
torus.geometry.setAttribute("uv2", new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2));
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

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

gui.add(material, "wireframe");
gui.add(material, "flatShading");
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "aoMapIntensity").min(0).max(2).step(0.0001);
gui.add(material, "displacementScale").min(0).max(1).step(0.0001);
gui.add(material.normalScale, "x", 0, 10, 0.01).name("normalX");
gui.add(material.normalScale, "y", 0, 10, 0.01).name("normalY");

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
