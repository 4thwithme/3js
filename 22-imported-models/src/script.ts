import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as dat from 'lil-gui';

THREE.ColorManagement.enabled = false;

const gui = new dat.GUI();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer: THREE.AnimationMixer | null = null;
let fox: THREE.Group | null = null;

// gltfLoader.load('/models/Duck/glTF-Draco/Duck.gltf', (gltf) => {
// 	gltf.scene.position.set(-4, 0, 4);
// 	scene.add(gltf.scene);
// });

// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
// 	gltf.scene.position.set(-2, 0, 1);
// 	scene.add(gltf.scene);
// });

gltfLoader.load('/models/Fox/glTF-Binary/Fox.glb', (gltf) => {
	mixer = new THREE.AnimationMixer(gltf.scene);
	fox = gltf.scene;

	const action = mixer.clipAction(gltf.animations[2]);
	mixer.timeScale = 3;
	action.play();
	action;

	gltf.scene.position.set(2, 0, -50);
	gltf.scene.scale.set(0.025, 0.025, 0.025);
	scene.add(gltf.scene);
});

const canvas = document.querySelector('canvas.webgl') as HTMLElement;

const scene = new THREE.Scene();

const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 100),
	new THREE.MeshStandardMaterial({
		color: '#444444',
		metalness: 0,
		roughness: 0.5,
	}),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
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
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100,
);
camera.position.set(2, 10, 52);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });

renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	// eslint-disable-next-line no-console
	console.log('deltaTime', 1 / deltaTime);

	mixer?.update(deltaTime);
	if (fox) {
		fox.position.z = fox?.position.z! + 0.25;
	}

	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
