import * as THREE from 'three';

export class ResizeHandles {
  private handles: THREE.Mesh[] = [];
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  createHandles(artwork: THREE.Mesh) {
    this.clearHandles();
    
    const handleGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15); // Slightly larger handles
    const handleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffff00,
      transparent: true,
      opacity: 0.8 
    });
    
    // Corner positions
    const positions = [
      { x: -1, y: -1 }, // Bottom-left
      { x: 1, y: -1 },  // Bottom-right
      { x: -1, y: 1 },  // Top-left
      { x: 1, y: 1 }    // Top-right
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
    const geometry = artwork.geometry as THREE.PlaneGeometry;
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (!box) return; // Safety check

    // Scale bounding box to artwork scale
    const min = new THREE.Vector3(box.min.x * artwork.scale.x, box.min.y * artwork.scale.y, 0);
    const max = new THREE.Vector3(box.max.x * artwork.scale.x, box.max.y * artwork.scale.y, 0);

    // Pick corners: negative => min, positive => max
    const localPos = new THREE.Vector3(x < 0 ? min.x : max.x, y < 0 ? min.y : max.y, 0);
    localPos.applyMatrix4(artwork.matrixWorld);

    handle.position.copy(localPos);
    handle.position.z += 0.01; // Slight offset so handles remain in front
    handle.rotation.copy(artwork.rotation);
  }

  updateAllHandlePositions(artwork: THREE.Mesh) {
    const positions = [
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: 1, y: 1 }
    ];

    this.handles.forEach((handle, index) => {
      this.updateHandlePosition(handle, artwork, positions[index].x, positions[index].y);
    });
  }

  clearHandles() {
    this.handles.forEach(handle => {
      this.scene.remove(handle);
      handle.geometry.dispose();
      if (handle.material instanceof THREE.Material) {
        handle.material.dispose();
      }
    });
    this.handles = [];
  }

  getHandles() {
    return this.handles;
  }
}