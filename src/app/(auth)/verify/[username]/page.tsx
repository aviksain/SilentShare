"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/Schema/verifySchema";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

function Page() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });
    

  const onSubmit = async(data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post('/api/verifycode', {
        username: params.username,
        code: data.code
      });
      
      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/signin');

    }
    catch(err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Controller
              name="code"
              control={form.control}
              render={({ field }) => (
                <div>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot className="border-slate-900" index={0} />
                      <InputOTPSlot className="border-slate-900" index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot className="border-slate-900" index={2} />
                      <InputOTPSlot className="border-slate-900" index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot className="border-slate-900" index={4} />
                      <InputOTPSlot className="border-slate-900" index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              )}
            />
            <Button type="submit">Verify Code</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
