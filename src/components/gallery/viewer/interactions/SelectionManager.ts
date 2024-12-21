import * as THREE from 'three';
import { ResizeHandles } from './ResizeHandles';

export class SelectionManager {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private selectedArtwork: THREE.Mesh | null = null;
  private resizeHandles: ResizeHandles;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.scene = scene;
    this.camera = camera;
    this.resizeHandles = new ResizeHandles(scene);
  }

  handleClick(event: MouseEvent, container: HTMLElement) {
    const rect = container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      const object = intersects[0].object as THREE.Mesh;
      if (object.userData.id) {
        this.selectedArtwork = object;
        this.resizeHandles.createHandles(object);
      } else if (!object.userData.isHandle) {
        this.clearSelection();
      }
    } else {
      this.clearSelection();
    }
  }

  clearSelection() {
    this.selectedArtwork = null;
    this.resizeHandles.clearHandles();
  }

  getSelectedArtwork() {
    return this.selectedArtwork;
  }

  getResizeHandles() {
    return this.resizeHandles;
  }

  cleanup() {
    this.clearSelection();
  }
}