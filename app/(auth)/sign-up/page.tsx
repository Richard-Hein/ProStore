import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

type SignUpPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
  }>;
};

const SignUpPage = async ({ searchParams }: SignUpPageProps) => {
  const { callbackUrl } = await searchParams;

  // normalize callbackUrl (string | string[] -> string | undefined)
  const callbackUrlValue = Array.isArray(callbackUrl)
    ? callbackUrl[0]
    : callbackUrl;

  const session = await auth();

  // redirect if already signed in
  if (session) {
    redirect(callbackUrlValue || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link className="flex-center" href="/">
            <Image
              src="/images/logo.svg"
              width={100}
              height={100}
              alt={`${APP_NAME} Logo`}
              priority
            />
          </Link>

          <CardTitle className="text-center">Create Account</CardTitle>

          <CardDescription className="text-center">
            Enter your information below to sign up
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;