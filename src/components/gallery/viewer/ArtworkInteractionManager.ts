import * as THREE from 'three';

export class ArtworkInteractionManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private selectedArtwork: THREE.Mesh | null = null;
  private isDragging = false;
  private isRotating = false;
  private previousMousePosition = { x: 0, y: 0 };
  private editMode: boolean;
  private onArtworkUpdate?: (id: string, position: { x: number; y: number; z: number }, rotation: { x: number; y: number; z: number }) => void;

  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    editMode: boolean = false,
    onArtworkUpdate?: (id: string, position: { x: number; y: number; z: number }, rotation: { x: number; y: number; z: number }) => void
  ) {
    this.scene = scene;
    this.camera = camera;
    this.editMode = editMode;
    this.onArtworkUpdate = onArtworkUpdate;
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
    
    if (event.shiftKey) {
      this.isRotating = true;
    } else {
      this.isDragging = true;
    }
    
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  };

  public handleMouseMove = (event: MouseEvent) => {
    if (!this.editMode || !this.selectedArtwork) return;

    const deltaMove = {
      x: event.clientX - this.previousMousePosition.x,
      y: event.clientY - this.previousMousePosition.y
    };

    if (this.isDragging) {
      const movementSpeed = 0.01;
      this.selectedArtwork.position.x += deltaMove.x * movementSpeed;
      this.selectedArtwork.position.y -= deltaMove.y * movementSpeed;
      
      this.updateArtwork();
    } else if (this.isRotating) {
      const rotationSpeed = 0.01;
      this.selectedArtwork.rotation.y += deltaMove.x * rotationSpeed;
      this.selectedArtwork.rotation.x += deltaMove.y * rotationSpeed;
      
      this.updateArtwork();
    }

    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  };

  private updateArtwork() {
    if (this.selectedArtwork && this.onArtworkUpdate) {
      this.onArtworkUpdate(
        this.selectedArtwork.userData.id,
        {
          x: this.selectedArtwork.position.x,
          y: this.selectedArtwork.position.y,
          z: this.selectedArtwork.position.z
        },
        {
          x: this.selectedArtwork.rotation.x,
          y: this.selectedArtwork.rotation.y,
          z: this.selectedArtwork.rotation.z
        }
      );
    }
  }

  public handleMouseUp = () => {
    if (this.selectedArtwork) {
      this.updateArtwork(); // Save final position/rotation
    }
    this.isDragging = false;
    this.isRotating = false;
  };

  public setEditMode(mode: boolean) {
    this.editMode = mode;
    if (!mode) {
      // Save final position when exiting edit mode
      if (this.selectedArtwork) {
        this.updateArtwork();
      }
      this.selectedArtwork = null;
    }
  }

  public cleanup() {
    this.selectedArtwork = null;
  }
}