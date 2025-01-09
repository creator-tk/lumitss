import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { uploadImages } from "@/lib/actions/product.action";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react";


const ImageUploader = ({ imageId, closePopUp }: { imageId: string; closePopUp: () => void }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        setLoading(true);
        const result = await uploadImages(imageId, file);

        if (result.success) {
          toast({
            title: "Success",
            description: `${file.name} uploaded successfully!`,
          });
        } else {
          toast({
            title: "Error",
            description: `Failed to upload ${file.name}. ${result.message}`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        toast({
          title: "Error",
          description: `An unexpected error occurred with ${file.name}.`,
          variant: "destructive",
        });
      }finally{
        setOpen(false);
        setLoading(false);
        closePopUp();
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Accept only images
    multiple: true, // Allow multiple files to be dropped
  });

  return (
    <AlertDialog open={open} >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upload Related Images</AlertDialogTitle>
          <AlertDialogDescription>
              Drag and drop some files here, or click to select files to upload.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div {...getRootProps()} className="cursor-pointer border p-4 rounded-lg">
          <input {...getInputProps()} />
          <Button type="button" disabled={loading}>
            <p>Upload Images</p>
            {loading && <Loader2 className="animate-spin"/>}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImageUploader;
