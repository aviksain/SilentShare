"use client";

import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/user.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/Schema/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import { MsgCard } from "@/components/MsgCard";
import { Navbar } from "@/components/Navbar";

function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const [profileUrl, setProfileUrl] = useState('');

  const { toast } = useToast();

  const handelDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessage = watch("acceptMessage");

  // fetching the status that user accepting the messages or not
  const fetchAcceptMessagesStatus = useCallback(async () => {
    setIsSwitching(true);

    try {
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessage", response.data.isAcceptingMessages);
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitching(false);
    }
  }, [setValue, toast]);

  // to fetch all the messages of the user
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitching(true);

      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);

        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (err) {
        const axiosError = err as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitching(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchAcceptMessagesStatus();
    fetchMessages();
  }, [setValue, session, fetchAcceptMessagesStatus, fetchMessages]);

  const changeAcceptMessageStatus = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptingMessages: !acceptMessage,
      });
      setValue("acceptMessage", !acceptMessage);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  const username = session?.user.username as User;

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        setProfileUrl(`${baseUrl}/u/${username}`);
      }
    }, [username]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <>
      <Navbar />
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className="mb-4">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessage}
            onCheckedChange={changeAcceptMessageStatus}
            disabled={isSwitching}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessage ? "On" : "Off"}
          </span>
        </div>
        <Separator />

        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
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
            messages.map((message) => (
              <MsgCard
                key={message._id}
                message={message}
                onMessageDelete={handelDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Page;
