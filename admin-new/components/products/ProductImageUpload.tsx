"use client";

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GripVertical, X } from "lucide-react";

interface ImageItem {
  id: string;
  file: File;
  url: string;
}

interface ProductImageUploadProps {
  images: ImageItem[];
  setImages: (images: ImageItem[]) => void;
}

export default function ProductImageUpload({
  images,
  setImages,
}: ProductImageUploadProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("File size exceeds the 5MB limit.");
      return false;
    }

    return true;
  };

  const handleFileUpload = (files) => {
    const validFiles = Array.from(files).filter(validateFile);
    if (validFiles.length > 0) {
      // Process valid files
      setImages(validFiles);
    }
  };

  const handleRemove = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    setImages(arrayMove(images, oldIndex, newIndex));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
        <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
          PRODUCT IMAGES
        </h3>

        <Tabs defaultValue="file" className="w-full space-y-4">
          <TabsList className="grid w-full">
            <TabsTrigger
              value="file"
              className="w-full data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
            >
              Upload Files
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Drag and drop or select multiple images
              </p>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="bg-white dark:bg-gray-950"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview and reorder section */}
        {images?.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img) => img.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid gap-4 mt-6">
                {images.map((img) => (
                  <SortableImage
                    key={img.id}
                    id={img.id}
                    url={img.url}
                    onRemove={() => handleRemove(img.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No images uploaded yet
          </div>
        )}
      </div>
    </div>
  );
}

function SortableImage({
  id,
  url,
  onRemove,
}: {
  id: string;
  url: string;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex items-center gap-4 p-2 border rounded-md dark:border-gray-700 bg-white dark:bg-gray-900"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      <img
        src={url}
        alt="Uploaded"
        className="w-20 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-700"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="absolute top-1 right-1"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
