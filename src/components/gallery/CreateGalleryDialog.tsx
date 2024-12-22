import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff } from "lucide-react";

interface CreateGalleryDialogProps {
  onClose: () => void;
}

export const CreateGalleryDialog = ({ onClose }: CreateGalleryDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
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
            template: "Modern",
            owner_id: profile.user.id,
            is_public: isPublic,
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
    <div className="space-y-4 p-2 text-white">
      <div className="space-y-2">
        <Label className="text-black">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter gallery title"
          className="bg-base/50 border-zinc-800 placeholder:text-zinc-500 text-gray-800"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-black">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter gallery description"
          className="bg-base/50 border-zinc-800 placeholder:text-zinc-500 text-gray-800"
        />
      </div>
      <div className="flex items-center justify-between space-x-2 p-2 rounded-lg  border border-zinc-800">
        <div className="space-y-0.5">
          <Label className="text-black">Public Visibility</Label>
          <div className="text-sm text-zinc-400 flex items-center">
            {isPublic ? (
              <>
                <Eye className="w-4 h-4 mr-1" />
                Public gallery
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-1" />
                Private gallery
              </>
            )}
          </div>
        </div>
        <Switch
          checked={isPublic}
          onCheckedChange={setIsPublic}
          className="data-[state=checked]:bg-indigo-600"
        />
      </div>
      <Button
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        onClick={() => createGallery.mutate()}
        disabled={!title || createGallery.isPending}
      >
        Create Gallery
      </Button>
    </div>
  );
};