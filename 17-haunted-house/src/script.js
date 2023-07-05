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

// Fog
const fog = new THREE.Fog(0x262835, 1, 30);
scene.fog = fog;

// Loaders
const textureLoader = new THREE.TextureLoader();

const colorTexture = textureLoader.load("textures/door/color.jpg");
const alphaTexture = textureLoader.load("textures/door/alpha.jpg");
const heightTexture = textureLoader.load("textures/door/height.jpg");
const normalTexture = textureLoader.load("textures/door/normal.jpg");
const ambTexture = textureLoader.load("textures/door/ambientOcclusion.jpg");
const metalnessTexture = textureLoader.load("textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("textures/door/roughness.jpg");

const bricksColorTexture = textureLoader.load("textures/bricks/color.jpg");
const bricksAmbTexture = textureLoader.load("textures/bricks/ambientOcclusion.jpg");
const bricksNormalTexture = textureLoader.load("textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load("textures/bricks/roughness.jpg");

const grassColorTexture = textureLoader.load("textures/grass/color.jpg");
const grassAmbTexture = textureLoader.load("textures/grass/ambientOcclusion.jpg");
const grassNormalTexture = textureLoader.load("textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load("textures/grass/roughness.jpg");

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
renderer.setClearColor(0x262835);

//  light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
scene.add(moonLight, ambientLight);

// Door Light

const doorLight = new THREE.PointLight(0xff7d56, 1, 7);
doorLight.position.set(0, 3, 4, 2);

// Floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(120, 120),
	new THREE.MeshStandardMaterial({
		map: grassColorTexture,
		aoMap: grassAmbTexture,
		normalMap: grassNormalTexture,
		metalnessMap: grassRoughnessTexture,
	})
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;

floor.geometry.setAttribute(
	"uv2",
	new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

grassColorTexture.repeat.set(148, 148);
grassAmbTexture.repeat.set(148, 148);
grassNormalTexture.repeat.set(148, 148);
grassRoughnessTexture.repeat.set(148, 148);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbTexture.wrapS = THREE.RepeatWrapping;
grassAmbTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

// House
const house = new THREE.Group();
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(5, 3, 5),
	new THREE.MeshStandardMaterial({
		map: bricksColorTexture,
		aoMap: bricksAmbTexture,
		normalMap: bricksNormalTexture,
		metalnessMap: bricksRoughnessTexture,
	})
);
const roof = new THREE.Mesh(
	new THREE.ConeGeometry(4.4, 3, 4, 2),
	new THREE.MeshStandardMaterial({ color: 0x5f3819 })
);

const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2, 50, 50),
	new THREE.MeshStandardMaterial({
		map: colorTexture,
		transparent: true,
		alphaMap: alphaTexture,
		aoMap: ambTexture,
		displacementMap: heightTexture,
		displacementScale: 0.1,
		normalMap: normalTexture,
		metalnessMap: metalnessTexture,
		roughnessMap: roughnessTexture,
	})
);

house.position.set(0, 0, 0);
walls.position.set(0, 1.5, 0);
walls.geometry.setAttribute(
	"uv2",
	new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);

roof.position.set(0, 4.5, 0);
roof.rotation.y = Math.PI * 0.25;
door.position.set(0, 1, 2.48);
door.geometry.setAttribute(
	"uv2",
	new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

house.add(walls, roof, door, doorLight);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x049912 });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush5 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush6 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(2.3, 0.2, 3);
bush1.scale.set(0.4, 0.4, 0.4);
bush2.position.set(2.8, 0.2, 3);
bush2.scale.set(0.3, 0.5, 0.3);

bush3.position.set(-3.1, 0.4, 3);
bush3.scale.set(0.3, 0.6, 0.3);
bush4.position.set(-2.7, 0.2, 3.4);
bush4.scale.set(0.3, 0.3, 0.3);

bush5.position.set(-3, 0.2, -3);
bush5.scale.set(0.3, 0.4, 0.3);
bush6.position.set(-3.5, 0.2, -3.5);
bush6.scale.set(0.3, 0.6, 0.3);

// Graves
const graves = new THREE.Group();

const graveGeometry = new THREE.BoxGeometry(0.5, 1, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 });

for (let i = 0; i < 30; i++) {
	const radius = Math.random() * 8 + 5;
	const angle = Math.random() * 2 * Math.PI;
	const x = Math.cos(angle) * radius;
	const z = Math.sin(angle) * radius;

	const grave = new THREE.Mesh(graveGeometry, graveMaterial);
	grave.castShadow = true;
	grave.position.set(x, 0.3, z);
	grave.rotation.set(0, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.3);
	graves.add(grave);
}

// Ghosts

const ghost1 = new THREE.PointLight(0x42dcad, 2, 3);
const ghost2 = new THREE.PointLight(0x36a684, 2, 3);
const ghost3 = new THREE.PointLight(0x2c6633, 2, 3);

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

[
	walls,
	bush1,
	bush2,
	bush3,
	bush4,
	bush5,
	bush6,
	moonLight,
	doorLight,
	ghost1,
	ghost2,
	ghost3,
].forEach((item) => {
	item.castShadow = true;
});

[doorLight, ghost1, ghost2, ghost3].forEach((item) => {
	item.shadow.mapSize.width = 256;
	item.shadow.mapSize.height = 256;
	item.shadow.mapSize.far = 7;
});

floor.receiveShadow = true;

scene.add(floor, house, bush1, bush2, bush3, bush4, bush5, bush6, graves, ghost1, ghost2, ghost3);

gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);

const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Ghosts movement
	const ghostAngle1 = elapsedTime * 0.7;
	ghost1.position.set(
		Math.cos(ghostAngle1) * 6,
		Math.cos(elapsedTime * 2),
		Math.sin(ghostAngle1) * 6
	);

	const ghostAngle2 = -elapsedTime * 0.35;
	ghost2.position.set(
		Math.cos(ghostAngle2) * 7,
		Math.cos(elapsedTime * 2) + Math.sin(elapsedTime * 2.5),
		Math.sin(ghostAngle2) * 7
	);

	const ghostAngle3 = elapsedTime * 0.1;
	ghost3.position.set(
		Math.cos(ghostAngle3) * (9 + Math.sin(elapsedTime * 2.5)),
		Math.cos(elapsedTime * 0.42),
		Math.sin(ghostAngle3) * (9 + Math.sin(elapsedTime * 0.9))
	);

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
