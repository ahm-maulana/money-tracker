"use client";

import FormContainer from "@/components/form/FormContainer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form/FormField";
import FormSelect from "@/components/form/FormSelect";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/utils/error.util";
import z, { ZodType } from "zod";

type CategoryFormDialogProps<TSchema extends ZodType<any, any, any>> = {
  trigger: React.ReactNode;
  schema: TSchema;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  onSubmit: (value: z.output<TSchema>) => void | Promise<void>;
  error: Error | null;
  readonlyFields?: (keyof z.infer<TSchema>)[];
  title?: string;
  submitText?: string;
};

function CategoryFormDialog<TSchema extends ZodType<any, any, any>>({
  trigger,
  schema,
  defaultValues,
  onSubmit,
  error,
  readonlyFields,
  title = "Add",
}: CategoryFormDialogProps<TSchema>) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.input<typeof schema>, any, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await onSubmit(data);
    } finally {
      form.reset();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="sm:max-w-106.25"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <FormContainer form={form} onSubmit={handleSubmit}>
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>{title} Category</DialogTitle>
            </DialogHeader>
            <DialogDescription></DialogDescription>
            <div className="mb-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>{getErrorMessage(error)}</AlertTitle>
                </Alert>
              )}
            </div>
            <FormField name="name" label="Category Name" />
            <FormField name="color" label="Color Icon" />
            <FormSelect
              name="type"
              list={["INCOME", "EXPENSE"]}
              label="Transaction Type"
              placeholder="Select transaction type"
              disabled={readonlyFields?.includes("type")}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-primary cursor-pointer">
                {form.formState.isSubmitting ? (
                  <>
                    <Spinner />
                    <span>Please wait...</span>
                  </>
                ) : (
                  `${title} Category`
                )}
              </Button>
            </DialogFooter>
          </div>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
}
export default CategoryFormDialog;
