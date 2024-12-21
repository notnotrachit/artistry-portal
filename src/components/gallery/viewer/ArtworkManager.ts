import * as THREE from 'three';
import { type ToastActionElement } from '@/components/ui/toast';
import { toast } from '@/hooks/use-toast';

export class ArtworkManager {
  private artworks: Map<string, THREE.Mesh> = new Map();
  private textureLoader: THREE.TextureLoader;
  private readonly DEG_TO_RAD = Math.PI / 180;

  constructor(private scene: THREE.Scene) {
    this.textureLoader = new THREE.TextureLoader();
  }

  loadArtwork(
    artwork: {
      id: string;
      title: string;
      image_url: string;
      position: { x: number; y: number; z: number } | null;
      rotation?: { x: number; y: number; z: number } | null;
      scale?: { x: number; y: number } | null;
    },
    onLoaded?: () => void
  ) {
    this.textureLoader.load(
      artwork.image_url,
      (texture) => {
        const aspectRatio = texture.image.width / texture.image.height;
        const width = 2;
        const height = width / aspectRatio;

        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);

        // Set position if available
        if (artwork.position) {
          mesh.position.set(
            artwork.position.x,
            artwork.position.y,
            artwork.position.z
          );
        }

        // Set rotation if available, converting from degrees to radians
        if (artwork.rotation && typeof artwork.rotation === 'object') {
          const rotX = artwork.rotation.x !== null && artwork.rotation.x !== undefined ? Number(artwork.rotation.x) * this.DEG_TO_RAD : 0;
          const rotY = artwork.rotation.y !== null && artwork.rotation.y !== undefined ? Number(artwork.rotation.y) * this.DEG_TO_RAD : 0;
          const rotZ = artwork.rotation.z !== null && artwork.rotation.z !== undefined ? Number(artwork.rotation.z) * this.DEG_TO_RAD : 0;
          mesh.rotation.set(rotX, rotY, rotZ);
        }

        // Set scale if available
        if (artwork.scale && typeof artwork.scale === 'object') {
          const scaleX = artwork.scale.x !== null && artwork.scale.x !== undefined ? Number(artwork.scale.x) : 1;
          const scaleY = artwork.scale.y !== null && artwork.scale.y !== undefined ? Number(artwork.scale.y) : 1;
          mesh.scale.set(scaleX, scaleY, 1);
        }

        mesh.userData.id = artwork.id;
        mesh.userData.title = artwork.title;
        mesh.userData.rotation = artwork.rotation;
        mesh.userData.scale = artwork.scale;

        this.scene.add(mesh);
        this.artworks.set(artwork.id, mesh);
        if (onLoaded) onLoaded(); // Notify container that this artwork has finished loading
      },
      undefined,
      (error) => {
        console.error('Error loading artwork texture:', error);
        toast({
          variant: "destructive",
          title: "Error loading artwork",
          description: "Failed to load artwork image"
        });
        // Still notify so container won't hang indefinitely
        if (onLoaded) onLoaded();
      }
    );
  }

  removeArtwork(artworkId: string) {
    const mesh = this.artworks.get(artworkId);
    if (!mesh) return;
    this.scene.remove(mesh);
    mesh.geometry.dispose();
    if (mesh.material instanceof THREE.Material) {
      mesh.material.dispose();
    } else if (Array.isArray(mesh.material)) {
      mesh.material.forEach((m) => m.dispose());
    }
    this.artworks.delete(artworkId);
  }

  cleanup() {
    this.artworks.forEach((mesh) => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      if (mesh.material instanceof THREE.Material) {
        mesh.material.dispose();
      } else if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => material.dispose());
      }
    });
    this.artworks.clear();
  }
}