import * as THREE from 'three';
import { SelectionManager } from './SelectionManager';

export class TransformManager {
  private selectionManager: SelectionManager;
  private isDragging = false;
  private isRotating = false;
  private isZMoving = false;
  private isResizing = false;
  private activeHandle: THREE.Mesh | null = null;
  private initialAspectRatio = 1;

  constructor(
    private onUpdateArtwork: (
      id: string,
      position: { x: number; y: number; z: number },
      rotation: { x: number; y: number; z: number },
      scale: { x: number; y: number }
    ) => void
  ) {}

  setSelectionManager(selectionManager: SelectionManager) {
    this.selectionManager = selectionManager;
  }

  handleMouseDown(event: MouseEvent, container: HTMLElement) {
    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    const camera = this.selectionManager['camera'];
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(this.selectionManager['scene'].children);
    const selectedArtwork = this.selectionManager.getSelectedArtwork();

    if (intersects.length > 0) {
      const object = intersects[0].object as THREE.Mesh;
      if (object.userData.isHandle && selectedArtwork) {
        this.isResizing = true;
        this.activeHandle = object;
        this.initialAspectRatio = selectedArtwork.scale.x / selectedArtwork.scale.y;
      } else if (selectedArtwork) {
        this.isDragging = true;
        this.isRotating = event.shiftKey;
        this.isZMoving = event.altKey;
      }
    }
  }

  handleMouseMove(event: MouseEvent) {
    const selectedArtwork = this.selectionManager.getSelectedArtwork();
    if (!selectedArtwork) return;

    const movementX = event.movementX * 0.01;
    const movementY = event.movementY * 0.01;

    if (this.isResizing && this.activeHandle) {
      const handleIndex = this.activeHandle.userData.handleIndex;
      const baseScale = Math.max(0.1, selectedArtwork.scale.x + (handleIndex % 2 === 0 ? -movementX : movementX));
      
      // Maintain aspect ratio
      selectedArtwork.scale.x = baseScale;
      selectedArtwork.scale.y = baseScale / this.initialAspectRatio;
      
      this.selectionManager.getResizeHandles().updateAllHandlePositions(selectedArtwork);
      this.notifyUpdate(selectedArtwork);
    } else if (this.isDragging) {
      if (this.isRotating) {
        selectedArtwork.rotation.y += movementX;
        selectedArtwork.rotation.x += movementY;
      } else if (this.isZMoving) {
        selectedArtwork.position.z -= movementY;
      } else {
        selectedArtwork.position.x += movementX;
        selectedArtwork.position.y -= movementY;
      }
      this.selectionManager.getResizeHandles().updateAllHandlePositions(selectedArtwork);
      this.notifyUpdate(selectedArtwork);
    }
  }

  handleMouseUp() {
    this.isDragging = false;
    this.isRotating = false;
    this.isZMoving = false;
    this.isResizing = false;
    this.activeHandle = null;
  }

  private notifyUpdate(mesh: THREE.Mesh) {
    if (mesh.userData.id) {
      this.onUpdateArtwork(
        mesh.userData.id,
        {
          x: Number(mesh.position.x.toFixed(3)),
          y: Number(mesh.position.y.toFixed(3)),
          z: Number(mesh.position.z.toFixed(3))
        },
        {
          x: Number((mesh.rotation.x * 180 / Math.PI).toFixed(3)),
          y: Number((mesh.rotation.y * 180 / Math.PI).toFixed(3)),
          z: Number((mesh.rotation.z * 180 / Math.PI).toFixed(3))
        },
        {
          x: Number(mesh.scale.x.toFixed(3)),
          y: Number(mesh.scale.y.toFixed(3))
        }
      );
    }
  }
}