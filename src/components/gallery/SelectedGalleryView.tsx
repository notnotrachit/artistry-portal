import { Button } from "@/components/ui/button";
import GalleryViewer3D from "@/components/GalleryViewer3D";

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  position: Position | null;
}

interface SelectedGalleryViewProps {
  galleryTitle: string;
  artworks: Artwork[];
  onBack: () => void;
}

export const SelectedGalleryView = ({ galleryTitle, artworks, onBack }: SelectedGalleryViewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium text-gallery-900">{galleryTitle}</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Galleries
        </Button>
      </div>
      <GalleryViewer3D artworks={artworks} />
    </div>
  );
};