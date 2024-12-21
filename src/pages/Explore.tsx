import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { GalleryList } from "@/components/gallery/GalleryList";
import { supabase } from "@/integrations/supabase/client";

const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: galleries, isLoading } = useQuery({
    queryKey: ["public-galleries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("galleries")
        .select(`
          *,
          owner:profiles!galleries_owner_id_fkey(username, full_name)
        `)
        .eq("is_public", true)
        .order("view_count", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const filteredGalleries = galleries?.filter(
    (gallery) =>
      gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gallery.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Explore Galleries
          </h1>
          <p className="text-zinc-300">
            Discover amazing collections from artists and photographers around the world
          </p>
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

        <GalleryList
          galleries={filteredGalleries || []}
          onSelectGallery={(id) => navigate(`/gallery/${id}`)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Explore;