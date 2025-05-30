
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
import { Mail, Phone, MapPinIcon, Send, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    // In a real app, you would send this data to a backend or email service.
    console.log("Contact Form Data:", data);
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We will get back to you shortly.",
      variant: "default",
    });
    form.reset();
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
                          <Input placeholder="Your Name" {...field} />
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
                          <Input type="email" placeholder="your.email@example.com" {...field} />
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
                          <Input placeholder="Regarding..." {...field} />
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
                          <Textarea placeholder="Your message here..." {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
                    <Send className="mr-2 h-5 w-5" /> Send Message
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
