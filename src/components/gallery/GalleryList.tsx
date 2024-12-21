import { useQuery } from "@tanstack/react-query";
import { GalleryCard } from "@/components/GalleryCard";
import { supabase } from "@/integrations/supabase/client";

interface Gallery {
  id: string;
  title: string;
  description: string | null;
  template: string;
  is_public: boolean;
}

interface GalleryListProps {
  galleries: Gallery[];
  onSelectGallery: (id: string) => void;
  isLoading: boolean;
}

export const GalleryList = ({ galleries, onSelectGallery, isLoading }: GalleryListProps) => {
  // Fetch first artwork for each gallery
  const { data: artworkPreviews } = useQuery({
    queryKey: ["gallery-previews"],
    queryFn: async () => {
      const galleryIds = galleries.map(g => g.id);
      const { data, error } = await supabase
        .from("artworks")
        .select("gallery_id, image_url")
        .in("gallery_id", galleryIds)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Create a map of gallery_id to first artwork image_url
      const previewMap = new Map();
      data.forEach(artwork => {
        if (!previewMap.has(artwork.gallery_id)) {
          previewMap.set(artwork.gallery_id, artwork.image_url);
        }
      });

      return previewMap;
    },
    enabled: galleries.length > 0,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 bg-white rounded-lg shadow-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {galleries?.map((gallery) => (
        <div
          key={gallery.id}
          onClick={() => onSelectGallery(gallery.id)}
          className="cursor-pointer"
        >
          <GalleryCard
            title={gallery.title}
            description={gallery.description || ""}
            imageUrl={artworkPreviews?.get(gallery.id) || null}
            artworkCount={0}
            template={gallery.template}
            isPublic={gallery.is_public}
          />
        </div>
      ))}
    </div>
  );
};