
import { z } from 'zod';

export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform name cannot be empty"),
  url: z.string().url("Social URL must be a valid URL (e.g., https://... or mailto:...)")
});

export const teamMemberFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
  imageUrl: z.string().min(5, { message: "Image URL (path in Storage) is required. E.g., team-images/your-image.png" }),
  dataAiHint: z.string().optional().default(''),
  intro: z.string().min(10, { message: "Introduction must be at least 10 characters." }),
  profession: z.string().min(3, { message: "Profession must be at least 3 characters." }),
  socials: z.array(socialLinkSchema).optional().default([]),
  displayOrder: z.coerce.number().optional(),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;
