import * as THREE from 'three';

export class CameraControls {
  private camera: THREE.PerspectiveCamera;
  private keyStates: { [key: string]: boolean } = {};
  private rotationSpeed = 0.02;
  private moveSpeed = 0.1;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
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

  public update() {
    this.handleCameraMovement();
    this.handleCameraRotation();
  }

  private handleCameraMovement() {
    if (this.keyStates['ArrowUp']) {
      this.camera.position.z -= this.moveSpeed;
    }
    if (this.keyStates['ArrowDown']) {
      this.camera.position.z += this.moveSpeed;
    }
  }

  private handleCameraRotation() {
    if (this.keyStates['ArrowLeft']) {
      this.rotateCameraAroundCenter(this.rotationSpeed);
    }
    if (this.keyStates['ArrowRight']) {
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