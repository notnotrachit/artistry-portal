import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddArtworkDialogProps {
  galleryId: string;
  onClose: () => void;
}

export const AddArtworkDialog = ({ galleryId, onClose }: AddArtworkDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadArtwork = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file selected");
      setIsUploading(true);

      try {
        // Upload image to storage
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('artworks')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('artworks')
          .getPublicUrl(filePath);

        // Create artwork record
        const { error: dbError } = await supabase
          .from('artworks')
          .insert([
            {
              title,
              description,
              image_url: publicUrl,
              gallery_id: galleryId,
              position: { x: 0, y: 0, z: -1.9 }
            }
          ]);

        if (dbError) throw dbError;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks', galleryId] });
      toast({ title: "Success", description: "Artwork added successfully" });
      onClose();
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
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
          placeholder="Enter artwork title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter artwork description"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>
      <Button
        className="w-full"
        onClick={() => uploadArtwork.mutate()}
        disabled={!title || !file || isUploading}
      >
        {isUploading ? "Uploading..." : "Add Artwork"}
      </Button>
    </div>
  );
};