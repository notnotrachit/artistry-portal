import * as THREE from 'three';

export class ResizeHandles {
  private handles: THREE.Mesh[] = [];
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  createHandles(artwork: THREE.Mesh) {
    this.clearHandles();
    
    const handleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const handleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    
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
      this.updateHandlePosition(handle, artwork, pos.x, pos.y);
      this.scene.add(handle);
      this.handles.push(handle);
    });
  }

  updateHandlePosition(handle: THREE.Mesh, artwork: THREE.Mesh, x: number, y: number) {
    const scale = artwork.scale;
    handle.position.set(
      artwork.position.x + x * scale.x,
      artwork.position.y + y * scale.y,
      artwork.position.z
    );
  }

  updateAllHandlePositions(artwork: THREE.Mesh) {
    const positions = [
      { x: -0.5, y: -0.5 },
      { x: 0.5, y: -0.5 },
      { x: -0.5, y: 0.5 },
      { x: 0.5, y: 0.5 }
    ];

    this.handles.forEach((handle, index) => {
      this.updateHandlePosition(handle, artwork, positions[index].x, positions[index].y);
    });
  }

  clearHandles() {
    this.handles.forEach(handle => {
      this.scene.remove(handle);
    });
    this.handles = [];
  }

  getHandles() {
    return this.handles;
  }
}