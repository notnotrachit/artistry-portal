import React, { useRef, useEffect } from 'react';
import { CameraControls } from '../CameraControls';
import { useThreeJsScene } from '@/hooks/useThreeJsScene';
import { useArtworkTransforms } from '@/hooks/useArtworkTransforms';

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
  const cameraControlsRef = useRef<CameraControls | null>(null);
  const animationFrameRef = useRef<number>();

  // Initialize Three.js scene
  const { scene, camera, renderer, bounds } = useThreeJsScene(containerRef);

  // Initialize artwork transformations with all required arguments
  const { artworkInteraction } = useArtworkTransforms(scene, camera, artworks, isOwner);

  useEffect(() => {
    if (!scene || !camera || !renderer || !bounds) return;

    // Controls setup with proper bounds
    cameraControlsRef.current = new CameraControls(camera, bounds);

    // Event listeners
    const handleClick = (event: MouseEvent) => {
      artworkInteraction?.handleClick(event, containerRef.current!);
    };

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    containerRef.current?.addEventListener('click', handleClick);
    containerRef.current?.addEventListener('mousedown', artworkInteraction?.handleMouseDown);
    window.addEventListener('mousemove', artworkInteraction?.handleMouseMove);
    window.addEventListener('mouseup', artworkInteraction?.handleMouseUp);
    window.addEventListener('resize', handleResize);

    // Initial resize
    handleResize();

    // Animation loop
    const animate = () => {
      if (cameraControlsRef.current) {
        cameraControlsRef.current.update();
      }
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      cameraControlsRef.current?.cleanup();
      
      containerRef.current?.removeEventListener('click', handleClick);
      containerRef.current?.removeEventListener('mousedown', artworkInteraction?.handleMouseDown);
      window.removeEventListener('mousemove', artworkInteraction?.handleMouseMove);
      window.removeEventListener('mouseup', artworkInteraction?.handleMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [scene, camera, renderer, bounds, artworkInteraction]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[inherit] rounded-lg overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  );
};