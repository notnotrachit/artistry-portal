import * as THREE from 'three';

export class ArtworkInteractionManager {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private selectedArtwork: THREE.Mesh | null = null;
  private isDragging = false;
  private isRotating = false;
  private isZMoving = false;
  private isScaling = false;
  private mouse = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private editMode = false;
  private onUpdateArtwork: (id: string, position: { x: number; y: number; z: number }, rotation: { x: number; y: number; z: number }, scale?: { x: number; y: number }) => void;
  private readonly RAD_TO_DEG = 180 / Math.PI;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    editMode: boolean,
    onUpdateArtwork: (id: string, position: { x: number; y: number; z: number }, rotation: { x: number; y: number; z: number }, scale?: { x: number; y: number }) => void
  ) {
    this.scene = scene;
    this.camera = camera;
    this.editMode = editMode;
    this.onUpdateArtwork = onUpdateArtwork;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  setEditMode(mode: boolean) {
    this.editMode = mode;
    if (!mode && this.selectedArtwork) {
      this.saveArtworkTransform();
      this.selectedArtwork = null;
    }
  }

  private saveArtworkTransform() {
    if (this.selectedArtwork) {
      const position = this.selectedArtwork.position;
      const rotation = this.selectedArtwork.rotation;
      const scale = this.selectedArtwork.scale;
      
      this.onUpdateArtwork(
        this.selectedArtwork.userData.id,
        { 
          x: Number(position.x.toFixed(3)), 
          y: Number(position.y.toFixed(3)), 
          z: Number(position.z.toFixed(3)) 
        },
        { 
          x: Number((rotation.x * this.RAD_TO_DEG).toFixed(3)), 
          y: Number((rotation.y * this.RAD_TO_DEG).toFixed(3)), 
          z: Number((rotation.z * this.RAD_TO_DEG).toFixed(3)) 
        },
        {
          x: Number(scale.x.toFixed(3)),
          y: Number(scale.y.toFixed(3))
        }
      );
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
    this.isScaling = event.key === 's' || event.key === 'S';
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.selectedArtwork) return;

    const movementX = event.movementX * 0.01;
    const movementY = event.movementY * 0.01;

    if (this.isScaling) {
      // Scale mode (S + drag)
      const scaleChange = -movementY; // Invert Y movement for more intuitive scaling
      this.selectedArtwork.scale.x = Math.max(0.1, this.selectedArtwork.scale.x + scaleChange);
      this.selectedArtwork.scale.y = Math.max(0.1, this.selectedArtwork.scale.y + scaleChange);
    } else if (this.isRotating) {
      // Rotation mode (Shift + drag)
      this.selectedArtwork.rotation.y += movementX;
      this.selectedArtwork.rotation.x += movementY;
    } else if (this.isZMoving) {
      // Z-axis movement mode (Alt + drag)
      this.selectedArtwork.position.z -= movementY;
    } else {
      // Regular X-Y movement
      this.selectedArtwork.position.x += movementX;
      this.selectedArtwork.position.y -= movementY;
    }
  }

  handleMouseUp() {
    if (this.isDragging && this.selectedArtwork) {
      this.saveArtworkTransform();
    }
    this.isDragging = false;
    this.isRotating = false;
    this.isZMoving = false;
    this.isScaling = false;
  }

  cleanup() {
    this.selectedArtwork = null;
    this.isDragging = false;
    this.isRotating = false;
    this.isZMoving = false;
    this.isScaling = false;
  }
}