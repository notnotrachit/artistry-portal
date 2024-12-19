import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import GalleryViewer3D from "@/components/GalleryViewer3D";
import { AddArtworkDialog } from "./AddArtworkDialog";
import { useState } from "react";
import { useAuth } from "@supabase/auth-helpers-react";

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
  galleryId: string;
  galleryTitle: string;
  galleryOwnerId: string;
  artworks: Artwork[];
  onBack: () => void;
}

export const SelectedGalleryView = ({ 
  galleryId,
  galleryTitle,
  galleryOwnerId,
  artworks, 
  onBack 
}: SelectedGalleryViewProps) => {
  const [isAddArtworkOpen, setIsAddArtworkOpen] = useState(false);
  const user = useAuth();
  const isOwner = user?.id === galleryOwnerId;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium text-gallery-900">{galleryTitle}</h2>
        <div className="flex gap-2">
          {isOwner && (
            <Dialog open={isAddArtworkOpen} onOpenChange={setIsAddArtworkOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gallery-900 text-white hover:bg-gallery-800">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Artwork
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Artwork</DialogTitle>
                </DialogHeader>
                <AddArtworkDialog 
                  galleryId={galleryId} 
                  onClose={() => setIsAddArtworkOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          )}
          <Button variant="outline" onClick={onBack}>
            Back to Galleries
          </Button>
        </div>
      </div>
      <GalleryViewer3D artworks={artworks} isOwner={isOwner} />
    </div>
  );
};