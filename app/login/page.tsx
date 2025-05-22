"use client";

import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import AuthNavbar from "@/components/auth/AuthNavbar";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthNavbar />
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full px-4 py-8">
        <div className="w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl text-[#212223] font-bold">
              Create an Account
            </h1>
            <p className="text-[#585858]">
              Gain visibility, increase foot traffic, and manage
              <br />
              your profile easily
            </p>
          </div>

          <LoginForm />

          <div className="flex items-center gap-4 my-6">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <SocialLoginButtons />

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have and account ?{" "}
              <Link
                href="/login"
                className="text-green-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
