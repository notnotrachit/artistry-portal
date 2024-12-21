import * as THREE from 'three';
import { CameraState } from '../types/CameraTypes';

export class RotationController {
  private rotationSpeed = 0.02;
  private mouseSensitivity = 0.003;
  private readonly maxVerticalAngle = Math.PI / 3;

  constructor(private camera: THREE.PerspectiveCamera) {}

  handleKeyboardRotation(keyStates: CameraState['keyStates'], verticalAngle: number): number {
    let newVerticalAngle = verticalAngle;

    // Horizontal rotation (Q/E keys)
    if (keyStates['q'] || keyStates['e']) {
      const rotationAngle = (keyStates['q'] ? 1 : -1) * this.rotationSpeed;
      const direction = new THREE.Vector3();
      this.camera.getWorldDirection(direction);
      
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationY(rotationAngle);
      direction.applyMatrix4(rotationMatrix);
      
      direction.y = Math.sin(verticalAngle);
      direction.normalize();
      
      const lookAtPoint = new THREE.Vector3();
      lookAtPoint.addVectors(this.camera.position, direction);
      this.camera.lookAt(lookAtPoint);
    }

    // Vertical rotation (R/F keys) - Reversed the direction
    if (keyStates['f'] || keyStates['r']) {
      const verticalRotation = (keyStates['f'] ? -1 : 1) * this.rotationSpeed;
      newVerticalAngle = this.calculateNewVerticalAngle(verticalAngle, verticalRotation);
      this.applyVerticalRotation(newVerticalAngle);
    }

    return newVerticalAngle;
  }

  handleMouseRotation(deltaX: number, deltaY: number, verticalAngle: number): number {
    // Horizontal rotation
    const horizontalRotation = -deltaX * this.mouseSensitivity;
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    const horizontalAxis = new THREE.Vector3(0, 1, 0);
    direction.applyAxisAngle(horizontalAxis, horizontalRotation);

    // Vertical rotation
    const verticalRotation = -deltaY * this.mouseSensitivity;
    const newVerticalAngle = this.calculateNewVerticalAngle(verticalAngle, verticalRotation);
    
    direction.y = Math.sin(newVerticalAngle);
    direction.normalize();

    const lookAtPoint = new THREE.Vector3();
    lookAtPoint.addVectors(this.camera.position, direction);
    this.camera.lookAt(lookAtPoint);

    return newVerticalAngle;
  }

  private calculateNewVerticalAngle(currentAngle: number, rotation: number): number {
    return Math.max(
      -this.maxVerticalAngle,
      Math.min(this.maxVerticalAngle, currentAngle + rotation)
    );
  }

  private applyVerticalRotation(verticalAngle: number): void {
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    direction.y = Math.sin(verticalAngle);
    direction.normalize();

    const lookAtPoint = new THREE.Vector3();
    lookAtPoint.addVectors(this.camera.position, direction);
    this.camera.lookAt(lookAtPoint);
  }
}