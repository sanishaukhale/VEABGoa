
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, DollarSign, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const donationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  amount: z.coerce.number().min(1, { message: "Donation amount must be at least $1." }),
  customAmount: z.string().optional(), // For the input field
});

type DonationFormValues = z.infer<typeof donationSchema>;

const donationTiers = [
  { amount: 10, label: "$10 - Support Seedlings", description: "Help us plant native tree seedlings." },
  { amount: 25, label: "$25 - Fund a Workshop", description: "Contribute to an environmental awareness workshop." },
  { amount: 50, label: "$50 - Aid Cleanup Drive", description: "Support equipment for a beach or river cleanup." },
  { amount: 100, label: "$100 - Boost Research", description: "Fund critical environmental research projects." },
];

export default function DonatePage() {
  const { toast } = useToast();
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: 25, // Default selected tier
    },
  });

  function onSubmit(data: DonationFormValues) {
    // In a real app, integrate with a payment gateway here.
    // For this scaffold, we'll just show a success message.
    console.log("Donation Data:", data);
    toast({
      title: "Thank You for Your Donation!",
      description: `Your generous contribution of $${data.amount} is greatly appreciated.`,
      variant: "default", 
    });
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <Heart size={64} className="mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Support Our Cause</h1>
        <p className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
          Your contribution helps us protect Goa&apos;s precious environment. Every donation, big or small, makes a difference.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-accent">Make a Donation</CardTitle>
            <CardDescription>Choose an amount or enter a custom sum.</CardDescription>
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Select Amount</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value.toString()}
                          className="grid grid-cols-2 gap-4"
                        >
                          {donationTiers.map((tier) => (
                            <FormItem key={tier.amount} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={tier.amount.toString()} />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {tier.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>Or enter a custom amount below.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Amount ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 75" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value) {
                              form.setValue("amount", parseInt(e.target.value) || 0, { shouldValidate: true });
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
                  <DollarSign className="mr-2 h-5 w-5" /> Donate Now
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  This is a demo form. No actual payment will be processed.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-accent mb-4 text-center md:text-left">How Your Donation Helps</h2>
          {donationTiers.map((tier) => (
            <Card key={tier.amount} className="bg-secondary/30 border-secondary">
              <CardContent className="pt-6">
                <div className="flex items-center mb-2">
                  <Gift size={20} className="text-primary mr-2" />
                  <h3 className="text-lg font-semibold text-primary">{tier.label}</h3>
                </div>
                <p className="text-sm text-foreground">{tier.description}</p>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-background border-dashed border-accent">
             <CardContent className="pt-6 text-center">
                <h3 className="text-lg font-semibold text-accent mb-2">Every Bit Counts!</h3>
                <p className="text-sm text-foreground">Your generosity fuels our conservation work and helps us create a greener Goa for future generations. Thank you for your support!</p>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
