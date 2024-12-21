import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GalleryHeaderProps {
  title: string;
  ownerName: string;
  isPublic: boolean;
  onBack: () => void;
}

export const GalleryHeader = ({ title, ownerName, isPublic, onBack }: GalleryHeaderProps) => {
  const { toast } = useToast();

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

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Galleries
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gallery-900">{title}</h1>
          <p className="text-gallery-600">Created by {ownerName}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Badge variant="secondary">
          {isPublic ? (
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
  );
};