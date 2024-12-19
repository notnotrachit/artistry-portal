import * as THREE from 'three';
import { useToast } from '@/components/ui/use-toast';

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  position: { x: number; y: number; z: number } | null;
  rotation?: { x: number; y: number; z: number } | null;
}

export class ArtworkManager {
  private scene: THREE.Scene;
  private artworks: Map<string, THREE.Mesh> = new Map();
  private textureLoader: THREE.TextureLoader;
  private toast: ReturnType<typeof useToast>['toast'];
  private gridSize = { x: 2.5, y: 2.5 }; // Space between artworks
  private maxArtworksPerRow = 5;
  private startPosition = { x: -5, y: 2, z: -1.9 };
  private occupiedPositions: Set<string> = new Set();

  constructor(scene: THREE.Scene, toast: ReturnType<typeof useToast>['toast']) {
    this.scene = scene;
    this.textureLoader = new THREE.TextureLoader();
    this.toast = toast;
  }

  private getNextAvailablePosition(): { x: number; y: number; z: number } {
    let row = 0;
    let col = 0;
    let position;

    do {
      position = {
        x: this.startPosition.x + (col * this.gridSize.x),
        y: this.startPosition.y - (row * this.gridSize.y),
        z: this.startPosition.z
      };
      const posKey = `${position.x},${position.y}`;

      if (!this.occupiedPositions.has(posKey)) {
        this.occupiedPositions.add(posKey);
        return position;
      }

      col++;
      if (col >= this.maxArtworksPerRow) {
        col = 0;
        row++;
      }
    } while (true);
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
        
        const position = artwork.position || this.getNextAvailablePosition();
        artworkMesh.position.set(position.x, position.y, position.z);
        
        // Apply rotation if it exists
        if (artwork.rotation) {
          artworkMesh.rotation.set(
            artwork.rotation.x || 0,
            artwork.rotation.y || 0,
            artwork.rotation.z || 0
          );
        }
        
        artworkMesh.castShadow = true;
        artworkMesh.userData.id = artwork.id;
        
        this.scene.add(artworkMesh);
        this.artworks.set(artwork.id, artworkMesh);

        if (artwork.position) {
          const posKey = `${position.x},${position.y}`;
          this.occupiedPositions.add(posKey);
        }
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
      const posKey = `${artwork.position.x},${artwork.position.y}`;
      this.occupiedPositions.delete(posKey);
      this.scene.remove(artwork);
      this.artworks.delete(id);
    }
  }

  public cleanup() {
    this.artworks.forEach((artwork) => {
      this.scene.remove(artwork);
    });
    this.artworks.clear();
    this.occupiedPositions.clear();
  }
}