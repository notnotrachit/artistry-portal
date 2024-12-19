import * as THREE from 'three';

export class ArtworkInteractionManager {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private selectedArtwork: THREE.Mesh | null = null;
  private isDragging = false;
  private isRotating = false;
  private mouse = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private editMode = false;
  private onUpdateArtwork: (id: string, position: { x: number; y: number; z: number }, rotation: { x: number; y: number; z: number }) => void;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    editMode: boolean,
    onUpdateArtwork: (id: string, position: { x: number; y: number; z: number }, rotation: { x: number; y: number; z: number }) => void
  ) {
    this.scene = scene;
    this.camera = camera;
    this.editMode = editMode;
    this.onUpdateArtwork = onUpdateArtwork;

    // Bind methods to maintain correct 'this' context
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  setEditMode(mode: boolean) {
    this.editMode = mode;
    if (!mode && this.selectedArtwork) {
      // Save position and rotation when exiting edit mode
      this.saveArtworkTransform();
      this.selectedArtwork = null;
    }
  }

  private saveArtworkTransform() {
    if (this.selectedArtwork) {
      const position = this.selectedArtwork.position;
      const rotation = this.selectedArtwork.rotation;
      this.onUpdateArtwork(
        this.selectedArtwork.userData.id,
        { x: position.x, y: position.y, z: position.z },
        { x: rotation.x, y: rotation.y, z: rotation.z }
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
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.selectedArtwork) return;

    const movementX = event.movementX * 0.01;
    const movementY = event.movementY * 0.01;

    if (this.isRotating) {
      // Rotate artwork when holding shift
      this.selectedArtwork.rotation.y += movementX;
      this.selectedArtwork.rotation.x += movementY;
    } else {
      // Move artwork
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
  }

  cleanup() {
    this.selectedArtwork = null;
    this.isDragging = false;
    this.isRotating = false;
  }
}