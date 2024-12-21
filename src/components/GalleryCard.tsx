import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface GalleryCardProps {
  title: string;
  description: string;
  imageUrl: string | null;
  artworkCount: number;
  template: string;
  isPublic: boolean;
}

export const GalleryCard = ({ 
  title, 
  description, 
  imageUrl, 
  artworkCount, 
  template,
  isPublic 
}: GalleryCardProps) => {
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
            <div className="text-sm text-gallery-500">Last updated 2 days ago</div>
            <button className="text-sm font-medium text-gallery-900 hover:text-gallery-700 transition-colors">
              View Details →
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};