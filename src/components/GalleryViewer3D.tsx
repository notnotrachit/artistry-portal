import React from 'react';
import { GalleryInstructions } from './gallery/viewer/components/GalleryInstructions';
import { GalleryViewerContainer } from './gallery/viewer/components/GalleryViewerContainer';

interface GalleryViewer3DProps {
  artworks: Array<{
    id: string;
    title: string;
    image_url: string;
    position: { x: number; y: number; z: number } | null;
    rotation?: { x: number; y: number; z: number } | null;
    scale?: { x: number; y: number } | null;
  }>;
  isOwner?: boolean;
}

const GalleryViewer3D = ({ artworks, isOwner = false }: GalleryViewer3DProps) => {
  return (
    <div className="h-full relative">
      {isOwner && (
        <div className="absolute top-16 left-0 w-full">
          <GalleryInstructions />
        </div>
      )}
      <GalleryViewerContainer artworks={artworks} isOwner={isOwner} />
    </div>
  );
};

export default GalleryViewer3D;