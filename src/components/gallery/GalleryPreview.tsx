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
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-6">
      {description && (
        <p className="text-zinc-300">{description}</p>
      )}
      
      <div className="aspect-video bg-zinc-800/50 rounded-lg flex items-center justify-center overflow-hidden">
        {previewImageUrl ? (
          <img 
            src={previewImageUrl} 
            alt="Gallery preview" 
            className="rounded-lg object-contain max-h-full hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <p className="text-zinc-500">No artworks in this gallery yet</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          size="lg" 
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          onClick={onEnterGallery}
        >
          Enter Gallery
        </Button>
        {isOwner && (
          <Button 
            size="lg"
            className="border-zinc-700 text-white hover:bg-zinc-800"
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