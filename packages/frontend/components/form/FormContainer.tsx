import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

type FormContainerProps<
  TFieldValues extends FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues = TFieldValues
> = {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  children: React.ReactNode;
  onSubmit: SubmitHandler<TTransformedValues>;
};

function FormContainer<
  TFieldValues extends FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues = TFieldValues
>({
  form,
  children,
  onSubmit,
}: FormContainerProps<TFieldValues, TContext, TTransformedValues>) {
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
