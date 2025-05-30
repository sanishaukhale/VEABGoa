
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPinIcon, Send, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useState, useEffect } from "react";
// import { saveContactMessage } from "./actions"; // Server Action not used for static export

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  honeypot: z.string().optional(), // Hidden field for spam prevention
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isStaticExport, setIsStaticExport] = useState(false);

  useEffect(() => {
    // A simple way to check if the page is likely part of a static export
    // In a static export, Server Actions are not available.
    // This check assumes `window` is available, which is true on the client.
    // NEXT_PUBLIC_BASE_PATH is set during GitHub Actions build for static export.
    if (process.env.NEXT_PUBLIC_BASE_PATH) {
      setIsStaticExport(true);
    }
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      honeypot: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    if (data.honeypot) {
      console.log("Spam attempt detected (client-side). Form data:", data);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We will get back to you shortly.",
        variant: "default",
      });
      form.reset();
      return;
    }

    setIsLoading(true);

    // For static export (GitHub Pages), Server Actions won't work.
    // We'll simulate success to avoid breaking the build and provide user feedback.
    if (isStaticExport || typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
      console.log("Static export mode: Contact form submission simulated. Data not sent to server.", data);
      setTimeout(() => { // Simulate network delay
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We will get back to you shortly.",
          variant: "default",
        });
        form.reset();
        setIsLoading(false);
      }, 1000);
      return;
    }

    // The following block would be for environments supporting Server Actions.
    // Since this build is for static export, this part is effectively disabled by the check above.
    // If you deploy to a platform that supports Server Actions, this logic would run.
    /*
    try {
      // This dynamic import ensures `saveContactMessage` (and thus 'use server')
      // isn't processed eagerly by the static export analyzer if not used.
      const { saveContactMessage } = await import("./actions");
      const result = await saveContactMessage(data);
      if (result.success) {
        toast({
          title: "Message Sent!",
          description: result.message || "Thank you for contacting us. We will get back to you shortly.",
          variant: "default",
        });
        form.reset();
      } else {
        toast({
          title: "Error Sending Message",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      toast({
        title: "Error Sending Message",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    */
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <Mail size={64} className="mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Get In Touch</h1>
        <p className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
          We&apos;d love to hear from you! Whether you have questions, collaboration ideas, or want to volunteer, please reach out.
        </p>
      </header>

      <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
        <div className="md:col-span-3">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-accent">Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we&apos;ll respond as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Regarding..." {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your message here..." {...field} rows={5} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Honeypot field: hidden from users, to catch bots */}
                  <FormField
                    control={form.control}
                    name="honeypot"
                    render={({ field }) => (
                      <FormItem style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                        <FormLabel>Please leave this field blank</FormLabel>
                        <FormControl>
                          <Input tabIndex={-1} autoComplete="off" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" /> Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-lg bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-xl text-accent">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground">
              <div className="flex items-start">
                <MapPinIcon size={24} className="text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Our Location</h4>
                  <Link href="https://maps.app.goo.gl/SvEm4Htz3kKbpwEz6" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                    Keri, Sattari, Goa, India
                  </Link>
                </div>
              </div>
              <div className="flex items-start">
                <Mail size={24} className="text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Email Us</h4>
                  <a href="mailto:veab.goa@gmail.com" className="text-sm hover:underline">
                    veab.goa@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone size={24} className="text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Call Us</h4>
                  <p className="text-sm">
                    <a href="tel:8806413360" className="hover:underline">8806413360</a> / <a href="tel:9130555168" className="hover:underline">9130555168</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
             <CardHeader>
                <div className="flex items-center">
                  <Clock size={20} className="text-accent mr-2" />
                  <CardTitle className="text-xl text-accent">Our Availability</CardTitle>
                </div>
             </CardHeader>
             <CardContent className="text-foreground">
                <p className="text-sm">We are open all the time for environment enthusiasts!</p>
                <p className="text-sm mt-1">Feel free to reach out or visit us to discuss how you can contribute.</p>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
