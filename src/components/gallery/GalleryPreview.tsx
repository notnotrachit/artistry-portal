import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface GalleryPreviewProps {
  description?: string;
  previewImageUrl?: string;
  onEnterGallery: () => void;
  onEditGallery: () => void;
  isOwner: boolean;
}

export const GalleryPreview = ({
  description,
  previewImageUrl,
  onEnterGallery,
  onEditGallery,
  isOwner
}: GalleryPreviewProps) => {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      {description && (
        <p className="text-gallery-600">{description}</p>
      )}
      
      <div className="aspect-video bg-gallery-100 rounded-lg flex items-center justify-center">
        {previewImageUrl ? (
          <img 
            src={previewImageUrl} 
            alt="Gallery preview" 
            className="rounded-lg object-contain max-h-full"
          />
        ) : (
          <p className="text-gallery-400">No artworks in this gallery yet</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          size="lg" 
          className="flex-1"
          onClick={onEnterGallery}
        >
          Enter Gallery
        </Button>
        {isOwner && (
          <Button 
            size="lg"
            variant="outline"
            onClick={onEditGallery}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Gallery
          </Button>
        )}
      </div>
    </div>
  );
};