
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
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import type { TeamMember } from "@/types";

interface TeamMemberFormProps {
  member?: TeamMember | null; // For editing, null for adding
  onSubmitAction: (data: TeamMemberFormValues) => Promise<{ success: boolean; error?: string; message?: string }>;
  onFormClose: () => void;
  isSubmitting: boolean;
}

export default function TeamMemberForm({ member, onSubmitAction, onFormClose, isSubmitting }: TeamMemberFormProps) {
  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: member?.name || "",
      role: member?.role || "",
      imageUrl: member?.imageUrl || "",
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

  const handleFormSubmit = async (data: TeamMemberFormValues) => {
    await onSubmitAction(data);
    // Success/error handling is done by the parent page via toast
    // Parent page will close form on success
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Team member's full name" {...field} disabled={isSubmitting} />
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
                <Input placeholder="e.g., President, Volunteer Coordinator" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Path in Storage</FormLabel>
              <FormControl>
                <Input placeholder="e.g., team-images/member-photo.png" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormDescription>
                Path to the image in Firebase Storage. You need to upload the image manually.
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
                <Input placeholder="e.g., 'person smiling'" {...field} disabled={isSubmitting} />
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
                <Textarea placeholder="Short introduction or biography for the team member." {...field} rows={3} disabled={isSubmitting} />
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
                <Input placeholder="e.g., Environmental Scientist, Community Lead" {...field} disabled={isSubmitting} />
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
                <Input type="number" placeholder="e.g., 1, 2, 3 (lower numbers appear first)" {...field} onChange={e => field.onChange(parseInt(e.target.value,10))} disabled={isSubmitting} />
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
                      <Input placeholder="e.g., LinkedIn, Mail, Twitter" {...field} disabled={isSubmitting} />
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
                      <Input type="url" placeholder="https://linkedin.com/in/..." {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={isSubmitting}>
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
            disabled={isSubmitting}
          >
            <PlusCircle size={16} className="mr-2" /> Add Social Link
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onFormClose} disabled={isSubmitting}>
                Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
            {isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
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
