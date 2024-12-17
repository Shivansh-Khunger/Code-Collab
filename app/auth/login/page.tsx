"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
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
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // Here you would typically make an API call to your authentication endpoint
      const response = await axios.get("http://localhost:4000/users/signin", {
        email: values.email,
        password: values.password,
      });

      // For demonstration, we'll just simulate a delay

      // Simulating a successful login
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully.",
      });
      router.push("/collab/createCollab"); // Redirect to dashboard or home page
    } catch (error) {
      console.log("Login failed:", error);
      toast({
        title: "Login Failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    router.push("/auth/signup"); // Redirect to dashboard or home page
  };

  const handleForgotPassword = () => {
    setIsDialogOpen(true);
  };

  const handleOTPSubmit = (otp: string) => {
    // Implement OTP verification logic here
    console.log("OTP submitted:", otp);
    // setIsDialogOpen(false)
    toast({
      title: "OTP Submitted",
      description: "Your OTP has been submitted successfully.",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center z-20">
      <div className="w-full max-w-md space-y-8 rounded-lg shadow-md p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold ">Login to your account</h2>
          <p className="mt-2 text-sm ">
            Enter your email and password to access your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
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
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button variant="link" onClick={handleForgotPassword}>
                Forgot Password?
              </Button>
            </div>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2">Don't have Account</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full"
        >
          {/* <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg> */}
          Sign Up With Your Email
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter OTP</DialogTitle>
              <DialogDescription>
                We've sent a one-time password to your email. Please enter it
                below.
              </DialogDescription>
            </DialogHeader>
            <OTPInput onComplete={handleOTPSubmit} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function OTPInput({ onComplete }: { onComplete: (otp: string) => void }) {
  const [otp, setOtp] = useState("");

  const handleComplete = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      onComplete(value);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <InputOTP maxLength={6} value={otp} onChange={handleComplete}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Button onClick={() => onComplete(otp)} disabled={otp.length !== 6}>
        Submit OTP
      </Button>
    </div>
  );
}
