"use client";
import React, { useState } from 'react';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import Link from 'next/link';
import { createAccount, signInUser } from '@/lib/actions/user.action';
import OTPModel from './OTPModel';

type FormType = "signIn" | "signUp";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName: formType === "signUp" ? z.string().min(4).max(50) : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountId, setaccountId] = useState('');

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const user =
        type === 'signUp'
          ? await createAccount({ fullName: values.fullName || '', email: values.email })
          : await signInUser({ email: values.email });

      setaccountId(user.accountId);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(`Failed to create Account. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form bg-white">
          <h1 className="font-bold md:text-left lg:text-[3vw] text-[3vh]">
            {type === "signIn" ? "Sign In" : "Sign Up"}
          </h1>

          {type === "signUp" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FullName</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your mail" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {type === "signUp" ? "Sign Up" : "Sign In"}
            {loading && <div className="loader"></div>}
          </Button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="flex gap-3">
            <p>
              <b>
                {type === "signUp" ? "Already have an account?" : "Don't have an account?"}
              </b>
            </p>
            <Link href={type === "signIn" ? "/signUp" : "/signIn"}>
              {type === "signIn" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>

      {accountId && <OTPModel email={form.getValues('email')} accountId={accountId} />}
    </>
  );
};

export default AuthForm;
