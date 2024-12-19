import { motion } from "framer-motion";
import { GalleryCard } from "@/components/GalleryCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const galleries = [
  {
    title: "Modern Art Collection",
    description: "A curated selection of contemporary artworks",
    imageUrl: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&auto=format&fit=crop&q=80",
    artworkCount: 12,
    template: "Modern",
  },
  {
    title: "Photography Exhibition",
    description: "Black and white photography series",
    imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-1.2.1&auto=format&fit=crop&q=80",
    artworkCount: 8,
    template: "Minimal",
  },
  {
    title: "Digital Art Showcase",
    description: "Exploring the boundaries of digital creativity",
    imageUrl: "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?ixlib=rb-1.2.1&auto=format&fit=crop&q=80",
    artworkCount: 15,
    template: "Abstract",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gallery-50">
      <div className="container py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-medium text-gallery-900">Virtual Art Gallery</h1>
          <p className="text-gallery-600 max-w-2xl mx-auto">
            Create stunning virtual galleries to showcase your artwork. Choose from beautiful templates
            and customize every detail to match your vision.
          </p>
          <Button className="bg-gallery-900 text-white hover:bg-gallery-800">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Gallery
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery, index) => (
            <GalleryCard key={index} {...gallery} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;