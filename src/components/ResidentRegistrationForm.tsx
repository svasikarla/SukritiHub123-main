import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Define the interface for the apartment data
interface Apartment {
  id: string;
  block: string;
  flat_number: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(1, {
    message: "Phone number is required.",
  }),
  apartment_id: z.string().min(1, {
    message: "Apartment selection is required.",
  }),
  status: z.enum(["Active", "Inactive"], {
    required_error: "Please select a status.",
  }),
  type: z.enum(["owner", "tenant"], {
    required_error: "Please select a resident type.",
  }),
  whatsappNumber: z.string().optional(),
});

export function ResidentRegistrationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoadingApartments, setIsLoadingApartments] = useState(true);
  
  // Fetch apartments for the dropdown
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const { data, error } = await supabase
          .from('apartments')
          .select('id, block, flat_number')
          .order('block')
          .order('flat_number');
        
        if (error) {
          throw error;
        }
        
        setApartments(data || []);
      } catch (error) {
        console.error('Error fetching apartments:', error);
        toast({
          variant: "destructive",
          title: "Failed to load apartments",
          description: "Could not fetch apartment list. Please try again.",
        });
      } finally {
        setIsLoadingApartments(false);
      }
    };
    
    fetchApartments();
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      apartment_id: "",
      status: "Active",
      type: "owner",
      whatsappNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Insert into the residents table
      const { data, error } = await supabase
        .from('residents')
        .insert({
          name: values.name,
          email: values.email,
          phone: values.phone,
          apartment_id: values.apartment_id,
          status: values.status
          // Note: type is not in our schema yet, but we could store it in the future
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Resident registered successfully",
        description: `${values.name} has been added to the system.`,
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error registering resident:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "There was a problem registering the resident. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="apartment_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apartment</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an apartment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingApartments ? (
                      <SelectItem value="loading" disabled>Loading apartments...</SelectItem>
                    ) : apartments.length > 0 ? (
                      apartments.map(apartment => (
                        <SelectItem key={apartment.id} value={apartment.id}>
                          {apartment.block}-{apartment.flat_number}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No apartments available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resident Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resident type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="tenant">Tenant</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
                <FormDescription>
                  This will be used for categorization (not stored in database yet).
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="whatsappNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter WhatsApp number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isSubmitting || isLoadingApartments}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                Register Resident
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
