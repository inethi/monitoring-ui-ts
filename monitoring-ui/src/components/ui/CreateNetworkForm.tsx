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
import ButtonLoading from "@/components/ui/ButtonLoading";

type ToastType = "success" | "error";

interface CreateNetworkFormProps {
  onCreated: () => void;
  onToast: (opts: { type: ToastType; message: string }) => void;
}

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Network name must be at least 2 characters.",
  }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const CreateNetworkForm = ({ onCreated, onToast }: CreateNetworkFormProps) => {
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
      onToast({
        type: "success",
        message: `Network '${data.name}' created successfully!`,
      });
      form.reset();
      onCreated();
    } catch (err: any) {
      const msg =
        err?.message ||
        "Failed to create network. Ensure you are providing a unique network name";
      setSubmitError(msg);
      onToast({
        type: "error",
        message: msg,
      });
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
        {/* {submitError && (
          <div className="text-destructive text-sm">{submitError}</div>
        )} */}
        {/* TODO: Add loading button */}
        {loading ? (
          <ButtonLoading className="w-full" />
        ) : (
          <Button type="submit" className="w-full" disabled={loading}>
            Create Network
          </Button>
        )}
      </form>
    </Form>
  );
};

export default CreateNetworkForm;
