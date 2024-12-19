import * as THREE from 'three';

interface Bounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export class CameraControls {
  private camera: THREE.PerspectiveCamera;
  private keyStates: { [key: string]: boolean } = {};
  private rotationSpeed = 0.02;
  private moveSpeed = 0.1;
  private bounds: Bounds;
  private verticalAngle = 0;
  private readonly maxVerticalAngle = Math.PI / 3; // 60 degrees up/down
  private isRightMouseDown = false;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private mouseSensitivity = 0.003;

  constructor(camera: THREE.PerspectiveCamera, bounds: Bounds) {
    this.camera = camera;
    this.bounds = bounds;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.keyStates[event.key.toLowerCase()] = true;
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    this.keyStates[event.key.toLowerCase()] = false;
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (event.button === 2) { // Right mouse button
      this.isRightMouseDown = true;
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
    }
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (this.isRightMouseDown) {
      const deltaX = event.clientX - this.lastMouseX;
      const deltaY = event.clientY - this.lastMouseY;

      // Horizontal rotation
      const horizontalRotation = -deltaX * this.mouseSensitivity;
      const direction = new THREE.Vector3();
      this.camera.getWorldDirection(direction);
      const horizontalAxis = new THREE.Vector3(0, 1, 0);
      direction.applyAxisAngle(horizontalAxis, horizontalRotation);

      // Vertical rotation
      const verticalRotation = -deltaY * this.mouseSensitivity;
      this.verticalAngle = Math.max(
        -this.maxVerticalAngle,
        Math.min(this.maxVerticalAngle, this.verticalAngle + verticalRotation)
      );

      // Apply rotations
      direction.y = Math.sin(this.verticalAngle);
      direction.normalize();

      // Update camera look-at point
      const lookAtPoint = new THREE.Vector3();
      lookAtPoint.addVectors(this.camera.position, direction);
      this.camera.lookAt(lookAtPoint);

      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
    }
  };

  private handleMouseUp = (event: MouseEvent) => {
    if (event.button === 2) {
      this.isRightMouseDown = false;
    }
  };

  private handleMovement() {
    const moveSpeed = this.moveSpeed;
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    direction.y = 0; // Keep movement horizontal
    direction.normalize();

    const sideDirection = new THREE.Vector3(-direction.z, 0, direction.x);

    let newPosition = this.camera.position.clone();

    if (this.keyStates['w'] || this.keyStates['arrowup']) {
      newPosition.add(direction.multiplyScalar(moveSpeed));
    }
    if (this.keyStates['s'] || this.keyStates['arrowdown']) {
      newPosition.sub(direction.multiplyScalar(moveSpeed));
    }
    if (this.keyStates['a'] || this.keyStates['arrowleft']) {
      newPosition.add(sideDirection.multiplyScalar(moveSpeed));
    }
    if (this.keyStates['d'] || this.keyStates['arrowright']) {
      newPosition.sub(sideDirection.multiplyScalar(moveSpeed));
    }

    // Apply bounds
    newPosition.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, newPosition.x));
    newPosition.z = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, newPosition.z));

    this.camera.position.copy(newPosition);
  }

  private handleCameraRotation() {
    // Horizontal rotation (Q/E keys)
    if (this.keyStates['q'] || this.keyStates['e']) {
      const rotationAngle = (this.keyStates['q'] ? 1 : -1) * this.rotationSpeed;
      
      // Get current camera direction
      const direction = new THREE.Vector3();
      this.camera.getWorldDirection(direction);
      
      // Rotate around Y axis
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationY(rotationAngle);
      direction.applyMatrix4(rotationMatrix);
      
      // Maintain vertical angle
      direction.y = Math.sin(this.verticalAngle);
      direction.normalize();
      
      // Update camera to look at the new point
      const lookAtPoint = new THREE.Vector3();
      lookAtPoint.addVectors(this.camera.position, direction);
      this.camera.lookAt(lookAtPoint);
    }

    // Vertical rotation (R/F keys)
    if (this.keyStates['r'] || this.keyStates['f']) {
      const verticalRotation = (this.keyStates['r'] ? -1 : 1) * this.rotationSpeed;
      this.verticalAngle = Math.max(
        -this.maxVerticalAngle,
        Math.min(this.maxVerticalAngle, this.verticalAngle + verticalRotation)
      );

      // Get current forward direction (excluding vertical component)
      const direction = new THREE.Vector3();
      this.camera.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();

      // Apply vertical rotation
      direction.y = Math.sin(this.verticalAngle);
      direction.normalize();

      // Update camera look-at point
      const lookAtPoint = new THREE.Vector3();
      lookAtPoint.addVectors(this.camera.position, direction);
      this.camera.lookAt(lookAtPoint);
    }
  }

  public update() {
    this.handleMovement();
    this.handleCameraRotation();
  }

  public cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }
}