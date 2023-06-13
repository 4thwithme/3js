import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import * as dat from "lil-gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
// scene.add(cube);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Axes Helper
// const axes = new THREE.AxesHelper(22);
// scene.add(axes);

// Font

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/matcap1.png");

const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

const fontLoader = new FontLoader();
fontLoader.load("/fonts/integral.json", (font) => {
  const textGeometry = new TextGeometry("ANDRII POPENKO", {
    font,
    size: 0.4,
    height: 0.01,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();
  const mesh = new THREE.Mesh(textGeometry, material);
  scene.add(mesh);
});

fontLoader.load("/fonts/nun.json", (font) => {
  const textGeometry = new TextGeometry("Software Engineer", {
    font,
    size: 0.1,
    height: 0.1,
    curveSegments: 3,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();
  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const mesh = new THREE.Mesh(textGeometry, material);
  mesh.position.y = 0.5;
  scene.add(mesh);
});

// Donuts

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

const donut2Geometry = new THREE.SphereGeometry(0.3, 20, 20);

const donut3Geometry = new THREE.ConeGeometry(0.3, 0.5, 20, 20);

const donut4Geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);

for (let i = 0; i < 200; i++) {
  const donut = new THREE.Mesh(donutGeometry, material);

  donut.position.set((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10);
  donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  const scale = Math.random();
  donut.scale.set(scale, scale, scale);
  donut.rotation.reorder("YXZ");
  donut.castShadow = true;
  scene.add(donut);

  const donut2 = new THREE.Mesh(donut2Geometry, material);

  donut2.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
  donut2.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  const scale2 = Math.random();
  donut2.scale.set(scale2, scale2, scale2);
  donut2.rotation.reorder("YXZ");
  donut2.castShadow = true;
  scene.add(donut2);
}

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
