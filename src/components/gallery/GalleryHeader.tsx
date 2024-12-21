import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Eye, EyeOff, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GalleryHeaderProps {
  title?: string;
  ownerName?: string;
  isPublic?: boolean;
  onBack?: () => void;
  onLogout?: () => void;
}

export const GalleryHeader = ({ title, ownerName, isPublic, onBack, onLogout }: GalleryHeaderProps) => {
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
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Galleries
          </Button>
        )}
        {title && (
          <div>
            <h1 className="text-3xl font-bold text-gallery-900">{title}</h1>
            {ownerName && <p className="text-gallery-600">Created by {ownerName}</p>}
          </div>
        )}
      </div>
      <div className="flex gap-2 items-center">
        {typeof isPublic !== 'undefined' && (
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
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end" className="max-w-sm">
              <div className="space-y-2">
                <p className="font-semibold">Gallery Controls:</p>
                <ul className="text-sm space-y-1">
                  <li>• Left/Right Arrow Keys: Move camera left/right</li>
                  <li>• Up/Down Arrow Keys: Move camera forward/backward</li>
                  <li>• R Key: Move perspective up</li>
                  <li>• F Key: Move perspective down</li>
                  <li>• Left Click + Drag: Rotate camera view</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        {onLogout && (
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};