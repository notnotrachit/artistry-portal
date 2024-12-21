import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import GalleryViewer3D from "@/components/GalleryViewer3D";
import { ArrowLeft, Share2, Eye, EyeOff } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Artwork = Database['public']['Tables']['artworks']['Row'];

// Helper function to transform the position and rotation data
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
      defaultRotation
  };
};

const GalleryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black">
        <Button
          variant="outline"
          className="absolute top-4 left-4 z-10"
          onClick={() => setIsFullscreen(false)}
        >
          Exit Fullscreen
        </Button>
        <GalleryViewer3D artworks={artworks || []} />
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
          
          <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
            <GalleryViewer3D artworks={artworks || []} />
          </div>

          <Button 
            size="lg" 
            className="w-full"
            onClick={() => setIsFullscreen(true)}
          >
            Enter Gallery
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GalleryDetails;