import * as THREE from 'three';
import { SelectionManager } from './interactions/SelectionManager';
import { TransformManager } from './interactions/TransformManager';

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
    // Save modifications after mouse up to ensure we capture all changes
    this.saveModifiedArtworks();
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

  cleanup() {
    this.selectionManager.cleanup();
    // Ensure we save any pending changes before cleanup
    this.saveModifiedArtworks();
  }
}