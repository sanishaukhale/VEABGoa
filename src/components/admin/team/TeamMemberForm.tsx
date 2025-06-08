
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
import { Loader2, PlusCircle, Trash2, Image as ImageIcon } from "lucide-react";
import type { TeamMember } from "@/types";
import { useState, useEffect, type ChangeEvent } from "react";
import NextImage from "next/image";
import { storage } from '@/lib/firebase';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject, type StorageError } from 'firebase/storage';

interface TeamMemberFormProps {
  member?: TeamMember | null;
  onSubmitAction: (data: TeamMemberFormValues) => Promise<{ success: boolean; error?: string; message?: string }>;
  onFormClose: () => void;
  isSubmitting: boolean;
}

export default function TeamMemberForm({ member, onSubmitAction, onFormClose, isSubmitting: isFormSubmitting }: TeamMemberFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [currentImageUrlForPreview, setCurrentImageUrlForPreview] = useState<string | null>(null); // Stores the actual URL of the existing image
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      imageUrl: "",
      dataAiHint: "",
      intro: "",
      profession: "",
      socials: [],
      displayOrder: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socials",
  });

  const { reset, setValue } = form;

  useEffect(() => {
    setSelectedFile(null);
    setUploadProgress(null);
    setImageError(null);

    const newValues = {
        name: member?.name || "",
        role: member?.role || "",
        imageUrl: member?.imageUrl || "",
        dataAiHint: member?.dataAiHint || "",
        intro: member?.intro || "",
        profession: member?.profession || "",
        socials: member?.socials || [],
        displayOrder: member?.displayOrder ?? undefined,
    };
    reset(newValues); // Reset the form with new/default values

    setCurrentImageUrlForPreview(null); // Clear old actual preview URL first
    setImagePreviewUrl(null); // Clear general preview URL

    if (member?.imageUrl) {
      if (!member.imageUrl.startsWith('https://') && !member.imageUrl.startsWith('http://') && !member.imageUrl.startsWith('/')) {
        // It's a Firebase Storage path
        if (storage) {
          getDownloadURL(storageRef(storage, member.imageUrl))
            .then((url) => {
              setCurrentImageUrlForPreview(url); // Store the fetched URL
              if (!selectedFile) { // Only update main preview if no new file is selected
                  setImagePreviewUrl(url);
              }
            })
            .catch((error: StorageError) => {
              console.error("Error fetching current image for preview:", error);
              setImageError(error.code === 'storage/object-not-found'
                ? `Current image not found at path: ${member.imageUrl}. You may need to re-upload.`
                : "Could not load current image preview.");
            });
        }
      } else { // It's a full URL (e.g. placeholder or external)
        setCurrentImageUrlForPreview(member.imageUrl);
        if (!selectedFile) {
            setImagePreviewUrl(member.imageUrl);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member]); // `reset` is stable, so only `member` is the key dependency


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file)); // Show preview of selected file
      setImageError(null);
      setValue('imageUrl', ''); // Clear the imageUrl path field as a new file is staged
    } else { // File input was cleared by the user
      setSelectedFile(null);
      setImagePreviewUrl(currentImageUrlForPreview); // Revert to original image preview (if any)
      setValue('imageUrl', member?.imageUrl || ''); // Revert form value to original image path
    }
  };

  const handleFormSubmitInternal = async (data: TeamMemberFormValues) => {
    setImageError(null);
    let finalImageUrl = data.imageUrl; // Start with current form value for imageUrl

    if (selectedFile && storage) { // A new file has been selected for upload
      setIsUploadingImage(true);
      setUploadProgress(0);

      const uniqueFileName = `${member?.id || 'new'}_${Date.now()}_${selectedFile.name.replace(/\s+/g, '_')}`;
      const imagePath = `team-images/${uniqueFileName}`;
      const fileRef = storageRef(storage, imagePath);
      const uploadTask = uploadBytesResumable(fileRef, selectedFile);

      try {
        await new Promise<void>((resolveUpload, rejectUpload) => {
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
              rejectUpload(error); // Reject promise to stop form submission
            },
            async () => { // Upload completed successfully
              const newUploadedPath = uploadTask.snapshot.ref.fullPath;
              finalImageUrl = newUploadedPath; // This will be the new imageUrl

              // Attempt to delete old image if it exists and is different from new one
              if (member?.imageUrl && member.imageUrl !== newUploadedPath && !member.imageUrl.startsWith('https://') && !member.imageUrl.startsWith('http://')  && !member.imageUrl.startsWith('/')) {
                try {
                  await deleteObject(storageRef(storage, member.imageUrl));
                  console.log("Old image deleted:", member.imageUrl);
                } catch (deleteError) {
                  console.warn("Failed to delete old image (it might not exist or protected):", member.imageUrl, deleteError);
                }
              }
              setIsUploadingImage(false);
              setUploadProgress(null);
              resolveUpload(); // Resolve promise to continue form submission
            }
          );
        });
      } catch (uploadError) {
        // Error already handled and state updated by uploadTask.on error callback
        setIsUploadingImage(false); // Ensure state is consistent
        return; // Stop form submission if upload failed
      }
    } else if (!selectedFile && member?.imageUrl && data.imageUrl === "") {
        // No new file selected, but existing imageUrl path was manually cleared from the form
        // This indicates user wants to remove the current image without uploading a new one.
        if (!member.imageUrl.startsWith('https://') && !member.imageUrl.startsWith('http://') && !member.imageUrl.startsWith('/') && storage) {
             try {
                await deleteObject(storageRef(storage, member.imageUrl));
                console.log("Image removed by clearing path:", member.imageUrl);
             } catch (deleteError) {
                console.warn("Failed to delete image when path was cleared:", member.imageUrl, deleteError);
             }
        }
        finalImageUrl = ""; // Set imageUrl to empty if it was cleared
    }
    // If no new file was selected, and imageUrl field was not cleared, finalImageUrl remains data.imageUrl (original path)

    const dataToSubmit = { ...data, imageUrl: finalImageUrl || "" }; // Ensure imageUrl is always a string
    await onSubmitAction(dataToSubmit);
  };

  const isOverallSubmitting = isFormSubmitting || isUploadingImage;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmitInternal)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Team member's full name" {...field} value={field.value || ''} disabled={isOverallSubmitting} />
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
                <Input placeholder="e.g., President, Volunteer Coordinator" {...field} value={field.value || ''} disabled={isOverallSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Member Image</FormLabel>
          <FormControl>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 flex-shrink-0">
                {imagePreviewUrl ? (
                  <NextImage
                    src={imagePreviewUrl}
                    alt="Image Preview"
                    width={80}
                    height={80}
                    className="rounded-md object-cover border w-full h-full"
                    unoptimized={imagePreviewUrl.startsWith('blob:') || imagePreviewUrl.includes('placehold.co')}
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-md flex items-center justify-center border">
                    <ImageIcon size={32} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <Input
                id="file-upload"
                type="file"
                accept="image/*,.png,.jpg,.jpeg,.gif,.webp"
                onChange={handleFileChange}
                className="flex-1"
                disabled={isOverallSubmitting}
              />
            </div>
          </FormControl>
          <FormDescription>
            Upload an image (PNG, JPG, WEBP, GIF). Replaces existing image. Max 2MB.
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
                <Input
                  placeholder="e.g., team-images/member.png (auto-filled on upload)"
                  {...field}
                  value={field.value || ''} 
                  disabled={isOverallSubmitting || isUploadingImage || !!selectedFile}
                  aria-readonly={!!selectedFile || isUploadingImage}
                />
              </FormControl>
              <FormDescription>
                Path to image in Firebase Storage. Auto-updated on new upload. Clear to remove image (if no new file selected).
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
                <Input placeholder="e.g., 'person smiling'" {...field} value={field.value || ''} disabled={isOverallSubmitting} />
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
                <Textarea placeholder="Short introduction or biography for the team member." {...field} value={field.value || ''} rows={3} disabled={isOverallSubmitting} />
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
                <Input placeholder="e.g., Environmental Scientist, Community Lead" {...field} value={field.value || ''} disabled={isOverallSubmitting} />
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
                  <Input
                    type="number"
                    placeholder="e.g., 1, 2, 3 (lower # appear first)"
                    name={field.name}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    value={field.value === undefined || field.value === null ? '' : String(field.value)}
                    onChange={e => {
                         const currentVal = e.target.value;
                         if (currentVal === "") {
                             field.onChange(undefined);
                         } else {
                             const num = parseInt(currentVal, 10);
                             field.onChange(isNaN(num) ? undefined : num);
                         }
                    }}
                    disabled={isOverallSubmitting} />
              </FormControl>
              <FormDescription>Controls the order on the About Us page. Leave blank if not needed.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Social Links</FormLabel>
          <FormDescription className="mb-2">Add social media or contact links.</FormDescription>
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-end gap-2 mt-2 p-3 border rounded-md bg-muted/20">
              <FormField
                control={form.control}
                name={`socials.${index}.platform`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs font-medium sr-only">Platform for link {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder="Platform (e.g., LinkedIn)" {...field} value={field.value || ''} disabled={isOverallSubmitting} />
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
                    <FormLabel className="text-xs font-medium sr-only">URL for link {index + 1}</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="Link URL (https://...)" {...field} value={field.value || ''} disabled={isOverallSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={isOverallSubmitting} className="text-destructive hover:bg-destructive/10">
                <Trash2 size={16} />
                <span className="sr-only">Remove social link {index + 1}</span>
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => append({ platform: "", url: "" })}
            disabled={isOverallSubmitting}
          >
            <PlusCircle size={16} className="mr-2" /> Add Social Link
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-6 border-t mt-6">
            <Button type="button" variant="outline" onClick={onFormClose} disabled={isOverallSubmitting}>
                Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isOverallSubmitting}>
            {isOverallSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploadingImage ? "Uploading..." : (member ? "Updating..." : "Adding...")}
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
     