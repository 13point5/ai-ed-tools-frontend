"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SignInFooter } from "@/components/AuthFormFooters";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";
import { FormStatus } from "@/app/types";

const formSchema = z.object({
  full_name: z.string(),
  email: z.string(),
  password: z.string(),
});

const SignUpForm = () => {
  const supabase = createClientComponentClient();

  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.Idle);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFormStatus(FormStatus.Loading);

    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
          },
          emailRedirectTo: `${location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      setFormStatus(FormStatus.Success);
      toast.success("Check your email for the confirmation link", {
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);
      setFormStatus(FormStatus.Error);
      toast.error("Could not Sign Up", {
        position: "bottom-center",
      });
    }
  };

  return (
    <main className="flex flex-col gap-6 items-center w-full h-screen pt-8 px-4">
      <h1 className="text-4xl font-bold">AI Ed Tools</h1>
      <Card className="max-w-sm w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={formStatus === FormStatus.Loading}
              >
                {formStatus === FormStatus.Loading && (
                  <>
                    <Loader2Icon className="animate-spin mr-2" /> Signing up
                  </>
                )}

                {formStatus !== FormStatus.Loading && "Sign Up"}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <SignInFooter />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
};

export default SignUpForm;
