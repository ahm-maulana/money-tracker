"use client";

import FormContainer from "@/components/form/FormContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { RegisterInput, registerSchema } from "../validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import FormField from "@/components/form/FormField";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useRegister } from "../hooks/useRegister";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

function FormRegister() {
  const { register, error } = useRegister();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "admin@test.com",
      name: "admin",
      password: "secretpassword",
      confirmPassword: "secretpassword",
    },
  });

  const handleSubmit = async (data: RegisterInput) => {
    await register(data);
  };

  return (
    <FormContainer form={form} onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Start tracking your income and expanses today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}
          </div>
          <FieldSet>
            <FormField name="name" label="Name" placeholder="e.g. John Doe" />
            <FormField
              type="email"
              name="email"
              label="Email"
              placeholder="e.g. name@example.com"
            />
            <FormField
              type="password"
              name="password"
              label="Password"
              placeholder="*****"
            />
            <FormField
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="*****"
            />
          </FieldSet>
        </CardContent>
        <CardFooter>
          <Field>
            <Button type="submit" className="bg-primary cursor-pointer">
              {form.formState.isSubmitting ? (
                <>
                  <Spinner />
                  <span>Please wait...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <FieldSeparator />
            <FieldDescription className="text-center">
              Already have an account? <Link href="/login">Login</Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      </Card>
    </FormContainer>
  );
}
export default FormRegister;
