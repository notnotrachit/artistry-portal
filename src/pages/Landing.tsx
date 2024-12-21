import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Camera, GalleryHorizontal, Heart } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gallery-50 to-white">
      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gallery-900">
            Your Art, Your Space
          </h1>
          <p className="text-xl text-gallery-600 max-w-2xl mx-auto">
            Create stunning 3D galleries to showcase your photos and artwork. Share your creative vision with the world.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gallery-900 hover:bg-gallery-800"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/explore")}
            >
              Explore Galleries
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4 text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-gallery-100 rounded-full">
              <Camera className="w-6 h-6 text-gallery-900" />
            </div>
            <h3 className="text-xl font-semibold text-gallery-900">
              For Photographers
            </h3>
            <p className="text-gallery-600">
              Create immersive galleries to showcase your photography portfolio in a unique way.
            </p>
          </div>
          <div className="space-y-4 text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-gallery-100 rounded-full">
              <GalleryHorizontal className="w-6 h-6 text-gallery-900" />
            </div>
            <h3 className="text-xl font-semibold text-gallery-900">
              For Artists
            </h3>
            <p className="text-gallery-600">
              Display your artwork in a virtual gallery space that viewers can explore.
            </p>
          </div>
          <div className="space-y-4 text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-gallery-100 rounded-full">
              <Heart className="w-6 h-6 text-gallery-900" />
            </div>
            <h3 className="text-xl font-semibold text-gallery-900">
              For Everyone
            </h3>
            <p className="text-gallery-600">
              Share your personal collections and memories in an interactive 3D space.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;