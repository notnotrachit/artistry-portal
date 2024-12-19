import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { createScene, createWalls } from './gallery/viewer/Scene';
import { GalleryControls } from './gallery/viewer/Controls';
import { ArtworkManager } from './gallery/viewer/ArtworkManager';
import { supabase } from '@/integrations/supabase/client';

interface GalleryViewer3DProps {
  artworks: Array<{
    id: string;
    title: string;
    image_url: string;
    position: { x: number; y: number; z: number } | null;
  }>;
  isOwner?: boolean;
}

const GalleryViewer3D = ({ artworks, isOwner = false }: GalleryViewer3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const controlsRef = useRef<GalleryControls | null>(null);
  const artworkManagerRef = useRef<ArtworkManager | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = createScene();
    createWalls(scene);

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
    controlsRef.current = new GalleryControls(
      camera, 
      containerRef.current,
      editMode,
      async (id, position) => {
        try {
          const { error } = await supabase
            .from('artworks')
            .update({ position })
            .eq('id', id);

          if (error) throw error;
        } catch (error) {
          console.error('Error updating artwork position:', error);
          toast({
            title: "Error",
            description: "Failed to save artwork position",
            variant: "destructive"
          });
        }
      }
    );

    // Artwork manager setup
    artworkManagerRef.current = new ArtworkManager(scene, toast);
    artworks.forEach(artwork => artworkManagerRef.current?.loadArtwork(artwork));

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
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
      controlsRef.current?.cleanup();
      artworkManagerRef.current?.cleanup();
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [artworks, editMode, toast]);

  return (
    <div className="space-y-4">
      {isOwner && (
        <Button 
          onClick={() => setEditMode(!editMode)}
          variant={editMode ? "destructive" : "default"}
        >
          {editMode ? "Exit Edit Mode" : "Edit Artwork Positions"}
        </Button>
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