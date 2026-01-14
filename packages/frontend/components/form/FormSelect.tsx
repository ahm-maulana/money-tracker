import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldLabel } from "../ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";

type FormSelectProps = {
  name: string;
  list: string[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

function FormSelect({
  name,
  list,
  label,
  placeholder,
  disabled = false,
}: FormSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <Select
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger aria-invalid={fieldState.invalid}>
              <SelectValue placeholder={placeholder || "Select"} />
            </SelectTrigger>
            <SelectContent>
              {list.map((item) => (
                <SelectItem value={item} key={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}
export default FormSelect;
