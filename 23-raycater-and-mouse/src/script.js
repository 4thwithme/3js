import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const axes = new THREE.AxesHelper();
scene.add(axes);

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/matcaps/matcap1.png");

const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshMatcapMaterial({ matcap: matcapTexture, color: "#222323" })
);
object1.position.x = -2;
const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshMatcapMaterial({ matcap: matcapTexture, color: "#222323" })
);
const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshMatcapMaterial({ matcap: matcapTexture, color: "#222323" })
);
object3.position.x = 2;

const platform = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 12),
  new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
);
platform.material.color.set("#ff00ff");
platform.rotation.x = -Math.PI * 0.5;
platform.position.y = -3;

const objToTest = [object1, object2, object3];
scene.add(object1, object2, object3, platform);

const sizes = { width: window.innerWidth, height: window.innerHeight };

// raycast
const raycaster = new THREE.Raycaster();

const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0).normalize();

// raycaster.set(rayOrigin, rayDirection);

// raycast

// mouse

const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

// mouse

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
camera.position.y = 2;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  raycaster.setFromCamera(mouse, camera);
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  const intersects = raycaster.intersectObjects(objToTest);

  for (const intersect of intersects) {
    intersect.object.material.color.set("#e3ff23");
  }

  for (const object of objToTest) {
    if (!intersects.find((intersect) => intersect.object === object)) {
      object.material.color.set("#222323");
    }
  }

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
