import * as THREE from 'three';
import { useToast } from '@/components/ui/use-toast';

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  position: { x: number; y: number; z: number } | null;
}

export class ArtworkManager {
  private scene: THREE.Scene;
  private artworks: Map<string, THREE.Mesh> = new Map();
  private textureLoader: THREE.TextureLoader;
  private toast: ReturnType<typeof useToast>['toast'];

  constructor(scene: THREE.Scene, toast: ReturnType<typeof useToast>['toast']) {
    this.scene = scene;
    this.textureLoader = new THREE.TextureLoader();
    this.toast = toast;
  }

  public loadArtwork(artwork: Artwork) {
    this.textureLoader.load(
      artwork.image_url,
      (texture) => {
        const aspectRatio = texture.image.width / texture.image.height;
        const width = 2;
        const height = width / aspectRatio;

        const material = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide
        });

        const artworkMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(width, height),
          material
        );
        
        // Set position
        const position = artwork.position || {
          x: 0,
          y: 0,
          z: -3.9
        };
        
        artworkMesh.position.set(position.x, position.y, position.z);
        artworkMesh.castShadow = true;
        artworkMesh.userData.id = artwork.id;
        
        this.scene.add(artworkMesh);
        this.artworks.set(artwork.id, artworkMesh);
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
        this.toast({
          title: "Error",
          description: `Failed to load artwork: ${artwork.title}`,
          variant: "destructive"
        });
      }
    );
  }

  public getArtwork(id: string): THREE.Mesh | undefined {
    return this.artworks.get(id);
  }

  public removeArtwork(id: string) {
    const artwork = this.artworks.get(id);
    if (artwork) {
      this.scene.remove(artwork);
      this.artworks.delete(id);
    }
  }

  public cleanup() {
    this.artworks.forEach((artwork) => {
      this.scene.remove(artwork);
    });
    this.artworks.clear();
  }
}