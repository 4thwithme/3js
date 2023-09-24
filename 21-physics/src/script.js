import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TYPES } from "./event-types";
import Worker from "./worker?worker";

const worker = new Worker(
  new URL("./worker.js", import.meta.url, { type: "module" })
);

worker.postMessage = worker.webkitPostMessage || worker.postMessage;

worker.postMessage({
  type: TYPES.createWorld,
  payload: {},
});

const objectsToUpdate = [];

const RADIUS = 0.25;

worker.onmessage = function ({ data }) {
  const { positions, quaternions } = data.payload;

  //update positions
  for (let i = 0; i < objectsToUpdate.length; i++) {
    if (objectsToUpdate[i]?.position && objectsToUpdate[i]?.quaternion) {
      objectsToUpdate[i].position.copy(positions[i]);
      objectsToUpdate[i].quaternion.copy(quaternions[i]);
    }
  }
};

THREE.ColorManagement.enabled = false;

const canvas = document.querySelector("canvas.webgl");

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

//Sphere
const sphereGeometry = new THREE.SphereGeometry(RADIUS, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

const createSphere = ({ position }) => {
  // js
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // physics
  worker.postMessage({
    type: TYPES.createSphere,
    payload: { radius: RADIUS, position },
  });

  return mesh;
};
// Box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.2,
  roughness: 0.6,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

const createBox = ({ w, h, d, position }) => {
  // js
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(w, h, d);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);
  // physics
  worker.postMessage({
    type: TYPES.createBox,
    payload: { w, h, d, position },
  });

  return mesh;
};

const scene = new THREE.Scene();

for (let i = 0; i < 100; i++) {
  objectsToUpdate.push(
    createBox({
      w: 0.5,
      h: 0.5,
      d: 0.5,
      position: {
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * 10,
      },
    }),
    createSphere({
      position: {
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * 10,
      },
    })
  );
}

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
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
camera.position.set(-3, 3, 3);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const delta = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  worker.postMessage({
    type: TYPES.tick,
    payload: { deltaTime: delta },
  });

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
