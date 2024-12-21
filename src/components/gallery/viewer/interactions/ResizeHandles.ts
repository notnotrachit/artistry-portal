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
    // Get artwork dimensions
    const geometry = artwork.geometry as THREE.PlaneGeometry;
    const width = (geometry.parameters.width * artwork.scale.x) / 2;
    const height = (geometry.parameters.height * artwork.scale.y) / 2;

    // Calculate handle position in artwork's local space
    const localX = x * width;
    const localY = y * height;

    // Convert to world space
    const worldPos = new THREE.Vector3(localX, localY, 0);
    worldPos.applyMatrix4(artwork.matrixWorld);

    handle.position.copy(worldPos);
    
    // Apply artwork's rotation to handle
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