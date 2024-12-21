import * as THREE from 'three';
import { SelectionManager } from './interactions/SelectionManager';
import { TransformManager } from './interactions/TransformManager';
import { supabase } from '@/integrations/supabase/client';

export class ArtworkInteractionManager {
  private selectionManager: SelectionManager;
  private transformManager: TransformManager;
  private editMode: boolean;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    editMode: boolean,
    onUpdateArtwork: (
      id: string,
      position: { x: number; y: number; z: number },
      rotation: { x: number; y: number; z: number },
      scale: { x: number; y: number }
    ) => void
  ) {
    this.editMode = editMode;
    this.selectionManager = new SelectionManager(scene, camera);
    this.transformManager = new TransformManager(onUpdateArtwork);
    this.transformManager.setSelectionManager(this.selectionManager);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleClick(event: MouseEvent, container: HTMLElement) {
    if (!this.editMode) return;
    this.selectionManager.handleClick(event, container);
  }

  handleMouseDown(event: MouseEvent) {
    if (!this.editMode) return;
    const container = event.target as HTMLElement;
    this.transformManager.handleMouseDown(event, container);
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.editMode) return;
    this.transformManager.handleMouseMove(event);
  }

  handleMouseUp() {
    if (!this.editMode) return;
    this.transformManager.handleMouseUp();
  }

  setEditMode(mode: boolean) {
    this.editMode = mode;
    if (!mode) {
      console.log('Exiting edit mode, saving all modifications...');
      this.selectionManager.clearSelection();
      this.saveModifiedArtworks();
    }
  }

  saveModifiedArtworks() {
    console.log('Saving modified artworks...');
    this.transformManager.saveModifiedArtworks();
  }

  async deleteSelectedArtwork(artworkManager: any) {
    const selectedArtwork = this.selectionManager.getSelectedArtwork();
    if (!selectedArtwork) return;
    const id = selectedArtwork.userData.id;
    try {
      const { error } = await supabase.from('artworks').delete().eq('id', id);
      if (!error) {
        artworkManager.removeArtwork(id);
        this.selectionManager.clearSelection();
        console.log('Deleted artwork:', id);
      }
    } catch (err) {
      console.error('Error deleting artwork:', err);
    }
  }

  cleanup() {
    this.selectionManager.cleanup();
  }

  isInteracting(): boolean {
    return this.transformManager.isTransforming() || 
           (this.editMode && this.selectionManager.hasSelection());
  }
}