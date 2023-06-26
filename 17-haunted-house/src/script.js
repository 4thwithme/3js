import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;
const sizes = { width: window.innerWidth, height: window.innerHeight };

window.addEventListener("resize", () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Debug
const gui = new dat.GUI();
// Canvas
const canvas = document.querySelector("canvas.webgl");
// Scene
const scene = new THREE.Scene();

// Loaders

const textureLoader = new THREE.TextureLoader();

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
const axes = new THREE.AxesHelper(22);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera, axes);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//  light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
const moonLight = new THREE.DirectionalLight("#ffffff", 0.5);
moonLight.position.set(4, 5, -2);
scene.add(moonLight, ambientLight);

// Floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({ color: "#a9c388" })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
// House
const house = new THREE.Group();
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(5, 3, 5),
	new THREE.MeshStandardMaterial({ color: 0x03eaf1 })
);
const roof = new THREE.Mesh(
	new THREE.ConeGeometry(4, 2, 4, 2),
	new THREE.MeshStandardMaterial({ color: 0x0000f3 })
);

const door = new THREE.Mesh(
	new THREE.PlaneGeometry(1, 2, 100, 100),
	new THREE.MeshStandardMaterial({})
);

house.position.set(0, 0, 0);
walls.position.set(0, 1.5, 0);
roof.position.set(0, 4, 0);
roof.rotation.y = Math.PI * 0.25;

house.add(walls, roof);
scene.add(floor, house);

gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);

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
