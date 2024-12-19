import * as THREE from 'three';

interface Bounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  minY: number;
  maxY: number;
}

export class CameraControls {
  private camera: THREE.PerspectiveCamera;
  private keyStates: { [key: string]: boolean } = {};
  private rotationSpeed = 0.02;
  private moveSpeed = 0.1;
  private bounds: Bounds;

  constructor(camera: THREE.PerspectiveCamera, bounds: Bounds) {
    this.camera = camera;
    this.bounds = bounds;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.keyStates[event.key] = true;
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    this.keyStates[event.key] = false;
  };

  private clampPosition(position: THREE.Vector3): THREE.Vector3 {
    position.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, position.x));
    position.y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY, position.y));
    position.z = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, position.z));
    return position;
  }

  public update() {
    this.handleCameraMovement();
    this.handleCameraRotation();
    this.camera.position.copy(this.clampPosition(this.camera.position));
  }

  private handleCameraMovement() {
    const moveVector = new THREE.Vector3();
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    
    // Calculate forward and right vectors based on camera orientation
    const forward = direction.clone();
    forward.y = 0; // Keep movement in horizontal plane
    forward.normalize();
    
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));
    
    if (this.keyStates['ArrowUp'] || this.keyStates['w']) {
      moveVector.add(forward.multiplyScalar(this.moveSpeed));
    }
    if (this.keyStates['ArrowDown'] || this.keyStates['s']) {
      moveVector.add(forward.multiplyScalar(-this.moveSpeed));
    }
    if (this.keyStates['ArrowLeft'] || this.keyStates['a']) {
      moveVector.add(right.multiplyScalar(-this.moveSpeed));
    }
    if (this.keyStates['ArrowRight'] || this.keyStates['d']) {
      moveVector.add(right.multiplyScalar(this.moveSpeed));
    }

    // Apply movement with bounds checking
    const newPosition = this.camera.position.clone().add(moveVector);
    if (this.isWithinBounds(newPosition)) {
      this.camera.position.copy(newPosition);
    }
  }

  private isWithinBounds(position: THREE.Vector3): boolean {
    return (
      position.x >= this.bounds.minX &&
      position.x <= this.bounds.maxX &&
      position.z >= this.bounds.minZ &&
      position.z <= this.bounds.maxZ &&
      position.y >= this.bounds.minY &&
      position.y <= this.bounds.maxY
    );
  }

  private handleCameraRotation() {
    if (this.keyStates['q'] || this.keyStates['e']) {
      const rotationAngle = (this.keyStates['q'] ? 1 : -1) * this.rotationSpeed;
      
      // Create rotation matrix around Y axis
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationY(rotationAngle);
      
      // Get current camera direction
      const direction = new THREE.Vector3();
      this.camera.getWorldDirection(direction);
      
      // Apply rotation to direction vector
      direction.applyMatrix4(rotationMatrix);
      
      // Calculate new look-at point based on current position and rotated direction
      const lookAtPoint = new THREE.Vector3();
      lookAtPoint.addVectors(this.camera.position, direction);
      
      // Update camera to look at the new point
      this.camera.lookAt(lookAtPoint);
    }
  }

  public cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}