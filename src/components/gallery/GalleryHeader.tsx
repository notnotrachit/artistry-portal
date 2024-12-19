import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface GalleryHeaderProps {
  onLogout: () => void;
}

export const GalleryHeader = ({ onLogout }: GalleryHeaderProps) => {
  return (
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
      <Button variant="outline" onClick={onLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};