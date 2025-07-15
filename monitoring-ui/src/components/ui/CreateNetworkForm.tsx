"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { createNetwork } from "@/lib/networkEndpoints";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Network name must be at least 2 characters.",
  }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const CreateNetworkForm = ({ onCreated }: { onCreated: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: "" },
  });

  async function onSubmit(data: FormSchemaType) {
    setLoading(true);
    setSubmitError(null);
    try {
      await createNetwork({ name: data.name });
      {
        /* TODO: Add sonner toast success message */
      }
      form.reset();
      onCreated();
    } catch (err: any) {
      {
        /* TODO: Add sonner toast fail message */
      }
      setSubmitError(err?.message || "Failed to create network");
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 bg-card p-6 rounded-xl shadow"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Home Network" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitError && (
          <div className="text-destructive text-sm">{submitError}</div>
        )}
        {/* TODO: Add loading button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Network"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateNetworkForm;
