"use client";

import FormField from "@/components/form/FormField";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginInput, loginSchema } from "../validation";
import FormContainer from "@/components/form/FormContainer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useLogin } from "../hooks/useLogin";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

function FormLogin() {
  const { login, error } = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@test.com",
      password: "secretpassword",
    },
  });

  const handleSubmit = async (data: LoginInput) => {
    await login(data);
  };

  return (
    <FormContainer form={form} onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
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
            <FormField
              type="email"
              name="email"
              label="Email"
              placeholder="e.g. name@example.com"
            />
            <FormField name="password" label="Password" placeholder="*****" />
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
                "Login"
              )}
            </Button>
            <FieldSeparator />
            <FieldDescription className="text-center">
              Don't have an account? <Link href="/register">Sign Up</Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      </Card>
    </FormContainer>
  );
}
export default FormLogin;
