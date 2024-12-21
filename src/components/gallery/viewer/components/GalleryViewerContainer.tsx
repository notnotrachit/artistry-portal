import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useToast } from '@/components/ui/use-toast';
import { createScene, createWalls } from '../Scene';
import { CameraControls } from '../CameraControls';
import { ArtworkManager } from '../ArtworkManager';
import { ArtworkInteractionManager } from '../ArtworkInteractionManager';
import { supabase } from '@/integrations/supabase/client';

interface GalleryViewerContainerProps {
  artworks: Array<{
    id: string;
    title: string;
    image_url: string;
    position: { x: number; y: number; z: number } | null;
    rotation?: { x: number; y: number; z: number } | null;
    scale?: { x: number; y: number } | null;
  }>;
  isOwner: boolean;
}

export const GalleryViewerContainer = ({ artworks, isOwner }: GalleryViewerContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const cameraControlsRef = useRef<CameraControls | null>(null);
  const artworkManagerRef = useRef<ArtworkManager | null>(null);
  const artworkInteractionRef = useRef<ArtworkInteractionManager | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = createScene();
    const { bounds } = createWalls(scene);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Controls setup
    cameraControlsRef.current = new CameraControls(camera, bounds);

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

    // Event listeners
    const handleClick = (event: MouseEvent) => {
      artworkInteractionRef.current?.handleClick(event, containerRef.current!);
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    containerRef.current.addEventListener('click', handleClick);
    containerRef.current.addEventListener('mousedown', artworkInteractionRef.current.handleMouseDown);
    window.addEventListener('mousemove', artworkInteractionRef.current.handleMouseMove);
    window.addEventListener('mouseup', artworkInteractionRef.current.handleMouseUp);
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      cameraControlsRef.current?.update();
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Update interaction manager when isOwner changes
    artworkInteractionRef.current.setEditMode(isOwner);

    // Cleanup
    return () => {
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Save any pending changes before cleanup
      if (artworkInteractionRef.current) {
        console.log('Component unmounting, saving final changes...');
        artworkInteractionRef.current.saveModifiedArtworks();
        artworkInteractionRef.current.cleanup();
      }
      
      cameraControlsRef.current?.cleanup();
      artworkManagerRef.current?.cleanup();
      
      containerRef.current?.removeEventListener('click', handleClick);
      containerRef.current?.removeEventListener('mousedown', artworkInteractionRef.current.handleMouseDown);
      window.removeEventListener('mousemove', artworkInteractionRef.current.handleMouseMove);
      window.removeEventListener('mouseup', artworkInteractionRef.current.handleMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [artworks, isOwner, toast]);

  // Update edit mode when isOwner changes
  useEffect(() => {
    if (artworkInteractionRef.current) {
      console.log('Edit mode changed:', isOwner);
      artworkInteractionRef.current.setEditMode(isOwner);
    }
  }, [isOwner]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[inherit] rounded-lg overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  );
};