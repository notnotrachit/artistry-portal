import { useEffect, useRef } from 'react';
import { ArtworkManager } from '../components/gallery/viewer/ArtworkManager';
import { ArtworkInteractionManager } from '../components/gallery/viewer/ArtworkInteractionManager';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as THREE from 'three';

export const useArtworkTransforms = (
  scene: THREE.Scene | undefined,
  camera: THREE.Camera | undefined,
  artworks: Array<{
    id: string;
    title: string;
    image_url: string;
    position: { x: number; y: number; z: number } | null;
    rotation?: { x: number; y: number; z: number } | null;
    scale?: { x: number; y: number } | null;
  }>,
  isOwner: boolean
) => {
  const { toast } = useToast();
  const artworkManagerRef = useRef<ArtworkManager | null>(null);
  const artworkInteractionRef = useRef<ArtworkInteractionManager | null>(null);

  useEffect(() => {
    if (!scene || !camera) return;

    // Artwork manager setup
    artworkManagerRef.current = new ArtworkManager(scene);
    artworks.forEach(artwork => artworkManagerRef.current?.loadArtwork(artwork));

    // Artwork interaction setup
    artworkInteractionRef.current = new ArtworkInteractionManager(
      scene,
      camera,
      isOwner,
      async (id, position, rotation, scale) => {
        try {
          console.log('Updating artwork:', { id, position, rotation, scale });
          const { error } = await supabase
            .from('artworks')
            .update({ 
              position,
              rotation,
              scale
            })
            .eq('id', id);

          if (error) throw error;
          
          toast({
            title: "Success",
            description: "Artwork transformations saved",
          });
        } catch (error) {
          console.error('Error updating artwork:', error);
          toast({
            title: "Error",
            description: "Failed to save artwork transformations",
            variant: "destructive"
          });
        }
      }
    );

    return () => {
      artworkManagerRef.current?.cleanup();
      if (artworkInteractionRef.current) {
        console.log('Component unmounting, saving final changes...');
        artworkInteractionRef.current.saveModifiedArtworks();
        artworkInteractionRef.current.cleanup();
      }
    };
  }, [scene, camera, artworks, isOwner, toast]);

  useEffect(() => {
    if (artworkInteractionRef.current) {
      console.log('Edit mode changed:', isOwner);
      artworkInteractionRef.current.setEditMode(isOwner);
    }
  }, [isOwner]);

  return {
    artworkManager: artworkManagerRef.current,
    artworkInteraction: artworkInteractionRef.current
  };
};