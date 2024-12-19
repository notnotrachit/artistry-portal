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
  private nextPosition = { x: 0, y: 0, z: -1.9 };
  private spacing = 2.5; // Space between artworks

  constructor(scene: THREE.Scene, toast: ReturnType<typeof useToast>['toast']) {
    this.scene = scene;
    this.textureLoader = new THREE.TextureLoader();
    this.toast = toast;
  }

  private calculateNextPosition() {
    // Move to the right for next artwork
    this.nextPosition.x += this.spacing;
    
    // If we've reached the edge of the wall, move to next row
    if (Math.abs(this.nextPosition.x) > 6) {
      this.nextPosition.x = 0;
      this.nextPosition.y -= this.spacing;
    }
    
    return { ...this.nextPosition };
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
        
        // Set position - use saved position or calculate next available spot
        const position = artwork.position || this.calculateNextPosition();
        
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