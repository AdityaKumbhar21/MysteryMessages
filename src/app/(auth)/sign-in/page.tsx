"use client"

import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInSchema } from '@/schemas/signInSchema'
import * as z from "zod"
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'


const SignIn = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })


    const onSubmit = async (data: z.infer<typeof SignInSchema>) =>{
        const result = await signIn("credentials",{
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
                toast.error('Incorrect username or password');
            } 
            else {
                toast.error(result.error);
            }
        }

        if (result?.url) {
        router.replace('/dashboard');
        }
    }
 return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-card rounded-lg shadow-xl border border-purple-100 dark:border-purple-800">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h1>
          <p className="mb-4 text-gray-600 dark:text-gray-300">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' type="submit">Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-gray-300">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn