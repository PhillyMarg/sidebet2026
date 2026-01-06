"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";

type PhoneAuthStep = "phone" | "code";

export default function PhoneAuthPage() {
  const [step, setStep] = useState<PhoneAuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<unknown>(null);

  const { sendPhoneVerification, verifyPhoneCode } = useAuth();
  const router = useRouter();
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Extract just the numbers
    const numbers = phoneNumber.replace(/\D/g, "");
    if (numbers.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      const result = await sendPhoneVerification(`+1${numbers}`);
      setConfirmationResult(result);
      setStep("code");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send verification code";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, "").slice(-1);

    const newCode = [...verificationCode];
    newCode[index] = digit;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (digit && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace - move to previous input
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...verificationCode];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setVerificationCode(newCode);
    // Focus last filled input or the next empty one
    const focusIndex = Math.min(pastedData.length, 5);
    codeInputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const code = verificationCode.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setLoading(true);

    try {
      await verifyPhoneCode(confirmationResult, code);
      router.push("/signup/complete");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Invalid verification code";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setVerificationCode(["", "", "", "", "", ""]);
    setStep("phone");
  };

  // Auto-focus first code input when entering code step
  useEffect(() => {
    if (step === "code") {
      codeInputRefs.current[0]?.focus();
    }
  }, [step]);

  // Code verification step
  if (step === "code") {
    return (
      <div
        className="min-h-screen flex flex-col px-6 pt-4 pb-8"
        style={{
          background: "linear-gradient(204deg, rgb(24, 24, 27) 0%, rgb(30, 30, 30) 50%, rgb(215, 99, 45) 100%)"
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => setStep("phone")}
          className="flex items-center text-white mb-8 hover:text-[#FF6B35] transition-colors w-fit"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Logo Section */}
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold text-white mb-1">SideBet</h1>
          <p className="text-[#757579] text-sm">Every Party Needs Stakes</p>
        </div>

        {/* Code Entry */}
        <div className="flex-1">
          <h2 className="text-white text-xl font-semibold mb-2">Enter Code</h2>
          <p className="text-[#757579] text-sm mb-6">
            We sent a verification code to {phoneNumber}
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-[6px]">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="space-y-6">
            {/* Code Inputs */}
            <div className="flex justify-between gap-2">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { codeInputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  onPaste={handleCodePaste}
                  className="w-12 h-14 text-center text-xl font-semibold bg-[rgba(24,24,27,0.4)] rounded-[6px] text-white focus:outline-none focus:shadow-[2px_2px_4px_0px_#ff6b35] transition-shadow"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || verificationCode.some(d => !d)}
              className="w-full py-3 bg-[#FF6B35] text-white font-semibold rounded-[6px] hover:bg-[#e55f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "Verify Code"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Resend Code */}
          <div className="text-center mt-6">
            <p className="text-[#757579] text-sm">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                className="text-[#FF6B35] font-semibold hover:underline"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Phone number entry step
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

      {/* Phone Auth Form */}
      <div className="flex-1">
        <h2 className="text-white text-xl font-semibold mb-2">Phone Sign In</h2>
        <p className="text-[#757579] text-sm mb-6">
          Enter your phone number and we&apos;ll send you a verification code.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-[6px]">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSendCode} className="space-y-4">
          {/* Phone Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[#757579]">
              <Phone size={20} />
              <span className="text-white">+1</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="(555) 555-5555"
              className="w-full pl-20 pr-4 py-3 bg-[rgba(24,24,27,0.4)] rounded-[6px] text-white placeholder:text-[#757579] focus:outline-none focus:shadow-[2px_2px_4px_0px_#ff6b35] transition-shadow"
            />
          </div>

          {/* reCAPTCHA container - Firebase needs this */}
          <div id="recaptcha-container"></div>

          {/* Send Code Button */}
          <button
            type="submit"
            disabled={loading || phoneNumber.replace(/\D/g, "").length !== 10}
            className="w-full py-3 bg-[#FF6B35] text-white font-semibold rounded-[6px] hover:bg-[#e55f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {loading ? "Sending..." : "Send Code"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Terms */}
        <p className="text-[#757579] text-xs text-center mt-6">
          By continuing, you agree to receive an SMS message. Message and data rates may apply.
        </p>
      </div>

      {/* Back to Sign In Link */}
      <div className="text-center mt-8">
        <p className="text-[#757579]">
          Want to use email?{" "}
          <Link href="/" className="text-[#FF6B35] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
