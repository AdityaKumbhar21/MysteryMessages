"use client"

import React, { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm} from 'react-hook-form'
import * as z from 'zod'
import { SignUpSchema } from '@/schemas/signUpSchema'
import Link from 'next/link'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import { ApiResponse } from '@/types/ApiResponse'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {Loader2} from "lucide-react"



const page = () => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const[isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300)

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    const checkUsername = async () => {
          if(username){
            try {
            setIsCheckingUsername(true)
            setUsernameMessage("")
            const response = await axios.get(`/api/check-username-valid?username=${username}`)
            setUsernameMessage(response.data.message)
          } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username');
          }finally{
            setIsCheckingUsername(false)
          }
          }
      }
      checkUsername()
  }, [username])


  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
      setIsSubmitting(true)
      try {
          const response = await axios.post("/api/sign-up", data)
            toast.success(response.data.message)
            router.replace(`/verify/${username}`)
      } 
      catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast.error("Signup failed",{
              description: axiosError.response?.data.message ?? 'Error signing up'
          })
      }
      finally{
        setIsSubmitting(false)
      }
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-card rounded-lg shadow-xl border border-purple-100 dark:border-purple-800">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Join Mystery Messages
            </span>
          </h1>
          <p className="mb-4 text-gray-600 dark:text-gray-300">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username available'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className='text-gray-400 text-sm'>We will send you a verification code</p>
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
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-gray-300">
            Already a member?{' '}
            <Link href="/sign-in" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page