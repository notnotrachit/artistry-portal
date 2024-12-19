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
    
    if (this.keyStates['ArrowUp'] || this.keyStates['w']) {
      moveVector.z -= this.moveSpeed;
    }
    if (this.keyStates['ArrowDown'] || this.keyStates['s']) {
      moveVector.z += this.moveSpeed;
    }
    if (this.keyStates['ArrowLeft'] || this.keyStates['a']) {
      moveVector.x -= this.moveSpeed;
    }
    if (this.keyStates['ArrowRight'] || this.keyStates['d']) {
      moveVector.x += this.moveSpeed;
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
    if (this.keyStates['q']) {
      this.rotateCameraAroundCenter(this.rotationSpeed);
    }
    if (this.keyStates['e']) {
      this.rotateCameraAroundCenter(-this.rotationSpeed);
    }
  }

  private rotateCameraAroundCenter(angle: number) {
    const x = this.camera.position.x;
    const z = this.camera.position.z;
    this.camera.position.x = Math.cos(angle) * x - Math.sin(angle) * z;
    this.camera.position.z = Math.sin(angle) * x + Math.cos(angle) * z;
    this.camera.lookAt(0, 0, 0);
  }

  public cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}