import * as THREE from 'three';
import { type ToastProps } from '@/components/ui/toast';

export class ArtworkManager {
  private artworks: Map<string, THREE.Mesh> = new Map();
  private textureLoader: THREE.TextureLoader;

  constructor(private scene: THREE.Scene, private toast: (props: ToastProps) => void) {
    this.textureLoader = new THREE.TextureLoader();
  }

  loadArtwork(artwork: {
    id: string;
    title: string;
    image_url: string;
    position: { x: number; y: number; z: number } | null;
    rotation?: { x: number; y: number; z: number } | null;
  }) {
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

        // Set rotation if available
        if (artwork.rotation) {
          mesh.rotation.set(
            artwork.rotation.x,
            artwork.rotation.y,
            artwork.rotation.z
          );
        }

        mesh.userData.id = artwork.id;
        mesh.userData.title = artwork.title;

        this.scene.add(mesh);
        this.artworks.set(artwork.id, mesh);
      },
      undefined,
      (error) => {
        console.error('Error loading artwork texture:', error);
        this.toast({
          title: "Error",
          description: "Failed to load artwork image",
          variant: "destructive"
        });
      }
    );
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