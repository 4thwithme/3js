import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

THREE.ColorManagement.enabled = false;

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const galaxy = new THREE.Group();
const haloGroup = new THREE.Group();
const bodyGroup = new THREE.Group();

const generateGalaxy = ({
	countArms1,
	countArms2,
	countBody,
	countBody2,
	countGalo,
	countBulb,
	sizeArms1,
	sizeArms2,
	sizeBody,
	sizeBody2,
	sizeBulb,
	sizeGalo,
	insideColor: insideColorRaw,
	outsideColor: outsideColorRaw,
	bodyInsideColor: bodyInsideColorRaw,
	bodyOutsideColor: bodyOutsideColorRaw,
}) => {
	const insideColor = new THREE.Color(insideColorRaw);
	const outsideColor = new THREE.Color(outsideColorRaw);
	const bodyInsideColor = new THREE.Color(bodyInsideColorRaw);
	const bodyOutsideColor = new THREE.Color(bodyOutsideColorRaw);

	const particlesGeometryArms1 = new THREE.BufferGeometry(1, 32, 32);
	const particlesGeometryArms2 = new THREE.BufferGeometry(1, 32, 32);
	const particlesGeometryBody = new THREE.BufferGeometry(1, 32, 32);
	const particlesGeometryBody2 = new THREE.BufferGeometry(1, 32, 32);
	const particlesGeometryBulb = new THREE.BufferGeometry(1, 32, 32);
	const particlesGeometryGalo = new THREE.BufferGeometry(1, 32, 32);

	// ARMS
	const positionsArms1 = new Float32Array(countArms1 * 3);
	const colorsArms1 = new Float32Array(countArms1 * 3);
	const positionsArms2 = new Float32Array(countArms2 * 3);
	const colorsArms2 = new Float32Array(countArms2 * 3);

	for (let i = 0; i < countArms1; i++) {
		const angle = Math.random() * Math.PI * 3;
		const i3 = i * 3;

		positionsArms1[i3 + 0] = 1 * Math.sqrt(angle) * Math.cos(angle) + (Math.random() - 0.5) * 0.4;
		positionsArms1[i3 + 1] = (Math.random() - 0.5) * Math.random() * 0.4;
		positionsArms1[i3 + 2] = 1 * Math.sqrt(angle) * Math.sin(angle) + (Math.random() - 0.5) * 0.4;

		const mixedColor = insideColor.clone();
		mixedColor.lerp(outsideColor, angle / (Math.PI * 2));

		colorsArms1[i3 + 0] = mixedColor.r;
		colorsArms1[i3 + 1] = mixedColor.g;
		colorsArms1[i3 + 2] = mixedColor.b;
	}
	for (let i = 0; i < countArms2; i++) {
		const angle = Math.random() * Math.PI * 3;
		const i3 = i * 3;

		positionsArms2[i3 + 0] = -1 * Math.sqrt(angle) * Math.cos(angle) + (Math.random() - 0.5) * 0.4;
		positionsArms2[i3 + 1] = (Math.random() - 0.5) * Math.random() * 0.4;
		positionsArms2[i3 + 2] = -1 * Math.sqrt(angle) * Math.sin(angle) + (Math.random() - 0.5) * 0.4;

		const mixedColor = insideColor.clone();
		mixedColor.lerp(outsideColor, angle / (Math.PI * 2));

		colorsArms2[i3 + 0] = mixedColor.r;
		colorsArms2[i3 + 1] = mixedColor.g;
		colorsArms2[i3 + 2] = mixedColor.b;
	}

	// BODY
	const positionsBody = new Float32Array(countBody * 3);
	for (let i = 0; i < countBody; i++) {
		const angle = Math.random() * 2 * Math.PI;

		const random = Math.random();
		const i3 = i * 3;
		/*x*/ positionsBody[i3 + 0] = Math.sin(angle) * random * 5;
		/*y*/ positionsBody[i3 + 1] = (Math.random() - 0.5) * 0.45;
		/*z*/ positionsBody[i3 + 2] = Math.cos(angle) * random * 5;
	}

	// BODY2
	const positionsBody2 = new Float32Array(countBody2 * 3);
	const colorsBody2 = new Float32Array(countBody2 * 3);

	for (let i = 0; i < countBody2; i++) {
		const angle = Math.random() * 2 * Math.PI;

		const random = Math.random();
		const i3 = i * 3;
		/*x*/ positionsBody2[i3 + 0] = Math.sin(angle) * random * 3;
		/*y*/ positionsBody2[i3 + 1] = (Math.random() - 0.5) * Math.random() * 0.3;
		/*z*/ positionsBody2[i3 + 2] = Math.cos(angle) * random * 3;

		const mixedColor = bodyInsideColor.clone();
		mixedColor.lerp(bodyOutsideColor, (random * 2.5) / 2.5);

		colorsBody2[i3 + 0] = mixedColor.r;
		colorsBody2[i3 + 1] = mixedColor.g;
		colorsBody2[i3 + 2] = mixedColor.b;
	}

	// BULB
	const positionsBulb = new Float32Array(countBulb * 3);
	for (let i = 0; i < countBulb; i++) {
		const angle1 = Math.random() * 2 * Math.PI;
		const angle2 = Math.random() * 2 * Math.PI;

		const i3 = i * 3;

		const random = Math.random();
		/*x*/ positionsBulb[i3 + 0] = Math.cos(angle1) * random * 0.5;
		/*y*/ positionsBulb[i3 + 1] = Math.sin(angle1) * Math.cos(angle2) * random * 0.4;
		/*z*/ positionsBulb[i3 + 2] = Math.sin(angle1) * Math.sin(angle2) * random * 0.5;
	}

	// GALO
	const positionsGalo = new Float32Array(countGalo * 3);
	for (let i = 0; i < countGalo; i++) {
		const angle1 = Math.random() * 2 * Math.PI;
		const angle2 = Math.random() * 2 * Math.PI;

		const i3 = i * 3;

		const random = Math.random();
		/*x*/ positionsGalo[i3 + 0] = Math.cos(angle1) * random * 10;
		/*y*/ positionsGalo[i3 + 1] = Math.sin(angle1) * Math.cos(angle2) * random * 10;
		/*z*/ positionsGalo[i3 + 2] = Math.sin(angle1) * Math.sin(angle2) * random * 10;
	}

	// ADD

	particlesGeometryArms1.setAttribute("position", new THREE.BufferAttribute(positionsArms1, 3));
	particlesGeometryArms1.setAttribute("color", new THREE.BufferAttribute(colorsArms1, 3));
	particlesGeometryArms2.setAttribute("position", new THREE.BufferAttribute(positionsArms2, 3));
	particlesGeometryArms2.setAttribute("color", new THREE.BufferAttribute(colorsArms2, 3));

	particlesGeometryBody.setAttribute("position", new THREE.BufferAttribute(positionsBody, 3));

	particlesGeometryBody2.setAttribute("position", new THREE.BufferAttribute(positionsBody2, 3));
	particlesGeometryBody2.setAttribute("color", new THREE.BufferAttribute(colorsBody2, 3));

	particlesGeometryBulb.setAttribute("position", new THREE.BufferAttribute(positionsBulb, 3));
	particlesGeometryGalo.setAttribute("position", new THREE.BufferAttribute(positionsGalo, 3));

	const particlesMaterialArms1 = new THREE.PointsMaterial({
		size: sizeArms1,
		sizeAttenuation: true,
		color: 0xffffff,
		transparent: true,
		alphaTest: 0.001,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexColors: true,
	});

	const particlesMaterialArms2 = new THREE.PointsMaterial({
		size: sizeArms2,
		sizeAttenuation: true,
		color: 0xffffff,
		transparent: true,
		alphaTest: 0.001,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexColors: true,
	});

	const particlesMaterialBody = new THREE.PointsMaterial({
		size: sizeBody,
		sizeAttenuation: true,
		color: 0xffffff,
		transparent: true,
		alphaTest: 0.001,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		color: 0x94b7f4,
	});

	const particlesMaterialBody2 = new THREE.PointsMaterial({
		size: sizeBody2,
		sizeAttenuation: true,
		color: 0xffffff,
		transparent: true,
		alphaTest: 0.001,
		depthWrite: false,
		vertexColors: true,
		blending: THREE.AdditiveBlending,
	});

	const particlesMaterialBulb = new THREE.PointsMaterial({
		size: sizeBulb,
		sizeAttenuation: true,
		color: 0xffffff,
		transparent: true,
		alphaTest: 0.001,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
	});

	const particlesMaterialGalo = new THREE.PointsMaterial({
		size: sizeGalo,
		sizeAttenuation: true,
		color: 0xffffff,
		transparent: true,
		alphaTest: 0.001,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
	});

	const pointsArms1 = new THREE.Points(particlesGeometryArms1, particlesMaterialArms1);
	const pointsArms2 = new THREE.Points(particlesGeometryArms2, particlesMaterialArms2);
	const pointsBody = new THREE.Points(particlesGeometryBody, particlesMaterialBody);
	const pointsBody2 = new THREE.Points(particlesGeometryBody2, particlesMaterialBody2);
	const pointsBulb = new THREE.Points(particlesGeometryBulb, particlesMaterialBulb);
	const pointsGalo = new THREE.Points(particlesGeometryGalo, particlesMaterialGalo);

	galaxy.add(pointsArms1, pointsArms2, pointsBody2, pointsBulb);
	haloGroup.add(pointsGalo);
	bodyGroup.add(pointsBody);

	scene.add(galaxy, haloGroup, bodyGroup);
};

generateGalaxy({
	countArms1: 20000,
	countArms2: 20000,
	countBody: 2000,
	countBody2: 58000,
	countGalo: 3000,
	countBulb: 5000,
	sizeArms1: 0.008,
	sizeArms2: 0.008,
	sizeBody: 0.015,
	sizeBody2: 0.015,
	sizeBulb: 0.008,
	sizeGalo: 0.008,
	insideColor: 0xb9fcf9,
	outsideColor: 0xbfe1ff,

	bodyInsideColor: 0xfa7777,
	bodyOutsideColor: 0xccd1e5,
});

const sizes = { width: window.innerWidth, height: window.innerHeight };

window.addEventListener("resize", () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;

scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	galaxy.rotation.y = elapsedTime * 0.15;
	haloGroup.rotation.y = elapsedTime * 0.05;
	bodyGroup.rotation.y = elapsedTime * 0.1;

	controls.update();

	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
