import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";
import { CreateGalleryDialog } from "@/components/gallery/CreateGalleryDialog";
import { GalleryList } from "@/components/gallery/GalleryList";
import { SelectedGalleryView } from "@/components/gallery/SelectedGalleryView";

interface Position {
  x: number;
  y: number;
  z: number;
}

const Index = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: galleries, isLoading: galleriesLoading } = useQuery({
    queryKey: ["galleries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("galleries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: artworks, isLoading: artworksLoading } = useQuery({
    queryKey: ["artworks", selectedGallery],
    enabled: !!selectedGallery,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("gallery_id", selectedGallery)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return data.map(artwork => {
        let position: Position | null = null;
        if (artwork.position && typeof artwork.position === 'object') {
          const pos = artwork.position as Record<string, number>;
          if ('x' in pos && 'y' in pos && 'z' in pos) {
            position = {
              x: Number(pos.x),
              y: Number(pos.y),
              z: Number(pos.z)
            };
          }
        }

        return {
          id: artwork.id,
          title: artwork.title,
          image_url: artwork.image_url,
          position
        };
      });
    },
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      navigate("/login");
    }
  };

  const isLoading = galleriesLoading || (selectedGallery && artworksLoading);

  return (
    <div className="min-h-screen bg-gallery-50">
      <div className="container py-8 space-y-8">
        <GalleryHeader onLogout={handleLogout} />

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gallery-900 text-white hover:bg-gallery-800">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Gallery
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Gallery</DialogTitle>
            </DialogHeader>
            <CreateGalleryDialog onClose={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>

        {selectedGallery && artworks ? (
          <SelectedGalleryView
            galleryTitle={galleries?.find(g => g.id === selectedGallery)?.title || ""}
            artworks={artworks}
            onBack={() => setSelectedGallery(null)}
          />
        ) : (
          <GalleryList
            galleries={galleries || []}
            onSelectGallery={setSelectedGallery}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Index;