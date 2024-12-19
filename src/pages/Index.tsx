import { motion } from "framer-motion";
import { GalleryCard } from "@/components/GalleryCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import GalleryViewer3D from "@/components/GalleryViewer3D";

const CreateGalleryDialog = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createGallery = useMutation({
    mutationFn: async () => {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("galleries")
        .insert([
          {
            title,
            description,
            template: "Modern", // Default template
            owner_id: profile.user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      toast({ title: "Success", description: "Gallery created successfully" });
      onClose();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter gallery title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter gallery description"
        />
      </div>
      <Button
        className="w-full"
        onClick={() => createGallery.mutate()}
        disabled={!title || createGallery.isPending}
      >
        Create Gallery
      </Button>
    </div>
  );
};

const Index = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: galleries, isLoading: galleriesLoading } = useQuery({
    queryKey: ["galleries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("galleries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: artworks, isLoading: artworksLoading } = useQuery({
    queryKey: ["artworks", selectedGallery],
    enabled: !!selectedGallery,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("gallery_id", selectedGallery)
        .order("created_at", { ascending: true });

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

  const isLoading = galleriesLoading || (selectedGallery && artworksLoading);

  return (
    <div className="min-h-screen bg-gallery-50">
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-medium text-gallery-900">Virtual Art Gallery</h1>
            <p className="text-gallery-600 max-w-2xl">
              Create stunning virtual galleries to showcase your artwork. Choose from beautiful templates
              and customize every detail to match your vision.
            </p>
          </motion.div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

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

        {selectedGallery && artworks && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-medium text-gallery-900">
                {galleries?.find(g => g.id === selectedGallery)?.title}
              </h2>
              <Button variant="outline" onClick={() => setSelectedGallery(null)}>
                Back to Galleries
              </Button>
            </div>
            <GalleryViewer3D artworks={artworks} />
          </div>
        )}

        {!selectedGallery && (
          isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-white rounded-lg shadow-md animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries?.map((gallery) => (
                <div
                  key={gallery.id}
                  onClick={() => setSelectedGallery(gallery.id)}
                  className="cursor-pointer"
                >
                  <GalleryCard
                    title={gallery.title}
                    description={gallery.description || ""}
                    imageUrl="/placeholder.svg"
                    artworkCount={0}
                    template={gallery.template}
                  />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Index;
