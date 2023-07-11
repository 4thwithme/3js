import * as THREE from "three";

THREE.ColorManagement.enabled = false;

const objOffset = 4;

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const light = new THREE.DirectionalLight("#ffffff", 1);
light.position.set(1, 1, 0);

const material = new THREE.MeshToonMaterial({
	color: "#ffeded",
	gradientMap: gradientTexture,
});

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
mesh1.position.x = 2;
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
mesh2.position.y = -objOffset;
mesh2.position.x = -2;

const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material);
mesh3.position.y = -objOffset * 2;
mesh3.position.x = 2;

const meshes = [mesh1, mesh2, mesh3];
scene.add(mesh1, mesh2, mesh3, light);

const particlesCount = 200;
const positions = new Float32Array(particlesCount);

for (let i = 0; i < particlesCount; i++) {
	positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
	positions[i * 3 + 1] = objOffset * 0.4 - Math.random() * objOffset * meshes.length;
	positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesMaterial = new THREE.PointsMaterial({
	color: "#ffeded",
	sizeAttenuation: true,
	size: 0.03,
});

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const point = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(point);

const sizes = { width: window.innerWidth, height: window.innerHeight };
window.addEventListener("resize", () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

let scrollY = window.scrollY;

document.addEventListener("scroll", () => {
	scrollY = window.scrollY;
});

const cursor = { x: 0, y: 0 };

document.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = event.clientY / sizes.height - 0.5;
});

const cameraGroup = new THREE.Group();
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);
scene.add(cameraGroup);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	camera.position.y = (-scrollY / sizes.height) * objOffset;

	cameraGroup.position.x = (cursor.x * 0.5 - cameraGroup.position.x) * 6 * deltaTime;
	cameraGroup.position.y = -(cursor.y * 0.5 - cameraGroup.position.y) * 6 * deltaTime;

	meshes.forEach((mesh) => {
		mesh.rotation.x = elapsedTime * 0.1;
		mesh.rotation.y = elapsedTime * 0.12;
	});

	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
