import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CredentialsSignInForm from "./credentials-sign-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
};

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
  }>;
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const { callbackUrl } = await searchParams;

  // handle string | string[]
  const callbackUrlValue = Array.isArray(callbackUrl)
    ? callbackUrl[0]
    : callbackUrl;

  const session = await auth();

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

          <CardTitle className="text-center">Sign In</CardTitle>

          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;