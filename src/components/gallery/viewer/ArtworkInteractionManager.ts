import * as THREE from 'three';

export class ArtworkInteractionManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private selectedArtwork: THREE.Mesh | null = null;
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private editMode: boolean;
  private onArtworkMove?: (id: string, position: { x: number; y: number; z: number }) => void;

  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    editMode: boolean = false,
    onArtworkMove?: (id: string, position: { x: number; y: number; z: number }) => void
  ) {
    this.scene = scene;
    this.camera = camera;
    this.editMode = editMode;
    this.onArtworkMove = onArtworkMove;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  public handleClick(event: MouseEvent, element: HTMLElement) {
    if (!this.editMode) return;

    const rect = element.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    const hitArtwork = intersects.find(intersect => 
      intersect.object instanceof THREE.Mesh && 
      intersect.object.userData.id
    );

    this.selectedArtwork = hitArtwork ? (hitArtwork.object as THREE.Mesh) : null;
  }

  public handleMouseDown = (event: MouseEvent) => {
    if (!this.editMode || !this.selectedArtwork) return;
    this.isDragging = true;
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  };

  public handleMouseMove = (event: MouseEvent) => {
    if (!this.isDragging || !this.editMode || !this.selectedArtwork) return;

    const deltaMove = {
      x: event.clientX - this.previousMousePosition.x,
      y: event.clientY - this.previousMousePosition.y
    };

    const movementSpeed = 0.01;
    this.selectedArtwork.position.x += deltaMove.x * movementSpeed;
    this.selectedArtwork.position.y -= deltaMove.y * movementSpeed;
    
    if (this.onArtworkMove && this.selectedArtwork.userData.id) {
      this.onArtworkMove(this.selectedArtwork.userData.id, {
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

  public handleMouseUp = () => {
    this.isDragging = false;
  };

  public setEditMode(mode: boolean) {
    this.editMode = mode;
  }

  public cleanup() {
    this.selectedArtwork = null;
  }
}