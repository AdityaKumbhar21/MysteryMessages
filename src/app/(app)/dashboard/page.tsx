"use client"
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/models/messageModel'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message)=> message._id !== messageId))
  }

  const {data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  })

  const {register, watch, setValue} = form

  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessage = useCallback(async ()=>{
      setIsSwitchLoading(true)
      try {
        const result = await axios.get<ApiResponse>("/api/accept-messages")
        setValue("acceptMessages", result.data.isAcceptingMessages || false)

      } catch (error) {
         console.error("Error fetching message settings:", error)
          toast.error("Error fetching message settings")
      }
      finally{
        setIsSwitchLoading(false)
      }
  },[])


  const getMessages = useCallback(async (refresh: boolean = false)=>{
    setIsLoading(true)
    setIsSwitchLoading(false)

    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      console.log("API Response:", response.data)
      setMessages(response.data.messages || [])

      if(refresh){
        toast.success("Fetched all the latest messages")
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Error fetching messages:", error)
      toast.error("Failed fetching messages")
    }
    finally{
        setIsSwitchLoading(false)
        setIsLoading(false)
      }
  },[])

  useEffect(()=>{
    if(!session || !session.user) return 

    fetchAcceptMessage()
    getMessages()
  }, [session, fetchAcceptMessage, getMessages])


  const handleSwitch = async() =>{
    setIsSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages",{
        acceptMessage: !acceptMessages
      })

      setValue("acceptMessages", !acceptMessages)
      toast.success("Successfully updated the status")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message)
    }
    finally {
      setIsSwitchLoading(false)
    }
  }

  if(!session || !session.user){  
    return <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <p>Please sign in to access your dashboard.</p>
    </div>
  }

  const {username} = session?.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const prfUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = ()=>{
    window.navigator.clipboard.writeText(prfUrl)
    toast.success('Profile URL has been copied to clipboard.')
  }

  

 return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white dark:bg-card rounded-lg shadow-lg w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={prfUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitch}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          getMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id?.toString() || index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Page