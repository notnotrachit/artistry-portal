import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Camera, Box, Share2, Users } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            VisionVault
          </h1>
          <p className="text-2xl md:text-3xl text-zinc-300">
            Transform Your Art into Immersive 3D Galleries
          </p>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Create stunning virtual exhibitions, showcase your work in
            interactive 3D spaces, and share your creative vision with the
            world.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={() => navigate("/login")}
            >
              Start Creating
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={() => navigate("/explore")}
            >
              Explore Galleries
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Box className="w-6 h-6" />}
            title="3D Galleries"
            description="Create immersive virtual spaces that bring your artwork to life"
          />
          <FeatureCard
            icon={<Camera className="w-6 h-6" />}
            title="Perfect Display"
            description="Showcase your work with perfect lighting and viewpoints"
          />
          <FeatureCard
            icon={<Share2 className="w-6 h-6" />}
            title="Easy Sharing"
            description="Share your galleries with anyone, anywhere in the world"
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Community"
            description="Join a community of artists and creators"
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Art?
            </h2>
            <p className="text-zinc-300">
              Join VisionVault today and give your artwork the space it
              deserves.
            </p>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-zinc-100"
              onClick={() => navigate("/login")}
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => (
  <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-zinc-400">{description}</p>
  </div>
);

export default Landing;