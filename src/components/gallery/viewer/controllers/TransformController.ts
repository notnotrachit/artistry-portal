import * as THREE from 'three';

export interface TransformUpdate {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number };
}

export class TransformController {
  private readonly RAD_TO_DEG = 180 / Math.PI;

  constructor(private onUpdate?: (id: string, update: TransformUpdate) => void) {}

  handlePositionChange(mesh: THREE.Mesh, movementX: number, movementY: number, isZAxis: boolean = false) {
    if (isZAxis) {
      mesh.position.z -= movementY;
    } else {
      mesh.position.x += movementX;
      mesh.position.y -= movementY;
    }
    this.notifyUpdate(mesh);
  }

  handleRotation(mesh: THREE.Mesh, movementX: number, movementY: number) {
    mesh.rotation.y += movementX;
    mesh.rotation.x += movementY;
    this.notifyUpdate(mesh);
  }

  handleScale(mesh: THREE.Mesh, movementY: number) {
    const scaleChange = -movementY;
    mesh.scale.x = Math.max(0.1, mesh.scale.x + scaleChange);
    mesh.scale.y = Math.max(0.1, mesh.scale.y + scaleChange);
    this.notifyUpdate(mesh);
  }

  private notifyUpdate(mesh: THREE.Mesh) {
    if (this.onUpdate && mesh.userData.id) {
      this.onUpdate(mesh.userData.id, {
        position: {
          x: Number(mesh.position.x.toFixed(3)),
          y: Number(mesh.position.y.toFixed(3)),
          z: Number(mesh.position.z.toFixed(3))
        },
        rotation: {
          x: Number((mesh.rotation.x * this.RAD_TO_DEG).toFixed(3)),
          y: Number((mesh.rotation.y * this.RAD_TO_DEG).toFixed(3)),
          z: Number((mesh.rotation.z * this.RAD_TO_DEG).toFixed(3))
        },
        scale: {
          x: Number(mesh.scale.x.toFixed(3)),
          y: Number(mesh.scale.y.toFixed(3))
        }
      });
    }
  }
}