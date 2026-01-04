"use client";

import { HTMLInputTypeAttribute } from "react";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Controller, useFormContext } from "react-hook-form";

type FormFieldProps = {
  type?: HTMLInputTypeAttribute;
  name: string;
  label?: string;
  placeholder?: string;
};

function FormField({
  type = "text",
  name,
  label,
  placeholder,
}: FormFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <Input
            type={type}
            {...field}
            id={name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            autoComplete="off"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
export default FormField;
