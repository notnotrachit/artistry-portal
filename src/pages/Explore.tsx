import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import { GalleryList } from "@/components/gallery/GalleryList";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateGalleryDialog } from "@/components/gallery/CreateGalleryDialog";

const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const session = useSession();

  const { data: galleries, isLoading } = useQuery({
    queryKey: ["galleries", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        // If not logged in, only fetch public galleries
        const { data, error } = await supabase
          .from("galleries")
          .select(`
            *,
            owner:profiles!galleries_owner_id_fkey(username, full_name)
          `)
          .eq("is_public", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data || [];
      }

      // If logged in, fetch both public galleries and user's private galleries
      const { data, error } = await supabase
        .from("galleries")
        .select(`
          *,
          owner:profiles!galleries_owner_id_fkey(username, full_name)
        `)
        .or(`is_public.eq.true,owner_id.eq.${session.user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Separate galleries into public and private
  const publicGalleries = galleries?.filter(gallery => gallery.is_public);
  const privateGalleries = galleries?.filter(gallery => 
    !gallery.is_public && gallery.owner_id === session?.user?.id
  );

  // Filter based on search query
  const filteredPublicGalleries = publicGalleries?.filter(
    gallery =>
      gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gallery.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPrivateGalleries = privateGalleries?.filter(
    gallery =>
      gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gallery.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Explore Galleries
            </h1>
            <p className="text-zinc-300">
              Discover amazing collections from artists and photographers around the world
            </p>
          </div>
          <div className="flex gap-2">
            {session && (
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="border-zinc-700 text-white hover:bg-zinc-800"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                New Gallery
              </Button>
            )}
            {session ? (
              <Button
                variant="destructive"
                onClick={() => supabase.auth.signOut()}
                className="border-zinc-700 text-white hover:bg-zinc-800"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Login
              </Button>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
          <Input
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-400"
            placeholder="Search galleries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {session?.user && filteredPrivateGalleries && filteredPrivateGalleries.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Your Private Galleries</h2>
            <GalleryList
              galleries={filteredPrivateGalleries}
              onSelectGallery={(id) => navigate(`/gallery/${id}`)}
              isLoading={isLoading}
            />
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Public Galleries</h2>
          <GalleryList
            galleries={filteredPublicGalleries || []}
            onSelectGallery={(id) => navigate(`/gallery/${id}`)}
            isLoading={isLoading}
          />
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
    </div>
  );
};

export default Explore;