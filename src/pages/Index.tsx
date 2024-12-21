import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";
import { CreateGalleryDialog } from "@/components/gallery/CreateGalleryDialog";
import { GalleryList } from "@/components/gallery/GalleryList";

const Index = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: galleries, isLoading: galleriesLoading } = useQuery({
    queryKey: ["galleries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("galleries")
        .select(`
          *,
          owner:profiles!galleries_owner_id_fkey(username, full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gallery-50">
      <div className="container py-8 space-y-8">
        <GalleryHeader onLogout={handleLogout} />

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gallery-900 text-white hover:bg-gallery-800">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Gallery
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Gallery</DialogTitle>
            </DialogHeader>
            <CreateGalleryDialog onClose={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>

        <GalleryList
          galleries={galleries || []}
          onSelectGallery={(id) => navigate(`/gallery/${id}`)}
          isLoading={galleriesLoading}
        />
      </div>
    </div>
  );
};

export default Index;