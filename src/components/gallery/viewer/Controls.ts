import * as THREE from 'three';

export class GalleryControls {
  private camera: THREE.PerspectiveCamera;
  private element: HTMLElement;
  private editMode: boolean;
  private selectedArtwork: THREE.Mesh | null = null;
  private onArtworkMove?: (id: string, position: { x: number; y: number; z: number }) => void;
  private keyStates: { [key: string]: boolean } = {};
  private rotationSpeed = 0.02;
  private moveSpeed = 0.1;
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };

  constructor(
    camera: THREE.PerspectiveCamera, 
    element: HTMLElement,
    editMode: boolean = false,
    onArtworkMove?: (id: string, position: { x: number; y: number; z: number }) => void
  ) {
    this.camera = camera;
    this.element = element;
    this.editMode = editMode;
    this.onArtworkMove = onArtworkMove;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.element.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    this.element.addEventListener('wheel', this.handleWheel);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.keyStates[event.key] = true;
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    this.keyStates[event.key] = false;
  };

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

  public update() {
    this.handleCameraMovement();
    this.handleCameraRotation();
  }

  private handleMouseDown = (event: MouseEvent) => {
    if (!this.editMode || !this.selectedArtwork) return;
    this.isDragging = true;
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (!this.isDragging || !this.editMode || !this.selectedArtwork) return;

    const deltaMove = {
      x: event.clientX - this.previousMousePosition.x,
      y: event.clientY - this.previousMousePosition.y
    };

    // Move artwork when in edit mode
    const movementSpeed = 0.01;
    this.selectedArtwork.position.x += deltaMove.x * movementSpeed;
    this.selectedArtwork.position.y -= deltaMove.y * movementSpeed;
    
    if (this.onArtworkMove) {
      const artworkId = this.selectedArtwork.userData.id;
      this.onArtworkMove(artworkId, {
        x: this.selectedArtwork.position.x,
        y: this.selectedArtwork.position.y,
        z: this.selectedArtwork.position.z
      });
    }

    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  };

  private handleMouseUp = () => {
    this.isDragging = false;
  };

  private handleWheel = (event: WheelEvent) => {
    this.camera.position.z += event.deltaY * 0.01;
    this.camera.position.z = Math.max(2, Math.min(10, this.camera.position.z));
  };

  public setSelectedArtwork(artwork: THREE.Mesh | null) {
    this.selectedArtwork = artwork;
  }

  public setEditMode(mode: boolean) {
    this.editMode = mode;
  }

  public cleanup() {
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.element.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}