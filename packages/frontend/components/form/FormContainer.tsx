import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

type FormContainerProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
};

function FormContainer<T extends FieldValues>({
  form,
  children,
  onSubmit,
}: FormContainerProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => console.log(error))}
      >
        {children}
      </form>
    </FormProvider>
  );
}
export default FormContainer;
