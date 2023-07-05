import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;

const gui = new dat.GUI();

const sizes = { width: window.innerWidth, height: window.innerHeight };

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();
const axes = new THREE.AxesHelper(22);

const textureLoader = new THREE.TextureLoader();
const star8Texture = textureLoader.load("/textures/particles/star_01.png");

window.addEventListener("resize", () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const particlesGeometry = new THREE.BufferGeometry(1, 32, 32);
const particlesMaterial = new THREE.PointsMaterial({
	size: 0.1,
	sizeAttenuation: true,
	transparent: true,
	alphaMap: star8Texture,
	alphaTest: 0.001,
	depthWrite: false,
	vertexColors: true,
});
const points = new THREE.Points(particlesGeometry, particlesMaterial);

const count = 20000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
	positions[i] = (Math.random() - 0.5) * 10;
	colors[i] = Math.random();
}

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera, axes, points);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
