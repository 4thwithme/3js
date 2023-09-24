import CANNON from "cannon";
import { TYPES } from "./event-types";

let world = null;

const bodies = [];

self.onmessage = ({ data }) => {
  // eslint-disable-next-line no-console
  console.log("data.type", data.type);
  switch (data.type) {
    case TYPES.createSphere: {
      const { radius, position } = data.payload;

      const shape = new CANNON.Sphere(radius);
      const body = new CANNON.Body({
        mass: 1,
        shape,
      });
      body.position.copy(position);
      bodies.push(body);
      world.addBody(body);
      break;
    }

    case TYPES.createBox: {
      const { w, h, d, position } = data.payload;

      const shape = new CANNON.Box(
        new CANNON.Vec3(Math.abs(w) / 2, Math.abs(h) / 2, Math.abs(d) / 2)
      );
      const body = new CANNON.Body({
        mass: 1,
        shape,
      });
      body.position.copy(position);
      bodies.push(body);
      world.addBody(body);
      break;
    }

    case TYPES.createWorld: {
      world = new CANNON.World();
      world.allowSleep = true;
      world.broadphase = new CANNON.SAPBroadphase(world);
      world.gravity.set(0, -9.81, 0);
      const concreteMaterial = new CANNON.Material("concreate");
      const defaultMaterial = new CANNON.Material("default");

      const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        { friction: 0.4, restitution: 0.7 }
      );

      const planeShape = new CANNON.Plane();
      const planeBody = new CANNON.Body({
        mass: 0,
        shape: planeShape,
        material: concreteMaterial,
      });
      planeBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(-1, 0, 0),
        Math.PI / 2
      );
      world.addBody(planeBody);

      world.defaultContactMaterial = defaultContactMaterial;
      break;
    }

    case TYPES.tick: {
      const { deltaTime } = data.payload;

      world.step(1 / 144, deltaTime, 3);

      self.postMessage({
        type: TYPES.updatePositionsAndQuaternions,
        payload: {
          positions: bodies.map((b) => b.position),
          quaternions: bodies.map((b) => b.quaternion),
        },
      });
      break;
    }

    default: {
      console.log("...");
      break;
    }
  }
};
