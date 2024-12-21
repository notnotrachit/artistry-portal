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
          owner:profiles(username, full_name)
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
    <div className="min-h-screen bg-gallery-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gallery-900">
            Explore Galleries
          </h1>
          <p className="text-gallery-600">
            Discover amazing collections from artists and photographers around the world
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gallery-400" />
          <Input
            className="pl-10"
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