import * as THREE from 'three';

export class GalleryControls {
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private camera: THREE.PerspectiveCamera;
  private element: HTMLElement;
  private editMode: boolean;
  private selectedArtwork: THREE.Mesh | null = null;
  private onArtworkMove?: (id: string, position: { x: number; y: number; z: number }) => void;
  private keyStates: { [key: string]: boolean } = {};
  private moveSpeed = 0.1;

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

  public update() {
    if (this.keyStates['ArrowUp']) {
      this.camera.position.z -= this.moveSpeed;
    }
    if (this.keyStates['ArrowDown']) {
      this.camera.position.z += this.moveSpeed;
    }
    if (this.keyStates['ArrowLeft']) {
      this.camera.position.x -= this.moveSpeed;
    }
    if (this.keyStates['ArrowRight']) {
      this.camera.position.x += this.moveSpeed;
    }
  }

  private handleMouseDown = (event: MouseEvent) => {
    this.isDragging = true;
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (!this.isDragging) return;

    const deltaMove = {
      x: event.clientX - this.previousMousePosition.x,
      y: event.clientY - this.previousMousePosition.y
    };

    if (this.selectedArtwork && this.editMode) {
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
    } else {
      // Regular camera movement
      this.camera.position.x -= deltaMove.x * 0.01;
      this.camera.position.y += deltaMove.y * 0.01;
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

  public cleanup() {
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.element.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}