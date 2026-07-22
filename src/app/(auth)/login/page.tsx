import { redirect } from "next/navigation";
import { auth } from "@/lib/next-auth";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";

function validateCallbackUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  // Only allow relative paths to prevent open redirect attacks.
  // Reject absolute URLs (https://evil.com) and protocol-relative URLs (//evil.com).
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  return undefined;
}

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function CustomerLoginPage({ searchParams }: Props) {
  const session = await auth();
  const { callbackUrl: raw } = await searchParams;
  const callbackUrl = validateCallbackUrl(raw);

  if (session?.user) {
    redirect(callbackUrl || "/");
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
        <GoogleSignInButton callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
