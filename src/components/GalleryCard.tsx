import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Eye, EyeOff, Heart } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface GalleryCardProps {
  title: string;
  description: string;
  imageUrl: string | null;
  artworkCount: number;
  template: string;
  isPublic: boolean;
  likeCount: number;
  isLiked: boolean;
  galleryId: string;
}

export const GalleryCard = ({ 
  title, 
  description, 
  imageUrl, 
  artworkCount, 
  template,
  isPublic,
  likeCount,
  isLiked,
  galleryId
}: GalleryCardProps) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!session) {
      toast.error("Please sign in to like galleries");
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from("gallery_likes")
          .delete()
          .eq("gallery_id", galleryId)
          .eq("user_id", session.user.id);
      } else {
        await supabase
          .from("gallery_likes")
          .insert({
            gallery_id: galleryId,
            user_id: session.user.id
          });
      }
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["gallery-data"] });
      queryClient.invalidateQueries({ queryKey: ["public-galleries"] });
    } catch (error) {
      toast.error("Failed to update like status");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <Card className="overflow-hidden border border-gallery-200 bg-white/80 backdrop-blur-sm">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gallery-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gallery-400">
              No artworks yet
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge variant="secondary" className="bg-white/90 text-gallery-800">
              {template}
            </Badge>
            <Badge variant="secondary" className="bg-white/90 text-gallery-800">
              {artworkCount} {artworkCount === 1 ? 'artwork' : 'artworks'}
            </Badge>
          </div>
        </div>
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-medium text-gallery-900">{title}</CardTitle>
            <Badge variant="secondary" className="text-sm">
              {isPublic ? (
                <>
                  <Eye className="w-3 h-3 mr-1" /> Public
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 mr-1" /> Unlisted
                </>
              )}
            </Badge>
          </div>
          <CardDescription className="text-gallery-600">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-gallery-500 hover:text-gallery-600'}`}
                onClick={handleLike}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                {likeCount}
              </Button>
            </div>
            <button className="text-sm font-medium text-gallery-900 hover:text-gallery-700 transition-colors">
              View Details →
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};