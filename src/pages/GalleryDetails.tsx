import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import GalleryViewer3D from "@/components/GalleryViewer3D";
import { Button } from "@/components/ui/button";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";
import { GalleryPreview } from "@/components/gallery/GalleryPreview";
import { Database } from "@/integrations/supabase/types";

type Artwork = Database['public']['Tables']['artworks']['Row'];

const transformArtworkData = (artwork: Artwork) => {
  const defaultPosition = { x: 0, y: 0, z: 0 };
  const defaultRotation = { x: 0, y: 0, z: 0 };

  return {
    id: artwork.id,
    title: artwork.title,
    image_url: artwork.image_url,
    position: artwork.position ? 
      (typeof artwork.position === 'string' ? 
        JSON.parse(artwork.position) : artwork.position) as { x: number; y: number; z: number } : 
      defaultPosition,
    rotation: artwork.rotation ? 
      (typeof artwork.rotation === 'string' ? 
        JSON.parse(artwork.rotation) : artwork.rotation) as { x: number; y: number; z: number } : 
      defaultRotation,
    scale: artwork.scale ?
      (typeof artwork.scale === 'string' ?
        JSON.parse(artwork.scale) : artwork.scale) as { x: number; y: number }
      : { x: 1, y: 1 }
  };
};

const GalleryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const session = useSession();

  const { data: gallery, isLoading: galleryLoading } = useQuery({
    queryKey: ["gallery", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("galleries")
        .select(`
          *,
          owner:profiles!galleries_owner_id_fkey(
            username,
            full_name
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: artworks, isLoading: artworksLoading } = useQuery({
    queryKey: ["artworks", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("gallery_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data?.map(transformArtworkData) || [];
    },
  });

  if (galleryLoading || artworksLoading) {
    return <div>Loading...</div>;
  }

  if (!gallery) {
    return <div>Gallery not found</div>;
  }

  const isOwner = session?.user?.id === gallery.owner_id;

  const handleExitGallery = () => {
    setIsFullscreen(false);
    setIsEditing(false);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black w-screen h-screen">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button variant="outline" onClick={handleExitGallery}>
            Exit Gallery
          </Button>
          {isOwner && (
            <Button
              variant={isEditing ? "destructive" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Exit Edit Mode" : "Edit Gallery"}
            </Button>
          )}
        </div>
        <div className="w-full h-full">
          <GalleryViewer3D artworks={artworks || []} isOwner={isEditing} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gallery-50">
      <div className="container py-8 space-y-8">
        <GalleryHeader
          title={gallery.title}
          ownerName={gallery.owner?.full_name || gallery.owner?.username}
          isPublic={gallery.is_public}
          onBack={() => navigate("/")}
        />
        <GalleryPreview
          description={gallery.description}
          previewImageUrl={artworks?.[0]?.image_url}
          onEnterGallery={() => setIsFullscreen(true)}
          onEditGallery={() => {
            setIsFullscreen(true);
            setIsEditing(true);
          }}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
};

export default GalleryDetails;