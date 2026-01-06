"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { ArrowLeft, ArrowRight, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Confirmation state - email has been sent
  if (emailSent) {
    return (
      <div
        className="min-h-screen flex flex-col px-6 pt-4 pb-8"
        style={{
          background: "linear-gradient(204deg, rgb(24, 24, 27) 0%, rgb(30, 30, 30) 50%, rgb(215, 99, 45) 100%)"
        }}
      >
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center text-white mb-8 hover:text-[#FF6B35] transition-colors w-fit"
        >
          <ArrowLeft size={24} />
        </Link>

        {/* Logo Section */}
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold text-white mb-1">SideBet</h1>
          <p className="text-[#757579] text-sm">Every Party Needs Stakes</p>
        </div>

        {/* Confirmation Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-[#1BEC09]/20 flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-[#1BEC09]" />
          </div>

          <h2 className="text-white text-xl font-semibold mb-3">Check Your Email</h2>
          <p className="text-[#757579] text-sm mb-2">
            We&apos;ve sent a password reset link to
          </p>
          <p className="text-white font-medium mb-8">{email}</p>

          <p className="text-[#757579] text-sm mb-8">
            Click the link in the email to reset your password. If you don&apos;t see it, check your spam folder.
          </p>

          {/* Back to Sign In Button */}
          <Link
            href="/"
            className="w-full py-3 bg-[#FF6B35] text-white font-semibold rounded-[6px] hover:bg-[#e55f2f] transition-colors flex items-center justify-center gap-2"
          >
            Back to Sign In
            <ArrowRight size={18} />
          </Link>

          {/* Resend Link */}
          <button
            type="button"
            onClick={() => setEmailSent(false)}
            className="mt-4 text-[#757579] text-sm hover:text-white transition-colors"
          >
            Didn&apos;t receive it? Try again
          </button>
        </div>
      </div>
    );
  }

  // Initial state - email input form
  return (
    <div
      className="min-h-screen flex flex-col px-6 pt-4 pb-8"
      style={{
        background: "linear-gradient(204deg, rgb(24, 24, 27) 0%, rgb(30, 30, 30) 50%, rgb(215, 99, 45) 100%)"
      }}
    >
      {/* Back Button */}
      <Link
        href="/"
        className="flex items-center text-white mb-8 hover:text-[#FF6B35] transition-colors w-fit"
      >
        <ArrowLeft size={24} />
      </Link>

      {/* Logo Section */}
      <div className="text-center mb-10">
        <h1 className="text-[32px] font-bold text-white mb-1">SideBet</h1>
        <p className="text-[#757579] text-sm">Every Party Needs Stakes</p>
      </div>

      {/* Forgot Password Form */}
      <div className="flex-1">
        <h2 className="text-white text-xl font-semibold mb-2">Forgot Password?</h2>
        <p className="text-[#757579] text-sm mb-6">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-[6px]">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#757579]">
              <Mail size={20} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full pl-12 pr-4 py-3 bg-[rgba(24,24,27,0.4)] rounded-[6px] text-white placeholder:text-[#757579] focus:outline-none focus:shadow-[2px_2px_4px_0px_#ff6b35] transition-shadow"
            />
          </div>

          {/* Send Reset Link Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FF6B35] text-white font-semibold rounded-[6px] hover:bg-[#e55f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {loading ? "Sending..." : "Send Reset Link"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>

      {/* Back to Sign In Link */}
      <div className="text-center mt-8">
        <p className="text-[#757579]">
          Remember your password?{" "}
          <Link href="/" className="text-[#FF6B35] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
