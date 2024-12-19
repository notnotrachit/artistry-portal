import { GalleryCard } from "@/components/GalleryCard";

interface Gallery {
  id: string;
  title: string;
  description: string | null;
  template: string;
}

interface GalleryListProps {
  galleries: Gallery[];
  onSelectGallery: (id: string) => void;
  isLoading: boolean;
}

export const GalleryList = ({ galleries, onSelectGallery, isLoading }: GalleryListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 bg-white rounded-lg shadow-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {galleries?.map((gallery) => (
        <div
          key={gallery.id}
          onClick={() => onSelectGallery(gallery.id)}
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
  );
};