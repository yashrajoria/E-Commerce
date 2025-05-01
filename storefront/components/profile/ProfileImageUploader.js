import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// interface ProfileImageUploaderProps {
//   currentImage?: string;
//   onImageChange: (image: string) => void;
// }

export function ProfileImageUploader({ currentImage, onImageChange }) {
  const [previewUrl, setPreviewUrl] = useState(currentImage);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image under 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setPreviewUrl(imageUrl);
        onImageChange(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <img
          src={previewUrl || "/placeholder.svg"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300"
        />
        <label
          htmlFor="profile-image"
          className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Upload className="w-8 h-8 text-white" />
        </label>
      </div>
      <input
        type="file"
        id="profile-image"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}
