/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Eye, EyeOff, HelpCircle, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateGalleryDialog } from "./CreateGalleryDialog";
import { useState } from "react";
// import { redirect } from "react-router-dom";

interface GalleryHeaderProps {
  title?: string;
  ownerName?: string;
  isPublic?: boolean;
  onBack?: () => void;
  onLogout?: () => void;
  showNewGallery?: boolean;
  session?: any;
  supabase?: any;
}

export const GalleryHeader = ({ title, ownerName, isPublic, onBack, onLogout, showNewGallery = false, session, supabase }: GalleryHeaderProps) => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const user = session?.user;

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

  const logout = async () => {
    if (user) {
      await supabase.auth.signOut();
    }
  }

  const login = async () => {
    // redirect to login
    console.log("login");
    window.location.href = "/login";
  }

  return (
    <div className="flex items-center justify-between text-white">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button
            onClick={onBack}
            className="border-zinc-700 text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Galleries
          </Button>
        )}
        {title && (
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              {title}
            </h1>
            {ownerName && (
              <p className="text-zinc-400">Created by {ownerName}</p>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-2 items-center">
        {showNewGallery && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="border-zinc-700 text-white hover:bg-zinc-800"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Gallery
          </Button>
        )}
        {typeof isPublic !== "undefined" && (
          <Badge className="bg-zinc-800 border-zinc-700 text-zinc-100">
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
              <Button
                size="icon"
                className="border-zinc-700 text-white hover:bg-zinc-800"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="end"
              className="bg-zinc-900 border-zinc-800 text-white"
            >
              <div className="space-y-2">
                <p className="font-semibold">Gallery Controls:</p>
                <ul className="text-sm space-y-1">
                  <li>• Left/Right Arrow Keys: Move camera left/right</li>
                  <li>• Up/Down Arrow Keys: Move camera forward/backward</li>
                  <li>• R Key: Move perspective up</li>
                  <li>• F Key: Move perspective down</li>
                  <li>• Right Click + Drag: Rotate camera view</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          onClick={handleShare}
          className="border-zinc-700 text-white hover:bg-zinc-800"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        {user && (
          <Button
            variant="destructive"
            onClick={logout}
            className="border-zinc-700 text-white hover:bg-zinc-800"
          >
            Logout
          </Button>
        )}
        {!user && (
          <Button
            onClick={login}
            className="border-zinc-700 text-white hover:bg-zinc-800"
          >
            Login
          </Button>
        ) 
        
        }
      </div>

      {showCreateDialog && (
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Gallery</DialogTitle>
            </DialogHeader>
            <CreateGalleryDialog onClose={() => setShowCreateDialog(false)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};