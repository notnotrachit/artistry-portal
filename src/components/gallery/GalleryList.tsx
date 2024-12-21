import { useQuery } from "@tanstack/react-query";
import { GalleryCard } from "@/components/GalleryCard";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface Gallery {
  id: string;
  title: string;
  description: string | null;
  template: string;
  is_public: boolean;
  like_count: number;
}

interface GalleryListProps {
  galleries: Gallery[];
  onSelectGallery: (id: string) => void;
  isLoading: boolean;
}

export const GalleryList = ({ galleries, onSelectGallery, isLoading }: GalleryListProps) => {
  const session = useSession();

  // Fetch first artwork for each gallery and artwork counts
  const { data: galleryData } = useQuery({
    queryKey: ["gallery-data", galleries.map(g => g.id)],
    queryFn: async () => {
      const galleryIds = galleries.map(g => g.id);
      
      // Fetch artwork previews
      const { data: artworks } = await supabase
        .from("artworks")
        .select("gallery_id, image_url")
        .in("gallery_id", galleryIds)
        .order("created_at", { ascending: true });

      // Count artworks per gallery
      const { data: artworkCounts } = await supabase
        .from("artworks")
        .select("gallery_id, count", { count: "exact" })
        .in("gallery_id", galleryIds)
        .group("gallery_id");

      // Fetch like status for logged-in user
      let userLikes = new Set<string>();
      if (session?.user) {
        const { data: likes } = await supabase
          .from("gallery_likes")
          .select("gallery_id")
          .eq("user_id", session.user.id)
          .in("gallery_id", galleryIds);
        
        userLikes = new Set(likes?.map(like => like.gallery_id) || []);
      }

      // Create preview map
      const previewMap = new Map();
      artworks?.forEach(artwork => {
        if (!previewMap.has(artwork.gallery_id)) {
          previewMap.set(artwork.gallery_id, artwork.image_url);
        }
      });

      // Create count map
      const countMap = new Map();
      artworkCounts?.forEach(count => {
        countMap.set(count.gallery_id, parseInt(count.count));
      });

      return {
        previews: previewMap,
        counts: countMap,
        userLikes
      };
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
            imageUrl={galleryData?.previews.get(gallery.id) || null}
            artworkCount={galleryData?.counts.get(gallery.id) || 0}
            template={gallery.template}
            isPublic={gallery.is_public}
            likeCount={gallery.like_count}
            isLiked={galleryData?.userLikes.has(gallery.id) || false}
            galleryId={gallery.id}
          />
        </div>
      ))}
    </div>
  );
};