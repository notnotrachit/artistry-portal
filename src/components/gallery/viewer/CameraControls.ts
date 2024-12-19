import * as THREE from 'three';
import { Bounds, MouseState, CameraState } from './types/CameraTypes';
import { MovementController } from './controls/MovementController';
import { RotationController } from './controls/RotationController';

export class CameraControls {
  private movementController: MovementController;
  private rotationController: RotationController;
  private mouseState: MouseState = {
    isRightMouseDown: false,
    lastMouseX: 0,
    lastMouseY: 0
  };
  private state: CameraState = {
    verticalAngle: 0,
    keyStates: {}
  };

  constructor(private camera: THREE.PerspectiveCamera, bounds: Bounds) {
    this.movementController = new MovementController(camera, bounds);
    this.rotationController = new RotationController(camera);
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
    this.state.keyStates[event.key.toLowerCase()] = true;
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    this.state.keyStates[event.key.toLowerCase()] = false;
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (event.button === 2) { // Right mouse button
      this.mouseState.isRightMouseDown = true;
      this.mouseState.lastMouseX = event.clientX;
      this.mouseState.lastMouseY = event.clientY;
    }
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (this.mouseState.isRightMouseDown) {
      const deltaX = event.clientX - this.mouseState.lastMouseX;
      const deltaY = event.clientY - this.mouseState.lastMouseY;

      this.state.verticalAngle = this.rotationController.handleMouseRotation(
        deltaX,
        deltaY,
        this.state.verticalAngle
      );

      this.mouseState.lastMouseX = event.clientX;
      this.mouseState.lastMouseY = event.clientY;
    }
  };

  private handleMouseUp = (event: MouseEvent) => {
    if (event.button === 2) {
      this.mouseState.isRightMouseDown = false;
    }
  };

  public update() {
    this.movementController.handleMovement(this.state.keyStates);
    this.state.verticalAngle = this.rotationController.handleKeyboardRotation(
      this.state.keyStates,
      this.state.verticalAngle
    );
  }

  public cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }
}