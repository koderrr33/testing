import { redirect } from "next/navigation";
import { auth } from "@/lib/next-auth";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";

export default async function CustomerLoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Sign In</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in with your Google account
          </p>
        </div>
        <GoogleSignInButton />
      </div>
    </div>
  );
}