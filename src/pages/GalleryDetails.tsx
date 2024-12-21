import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import GalleryViewer3D from "@/components/GalleryViewer3D";
import { ArrowLeft, Share2, Eye, EyeOff, Pencil } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { useSession } from "@supabase/auth-helpers-react";

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

// ... keep existing code (gallery and artworks queries)

const GalleryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "The gallery link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

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

  const handleExitEditMode = () => {
    setIsEditing(false);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black w-screen h-screen">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button
            variant="outline"
            onClick={handleExitGallery}
          >
            Exit Gallery
          </Button>
          {isOwner && (
            <Button
              variant={isEditing ? "destructive" : "outline"}
              onClick={() => {
                if (isEditing) {
                  handleExitEditMode();
                } else {
                  setIsEditing(true);
                }
              }}
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Galleries
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gallery-900">
                {gallery.title}
              </h1>
              <p className="text-gallery-600">
                Created by {gallery.owner?.full_name || gallery.owner?.username}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {gallery.is_public ? (
                <>
                  <Eye className="w-4 h-4 mr-1" /> Public
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 mr-1" /> Unlisted
                </>
              )}
            </Badge>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 space-y-6">
          {gallery.description && (
            <p className="text-gallery-600">{gallery.description}</p>
          )}
          
          <div className="aspect-video bg-gallery-100 rounded-lg flex items-center justify-center">
            {artworks && artworks.length > 0 ? (
              <img 
                src={artworks[0].image_url} 
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
              onClick={() => setIsFullscreen(true)}
            >
              Enter Gallery
            </Button>
            {isOwner && (
              <Button 
                size="lg"
                variant="outline"
                onClick={() => {
                  setIsFullscreen(true);
                  setIsEditing(true);
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Gallery
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryDetails;
