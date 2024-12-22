import * as THREE from 'three';
import { ResizeHandles } from './ResizeHandles';

export class SelectionManager {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private selectedArtwork: THREE.Mesh | null = null;
  private resizeHandles: ResizeHandles;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private tooltipElement: HTMLElement | null = null;
  private selectedObject: THREE.Object3D | null = null;
  private boxHelper: THREE.BoxHelper | null = null;

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.scene = scene;
    this.camera = camera;
    this.resizeHandles = new ResizeHandles(scene);
    this.createTooltip();
  }

  createTooltip() {
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.style.position = 'absolute';
    this.tooltipElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.tooltipElement.style.color = 'white';
    this.tooltipElement.style.padding = '5px';
    this.tooltipElement.style.borderRadius = '5px';
    this.tooltipElement.style.display = 'none';
    document.body.appendChild(this.tooltipElement);
  }

  handleMouseMove(event: MouseEvent, container: HTMLElement) {
    const rect = container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      const object = intersects[0].object as THREE.Mesh;
      if (object.userData.id) {
        const distance = this.camera.position.distanceTo(object.position);
        if (distance < 5) { // Adjust this value based on your scene scale
          this.showTooltip(object.userData.title, object.userData.description, event.clientX, event.clientY);
        }
      }
    } else {
      this.clearTooltip();
    }
  }

  showTooltip(title: string, description: string, x: number, y: number) {
    if (this.tooltipElement) {
      this.tooltipElement.innerHTML = `<strong>${title}</strong><br>${description}`;
      this.tooltipElement.style.left = `${x + 10}px`;
      this.tooltipElement.style.top = `${y + 10}px`;
      this.tooltipElement.style.display = 'block';
    }
  }

  clearTooltip() {
    if (this.tooltipElement) {
      this.tooltipElement.style.display = 'none';
    }
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

        // Show box around selected artwork
        if (this.boxHelper) this.scene.remove(this.boxHelper);
        this.boxHelper = new THREE.BoxHelper(object, 0xffff00);
        this.scene.add(this.boxHelper);
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
    if (this.boxHelper) {
      this.scene.remove(this.boxHelper);
      this.boxHelper = null;
    }
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

  hasSelection(): boolean {
    return this.selectedObject !== null;
  }
}