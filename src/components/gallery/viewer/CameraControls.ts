import * as THREE from 'three';
import { Bounds } from './types/CameraTypes';
import { MovementController } from './controls/MovementController';
import { RotationController } from './controls/RotationController';
import { KeyboardController } from './controllers/KeyboardController';

export class CameraControls {
  private keyboardController: KeyboardController;
  private movementController: MovementController;
  private rotationController: RotationController;
  private verticalAngle = 0;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private interactionCheck: () => boolean;
  private isMouseDown = false;

  constructor(
    private camera: THREE.PerspectiveCamera, 
    bounds: Bounds,
    interactionCheck?: () => boolean
  ) {
    this.keyboardController = new KeyboardController();
    this.movementController = new MovementController(camera, bounds);
    this.rotationController = new RotationController(camera);
    this.interactionCheck = interactionCheck || (() => false);

    this.setupMouseControls();
    this.keyboardController.enable();
    this.initializeCamera();
  }

  private initializeCamera() {
    // Position camera at the start of the room
    this.camera.position.set(0, 0, 28); // Near the back wall
    this.camera.lookAt(0, 0, 0);
  }

  private setupMouseControls() {
    window.addEventListener('mousedown', () => {
      this.isMouseDown = true;
    });
    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
      this.lastMouseX = 0;
      this.lastMouseY = 0;
    });
    window.addEventListener('mousemove', (event) => {
      if (!this.interactionCheck() && this.isMouseDown) {
        if (this.lastMouseX === 0 && this.lastMouseY === 0) {
          this.lastMouseX = event.clientX;
          this.lastMouseY = event.clientY;
        }
        const deltaX = event.clientX - this.lastMouseX;
        const deltaY = event.clientY - this.lastMouseY;
        this.verticalAngle = this.rotationController.handleMouseRotation(
          deltaX,
          deltaY,
          this.verticalAngle
        );
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
      }
    });

    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  update() {
    if (!this.interactionCheck()) {
      this.movementController.handleMovement(this.keyboardController.keyStates);
      this.verticalAngle = this.rotationController.handleKeyboardRotation(
        this.keyboardController.keyStates,
        this.verticalAngle
      );
    }
  }

  cleanup() {
    this.keyboardController.cleanup();
  }
}