import * as THREE from 'three';
import { KeyboardController } from './controllers/KeyboardController';
import { TransformController, TransformUpdate } from './controllers/TransformController';

export class ArtworkInteractionManager {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private selectedArtwork: THREE.Mesh | null = null;
  private isDragging = false;
  private isRotating = false;
  private isZMoving = false;
  private mouse = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private editMode = false;
  private keyboardController: KeyboardController;
  private transformController: TransformController;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    editMode: boolean,
    onUpdateArtwork: (id: string, position: { x: number; y: number; z: number }, rotation: { x: number; y: number; z: number }, scale: { x: number; y: number }) => void
  ) {
    this.scene = scene;
    this.camera = camera;
    this.editMode = editMode;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.keyboardController = new KeyboardController();
    this.transformController = new TransformController((id: string, update: TransformUpdate) => {
      onUpdateArtwork(id, update.position, update.rotation, update.scale);
    });

    if (editMode) {
      this.keyboardController.enable();
    }
  }

  setEditMode(mode: boolean) {
    this.editMode = mode;
    if (!mode && this.selectedArtwork) {
      this.selectedArtwork = null;
    }

    if (mode) {
      this.keyboardController.enable();
    } else {
      this.keyboardController.disable();
    }
  }

  handleClick(event: MouseEvent, container: HTMLElement) {
    if (!this.editMode) return;

    const rect = container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      const artwork = intersects[0].object as THREE.Mesh;
      if (artwork.userData.id) {
        this.selectedArtwork = artwork;
      }
    } else {
      this.selectedArtwork = null;
    }
  }

  handleMouseDown(event: MouseEvent) {
    if (!this.editMode || !this.selectedArtwork) return;
    this.isDragging = true;
    this.isRotating = event.shiftKey;
    this.isZMoving = event.altKey;
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.selectedArtwork) return;

    const movementX = event.movementX * 0.01;
    const movementY = event.movementY * 0.01;

    if (this.keyboardController.isKeyPressed('s')) {
      this.transformController.handleScale(this.selectedArtwork, movementY);
    } else if (this.isRotating) {
      this.transformController.handleRotation(this.selectedArtwork, movementX, movementY);
    } else {
      this.transformController.handlePositionChange(
        this.selectedArtwork,
        movementX,
        movementY,
        this.isZMoving
      );
    }
  }

  handleMouseUp() {
    this.isDragging = false;
    this.isRotating = false;
    this.isZMoving = false;
  }

  cleanup() {
    this.keyboardController.cleanup();
    this.selectedArtwork = null;
    this.isDragging = false;
    this.isRotating = false;
    this.isZMoving = false;
  }
}