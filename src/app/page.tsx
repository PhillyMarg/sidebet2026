"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/home");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Invalid email or password";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      router.push("/home");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in with Google";
      // Handle specific Firebase errors
      if (errorMessage.includes("popup-closed")) {
        setError("Sign in cancelled");
      } else if (errorMessage.includes("network")) {
        setError("Network error. Please check your connection.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = () => {
    alert("Apple sign-in coming soon!");
  };

  return (
    <div
      className="min-h-screen flex flex-col px-6 pt-16 pb-8"
      style={{
        background: "linear-gradient(204deg, rgb(24, 24, 27) 0%, rgb(30, 30, 30) 50%, rgb(215, 99, 45) 100%)"
      }}
    >
      {/* Logo Section */}
      <div className="text-center mb-10">
        <h1 className="text-[32px] font-bold text-white mb-1">SideBet</h1>
        <p className="text-[#757579] text-sm">Every Party Needs Stakes</p>
      </div>

      {/* Sign In Form */}
      <div className="flex-1">
        <h2 className="text-white text-xl font-semibold mb-6">Sign In</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-[6px]">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full px-4 py-3 bg-[rgba(24,24,27,0.4)] rounded-[6px] text-white placeholder:text-[#757579] focus:outline-none focus:shadow-[2px_2px_4px_0px_#ff6b35] transition-shadow"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full px-4 py-3 bg-[rgba(24,24,27,0.4)] rounded-[6px] text-white placeholder:text-[#757579] focus:outline-none focus:shadow-[2px_2px_4px_0px_#ff6b35] transition-shadow pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757579] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-[#FF6B35] text-sm hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FF6B35] text-white font-semibold rounded-[6px] hover:bg-[#e55f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-[#757579]/30"></div>
          <span className="px-4 text-[#757579] text-sm">Or continue with</span>
          <div className="flex-1 h-px bg-[#757579]/30"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full py-3 bg-white text-gray-800 font-medium rounded-[6px] hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Apple Button */}
          <button
            type="button"
            onClick={handleAppleSignIn}
            disabled={googleLoading || loading}
            className="w-full py-3 bg-[#18181B] text-white font-medium rounded-[6px] hover:bg-[#27272A] transition-colors flex items-center justify-center gap-3 border border-[#27272A] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continue with Apple
          </button>

          {/* Phone Button */}
          <Link
            href="/phone-auth"
            className="w-full py-3 bg-[#757579]/20 text-white font-medium rounded-[6px] hover:bg-[#757579]/30 transition-colors flex items-center justify-center gap-3 border border-[#757579]/30"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
            Continue with Phone
          </Link>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="text-center mt-8">
        <p className="text-[#757579]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#FF6B35] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
