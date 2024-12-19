import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { createScene, createWalls } from './gallery/viewer/Scene';
import { CameraControls } from './gallery/viewer/CameraControls';
import { ArtworkManager } from './gallery/viewer/ArtworkManager';
import { ArtworkInteractionManager } from './gallery/viewer/ArtworkInteractionManager';
import { supabase } from '@/integrations/supabase/client';

interface GalleryViewer3DProps {
  artworks: Array<{
    id: string;
    title: string;
    image_url: string;
    position: { x: number; y: number; z: number } | null;
    rotation?: { x: number; y: number; z: number } | null;
  }>;
  isOwner?: boolean;
}

const GalleryViewer3D = ({ artworks, isOwner = false }: GalleryViewer3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
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
    artworkManagerRef.current = new ArtworkManager(scene, toast);
    artworks.forEach(artwork => artworkManagerRef.current?.loadArtwork(artwork));

    // Artwork interaction setup
    artworkInteractionRef.current = new ArtworkInteractionManager(
      scene,
      camera,
      editMode,
      async (id, position, rotation) => {
        try {
          const { error } = await supabase
            .from('artworks')
            .update({ 
              position,
              rotation
            })
            .eq('id', id);

          if (error) throw error;
          
          toast({
            title: "Success",
            description: "Artwork position and rotation saved",
          });
        } catch (error) {
          console.error('Error updating artwork:', error);
          toast({
            title: "Error",
            description: "Failed to save artwork position and rotation",
            variant: "destructive"
          });
        }
      }
    );

    // Event listeners
    const handleClick = (event: MouseEvent) => {
      artworkInteractionRef.current?.handleClick(event, containerRef.current!);
    };

    containerRef.current.addEventListener('click', handleClick);
    containerRef.current.addEventListener('mousedown', artworkInteractionRef.current.handleMouseDown);
    window.addEventListener('mousemove', artworkInteractionRef.current.handleMouseMove);
    window.addEventListener('mouseup', artworkInteractionRef.current.handleMouseUp);

    // Animation loop
    const animate = () => {
      cameraControlsRef.current?.update();
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Window resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      cameraControlsRef.current?.cleanup();
      artworkManagerRef.current?.cleanup();
      artworkInteractionRef.current?.cleanup();
      containerRef.current?.removeEventListener('click', handleClick);
      containerRef.current?.removeEventListener('mousedown', artworkInteractionRef.current.handleMouseDown);
      window.removeEventListener('mousemove', artworkInteractionRef.current.handleMouseMove);
      window.removeEventListener('mouseup', artworkInteractionRef.current.handleMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [artworks, editMode, toast]);

  // Update interaction manager edit mode when it changes
  useEffect(() => {
    artworkInteractionRef.current?.setEditMode(editMode);
  }, [editMode]);

  return (
    <div className="space-y-4">
      {isOwner && (
        <div className="space-y-2">
          <Button 
            onClick={() => setEditMode(!editMode)}
            variant={editMode ? "destructive" : "default"}
          >
            {editMode ? "Exit Edit Mode" : "Edit Artwork Positions"}
          </Button>
          {editMode && (
            <p className="text-sm text-muted-foreground">
              Click to select an artwork. Drag to move, hold Shift + drag to rotate.
              Use WASD or arrow keys to move, Q/E to rotate the camera.
            </p>
          )}
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full h-[600px] rounded-lg overflow-hidden"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};

export default GalleryViewer3D;
