"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";
import { z } from "zod";
import { messageSchema } from "@/Schema/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCompletion } from "ai/react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderPinwheel } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion:
      "What's your favorite movie?||Do you have any pets?||What's your dream job?",
  });

  const messageContent = form.watch("content");

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: username,
        ...data,
      });

      toast({
        title: "Response",
        description: response?.data.message || "Message sent successfully",
        variant: "default",
      });

      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestMessages = async () => {
    try {
      setIsLoading(true);
      complete("");
      toast({
        title: "Messages are fetched",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseStringMessages = (messageString: string): string[] => {
    return messageString.split("||");
  };

  const pasteMessage = async (message: string) => {
    form.setValue("content", message);
  };

  return (
    <>
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <h1 className="text-center mb-3 font-bold text-4xl text-black">
          Public Message Page
        </h1>

        {/* form field */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your message"
                      className="resize-none border-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading ? (
              <Button type="submit" disabled>
                Submit
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </form>
        </Form>

        {/* Suggested messages */}
        <Card className={cn("w-full mt-4")}>
          <CardHeader>
            {isSuggestLoading ? (
              <Button className="w-[380px]" disabled>
                <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button onClick={fetchSuggestMessages} className="w-[380px]">
                Suggest Messages
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {parseStringMessages(completion).map((message, index) => (
              <Button
                key={index}
                variant="outline"
                className="mb-2"
                onClick={() => pasteMessage(message)}
              >
                {message}
              </Button>
            ))}
          </CardContent>
        </Card>
        <Separator/>
        <div className="mt-5 flex justify-center items-center">
          <div>
            <h1>Get your own dashboard</h1>
            <Link href={'/signup'} >
              <Button className="mt-1">Create your own account</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
