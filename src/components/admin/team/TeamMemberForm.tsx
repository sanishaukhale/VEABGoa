
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { teamMemberFormSchema, type TeamMemberFormValues } from "@/lib/schemas/teamMemberSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, PlusCircle, Trash2, Image as ImageIcon, UploadCloud } from "lucide-react";
import type { TeamMember } from "@/types";
import { useState, useEffect, type ChangeEvent } from "react";
import Image from "next/image";
import { storage } from '@/lib/firebase';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject, type StorageError } from 'firebase/storage';

interface TeamMemberFormProps {
  member?: TeamMember | null;
  onSubmitAction: (data: TeamMemberFormValues) => Promise<{ success: boolean; error?: string; message?: string }>;
  onFormClose: () => void;
  isSubmitting: boolean; // This prop is for the overall form submission state, not image upload
}

export default function TeamMemberForm({ member, onSubmitAction, onFormClose, isSubmitting: isFormSubmitting }: TeamMemberFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [currentImageUrlForPreview, setCurrentImageUrlForPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: member?.name || "",
      role: member?.role || "",
      imageUrl: member?.imageUrl || "", // This will be the path in storage
      dataAiHint: member?.dataAiHint || "",
      intro: member?.intro || "",
      profession: member?.profession || "",
      socials: member?.socials || [],
      displayOrder: member?.displayOrder ?? undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socials",
  });

  useEffect(() => {
    // If editing a member with an existing image, fetch its URL for preview
    if (member?.imageUrl && !member.imageUrl.startsWith('https://') && !member.imageUrl.startsWith('http://')) {
      const imageSPath = member.imageUrl;
      if (storage && imageSPath) {
        getDownloadURL(storageRef(storage, imageSPath))
          .then((url) => {
            setCurrentImageUrlForPreview(url);
            if (!selectedFile) { // Only set preview if no new file is selected
              setImagePreviewUrl(url);
            }
          })
          .catch((error: StorageError) => {
            console.error("Error fetching current image for preview:", error);
            if (error.code === 'storage/object-not-found') {
              setImageError(`Current image not found at path: ${imageSPath}. It might have been deleted or moved.`);
            } else {
              setImageError("Could not load current image preview.");
            }
            setCurrentImageUrlForPreview(null);
          });
      }
    } else if (member?.imageUrl && (member.imageUrl.startsWith('https://') || member.imageUrl.startsWith('http://'))) {
        // If imageUrl is already a full URL (e.g. placeholder), use it directly
        setCurrentImageUrlForPreview(member.imageUrl);
         if (!selectedFile) {
            setImagePreviewUrl(member.imageUrl);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member?.imageUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setImageError(null);
      form.setValue('imageUrl', ''); // Clear the manual path if a file is chosen
    } else {
      setSelectedFile(null);
      // Revert to current image preview if available, otherwise null
      setImagePreviewUrl(currentImageUrlForPreview);
    }
  };

  const handleFormSubmitInternal = async (data: TeamMemberFormValues) => {
    setImageError(null);
    let finalImageUrl = data.imageUrl || member?.imageUrl || ""; // Start with existing or manually entered path

    if (selectedFile && storage) {
      setIsUploadingImage(true);
      setUploadProgress(0);
      
      // Use member id or 'new' for folder structure, and timestamp for uniqueness
      const uniqueFileName = `${member?.id || 'new'}_${Date.now()}_${selectedFile.name.replace(/\s+/g, '_')}`;
      const imagePath = `team-images/${uniqueFileName}`;
      const fileRef = storageRef(storage, imagePath);

      const uploadTask = uploadBytesResumable(fileRef, selectedFile);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Image upload error:", error);
            setImageError(`Upload failed: ${error.message}`);
            setIsUploadingImage(false);
            setUploadProgress(null);
            reject(error);
          },
          async () => {
            finalImageUrl = uploadTask.snapshot.ref.fullPath;
            form.setValue('imageUrl', finalImageUrl); // Update form value with the new path

            // Attempt to delete old image if it exists and is different
            if (member?.imageUrl && member.imageUrl !== finalImageUrl && !member.imageUrl.startsWith('https://') && !member.imageUrl.startsWith('http://')) {
              try {
                await deleteObject(storageRef(storage, member.imageUrl));
                console.log("Old image deleted:", member.imageUrl);
              } catch (deleteError) {
                console.warn("Failed to delete old image:", member.imageUrl, deleteError);
                // Non-critical, so we don't block the process, but good to log
              }
            }
            setIsUploadingImage(false);
            setUploadProgress(null);
            resolve();
          }
        );
      });
    }
    // Update data object with the potentially new imageUrl before submitting
    const dataToSubmit = { ...data, imageUrl: finalImageUrl };
    await onSubmitAction(dataToSubmit);
    // Reset states on successful form submission (parent will close dialog)
    // setSelectedFile(null); // Parent re-renders, should reset naturally
    // setImagePreviewUrl(null); // Parent re-renders
  };
  
  const isOverallSubmitting = isFormSubmitting || isUploadingImage;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmitInternal)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Team member's full name" {...field} disabled={isOverallSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role/Position</FormLabel>
              <FormControl>
                <Input placeholder="e.g., President, Volunteer Coordinator" {...field} disabled={isOverallSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Member Image</FormLabel>
          <FormControl>
            <div className="flex items-center gap-4">
              {imagePreviewUrl ? (
                <Image
                  src={imagePreviewUrl}
                  alt="Image Preview"
                  width={80}
                  height={80}
                  className="rounded-md object-cover border"
                  unoptimized={imagePreviewUrl.startsWith('blob:')} // Don't optimize blob URLs
                />
              ) : (
                <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center border">
                  <ImageIcon size={32} className="text-muted-foreground" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-1"
                disabled={isOverallSubmitting}
              />
            </div>
          </FormControl>
          <FormDescription>
            Upload an image for the team member. This will overwrite the existing image if one is present.
            The "Image Path in Storage" field below will be updated automatically after a successful upload.
          </FormDescription>
          {uploadProgress !== null && (
            <Progress value={uploadProgress} className="w-full mt-2 h-2" />
          )}
          {imageError && <p className="text-sm font-medium text-destructive mt-1">{imageError}</p>}
        </FormItem>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Path in Storage</FormLabel>
              <FormControl>
                <Input placeholder="e.g., team-images/member-photo.png (auto-filled on upload)" {...field} disabled={isOverallSubmitting || isUploadingImage} readOnly={!!selectedFile} />
              </FormControl>
              <FormDescription>
                Path to the image in Firebase Storage. Automatically updated if you upload an image above. You can manually edit this if you are not uploading a new file.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dataAiHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image AI Hint (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 'person smiling'" {...field} disabled={isOverallSubmitting} />
              </FormControl>
              <FormDescription>Keywords for placeholder image services. Max two words.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Introduction/Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Short introduction or biography for the team member." {...field} rows={3} disabled={isOverallSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profession"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profession</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Environmental Scientist, Community Lead" {...field} disabled={isOverallSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order (Optional)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 1, 2, 3 (lower # appear first)" {...field} onChange={e => field.onChange(parseInt(e.target.value,10))} disabled={isOverallSubmitting} />
              </FormControl>
              <FormDescription>Controls the order on the About Us page. Leave blank if not needed.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Social Links</FormLabel>
          <FormDescription>Add social media or contact links.</FormDescription>
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-end gap-2 mt-2 p-3 border rounded-md">
              <FormField
                control={form.control}
                name={`socials.${index}.platform`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">Platform</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., LinkedIn, Mail, Twitter" {...field} disabled={isOverallSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`socials.${index}.url`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://linkedin.com/in/..." {...field} disabled={isOverallSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={isOverallSubmitting}>
                <Trash2 size={16} />
                <span className="sr-only">Remove social link</span>
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ platform: "", url: "" })}
            disabled={isOverallSubmitting}
          >
            <PlusCircle size={16} className="mr-2" /> Add Social Link
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onFormClose} disabled={isOverallSubmitting}>
                Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isOverallSubmitting}>
            {isOverallSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploadingImage ? "Uploading..." : "Saving..."}
                </>
            ) : (
                member ? "Update Member" : "Add Member"
            )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
