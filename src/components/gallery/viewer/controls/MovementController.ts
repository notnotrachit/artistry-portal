import * as THREE from 'three';
import { Bounds, CameraState } from '../types/CameraTypes';

export class MovementController {
  private moveSpeed = 0.1;
  private verticalBounds = { min: 0.5, max: 5 }; // Limit vertical movement

  constructor(private camera: THREE.PerspectiveCamera, private bounds: Bounds) {}

  handleMovement(keyStates: CameraState['keyStates']): void {
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const sideDirection = new THREE.Vector3(-direction.z, 0, direction.x);
    let newPosition = this.camera.position.clone();

    if (keyStates['w'] || keyStates['arrowup']) {
      newPosition.add(direction.multiplyScalar(this.moveSpeed));
    }
    if (keyStates['s'] || keyStates['arrowdown']) {
      newPosition.sub(direction.multiplyScalar(this.moveSpeed));
    }
    if (keyStates['d'] || keyStates['arrowright']) {
      newPosition.add(sideDirection.multiplyScalar(this.moveSpeed));
    }
    if (keyStates['a'] || keyStates['arrowleft']) {
      newPosition.sub(sideDirection.multiplyScalar(this.moveSpeed));
    }
    
    // Vertical movement using PageUp and PageDown
    if (keyStates['pagedown']) {
      newPosition.y -= this.moveSpeed;
    }
    if (keyStates['pageup']) {
      newPosition.y += this.moveSpeed;
    }

    // Apply bounds
    newPosition.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, newPosition.x));
    newPosition.z = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, newPosition.z));
    newPosition.y = Math.max(this.verticalBounds.min, Math.min(this.verticalBounds.max, newPosition.y));

    this.camera.position.copy(newPosition);
  }
}