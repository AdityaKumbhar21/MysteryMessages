"use client"

import { ApiResponse } from '@/types/ApiResponse'
import { MessageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send } from 'lucide-react'
import Link from 'next/link'

const SendMessage = () => {
    const { username } = useParams<{ username: string }>()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof MessageSchema>>({
        resolver: zodResolver(MessageSchema),
        defaultValues: {
            content: ''
        }
    })

    const handleSendMessage = async (data: z.infer<typeof MessageSchema>) => {
        setIsLoading(true)
        try {
            const response = await axios.post<ApiResponse>("/api/send-message", {
                username: username,
                content: data.content
            })

            if (response.data.success) {
                toast.success("Message sent successfully")
                form.reset()
            } else {
                toast.error("Error in sending message")
            }

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data?.message || "Failed to send message")
        }
        finally {
            setIsLoading(false)
        }
    }

    const suggestedMessages = [
        "What's your favorite movie of all time?",
        "Do you have any hidden talents?",
        "What's the best advice you've ever received?",
        "If you could have dinner with anyone, who would it be?",
        "What's your biggest dream or aspiration?"
    ]

    const handleSuggestedMessage = (content: string) => {
        form.setValue('content', content)
    }

    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Public Profile Link
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSendMessage)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Send Anonymous Message to @{username}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write your anonymous message here..."
                                                className="resize-none"
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    {form.watch('content')?.length || 0}/300 characters
                                </span>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Suggested Messages</h3>
                <div className="grid gap-2">
                    {suggestedMessages.map((message, index) => (
                        <Card
                            key={index}
                            className="cursor-pointer transition-colors hover:bg-muted/50"
                            onClick={() => handleSuggestedMessage(message)}
                        >
                            <CardContent className="p-4">
                                <p className="text-sm">{message}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                    Want to create your own Mystery Message board?{' '}
                    <Link href="/sign-up" className="text-blue-600 hover:underline">
                        Sign up now
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SendMessage