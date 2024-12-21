import * as THREE from 'three';
import { KeyboardController } from './controllers/KeyboardController';
import { TransformController, TransformUpdate } from './controllers/TransformController';

export class ArtworkInteractionManager {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private selectedArtwork: THREE.Mesh | null = null;
  private resizeHandles: THREE.Mesh[] = [];
  private isDragging = false;
  private isRotating = false;
  private isZMoving = false;
  private isResizing = false;
  private activeHandle: THREE.Mesh | null = null;
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

  private createResizeHandles() {
    const handleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const handleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    
    // Clear existing handles
    this.resizeHandles.forEach(handle => {
      this.scene.remove(handle);
    });
    this.resizeHandles = [];

    if (!this.selectedArtwork) return;

    // Create handles at corners
    const positions = [
      { x: -0.5, y: -0.5 },
      { x: 0.5, y: -0.5 },
      { x: -0.5, y: 0.5 },
      { x: 0.5, y: 0.5 }
    ];

    positions.forEach((pos, index) => {
      const handle = new THREE.Mesh(handleGeometry, handleMaterial);
      handle.userData.isHandle = true;
      handle.userData.handleIndex = index;
      this.updateHandlePosition(handle, pos.x, pos.y);
      this.scene.add(handle);
      this.resizeHandles.push(handle);
    });
  }

  private updateHandlePosition(handle: THREE.Mesh, x: number, y: number) {
    if (!this.selectedArtwork) return;
    
    const artwork = this.selectedArtwork;
    const scale = artwork.scale;
    handle.position.set(
      artwork.position.x + x * scale.x,
      artwork.position.y + y * scale.y,
      artwork.position.z
    );
  }

  private updateAllHandlePositions() {
    if (!this.selectedArtwork) return;
    
    const positions = [
      { x: -0.5, y: -0.5 },
      { x: 0.5, y: -0.5 },
      { x: -0.5, y: 0.5 },
      { x: 0.5, y: 0.5 }
    ];

    this.resizeHandles.forEach((handle, index) => {
      this.updateHandlePosition(handle, positions[index].x, positions[index].y);
    });
  }

  setEditMode(mode: boolean) {
    this.editMode = mode;
    if (!mode) {
      this.clearSelection();
    }

    if (mode) {
      this.keyboardController.enable();
    } else {
      this.keyboardController.disable();
    }
  }

  private clearSelection() {
    this.selectedArtwork = null;
    this.resizeHandles.forEach(handle => {
      this.scene.remove(handle);
    });
    this.resizeHandles = [];
  }

  handleClick(event: MouseEvent, container: HTMLElement) {
    if (!this.editMode) return;

    const rect = container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      const object = intersects[0].object as THREE.Mesh;
      if (object.userData.id) {
        this.selectedArtwork = object;
        this.createResizeHandles();
      } else if (object.userData.isHandle) {
        // Keep the current selection if clicking on a handle
        return;
      }
    } else {
      this.clearSelection();
    }
  }

  handleMouseDown(event: MouseEvent) {
    if (!this.editMode) return;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      const object = intersects[0].object as THREE.Mesh;
      if (object.userData.isHandle) {
        this.isResizing = true;
        this.activeHandle = object;
      } else if (this.selectedArtwork) {
        this.isDragging = true;
        this.isRotating = event.shiftKey;
        this.isZMoving = event.altKey;
      }
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.editMode) return;

    const movementX = event.movementX * 0.01;
    const movementY = event.movementY * 0.01;

    if (this.isResizing && this.selectedArtwork && this.activeHandle) {
      const handleIndex = this.activeHandle.userData.handleIndex;
      const scaleX = this.selectedArtwork.scale.x + (handleIndex % 2 === 0 ? -movementX : movementX);
      const scaleY = this.selectedArtwork.scale.y + (handleIndex < 2 ? -movementY : movementY);
      
      this.transformController.handleScale(this.selectedArtwork, scaleX, scaleY);
      this.updateAllHandlePositions();
    } else if (this.isDragging && this.selectedArtwork) {
      if (this.isRotating) {
        this.transformController.handleRotation(this.selectedArtwork, movementX, movementY);
      } else {
        this.transformController.handlePositionChange(
          this.selectedArtwork,
          movementX,
          movementY,
          this.isZMoving
        );
      }
      this.updateAllHandlePositions();
    }
  }

  handleMouseUp() {
    this.isDragging = false;
    this.isRotating = false;
    this.isZMoving = false;
    this.isResizing = false;
    this.activeHandle = null;
  }

  cleanup() {
    this.keyboardController.cleanup();
    this.clearSelection();
  }
}
