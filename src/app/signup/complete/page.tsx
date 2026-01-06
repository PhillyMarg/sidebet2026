"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { ArrowRight } from "lucide-react";

export default function CompleteProfilePage() {
  const [fullName, setFullName] = useState("");
  const [venmoUsername, setVenmoUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { updateUserProfile } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate full name
    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length < 2) {
      setError("Please enter your full name (first and last)");
      return;
    }

    setLoading(true);

    try {
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      await updateUserProfile({
        firstName,
        lastName,
        venmoUsername: venmoUsername.trim() || undefined,
      });

      router.push("/home");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipVenmo = async () => {
    // Validate full name
    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length < 2) {
      setError("Please enter your full name (first and last)");
      return;
    }

    setLoading(true);

    try {
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      await updateUserProfile({
        firstName,
        lastName,
      });

      router.push("/home");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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

      {/* Complete Profile Form */}
      <div className="flex-1">
        <h2 className="text-white text-xl font-semibold mb-2">Complete Your Profile</h2>
        <p className="text-[#757579] text-sm mb-6">
          Just a few more details to get you started
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-[6px]">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Full Name <span className="text-[#FF6B35]">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="John Smith"
              className="w-full px-4 py-3 bg-[rgba(24,24,27,0.4)] rounded-[6px] text-white placeholder:text-[#757579] focus:outline-none focus:shadow-[2px_2px_4px_0px_#ff6b35] transition-shadow"
            />
          </div>

          {/* Venmo Username Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Venmo Username{" "}
              <span className="text-[#757579] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={venmoUsername}
              onChange={(e) => setVenmoUsername(e.target.value)}
              placeholder="@username"
              className="w-full px-4 py-3 bg-[rgba(24,24,27,0.4)] rounded-[6px] text-white placeholder:text-[#757579] focus:outline-none focus:shadow-[2px_2px_4px_0px_#ff6b35] transition-shadow"
            />
            <p className="text-[#757579] text-xs mt-2">
              Add your Venmo to make settling bets easier
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !fullName.trim()}
            className="w-full py-3 bg-[#FF6B35] text-white font-semibold rounded-[6px] hover:bg-[#e55f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {loading ? "Saving..." : "Continue"}
            {!loading && <ArrowRight size={18} />}
          </button>

          {/* Skip Venmo Link */}
          {!venmoUsername && (
            <button
              type="button"
              onClick={handleSkipVenmo}
              disabled={loading || !fullName.trim()}
              className="w-full py-3 text-[#757579] font-medium hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip for now
            </button>
          )}
        </form>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        <div className="w-2 h-2 rounded-full bg-[#FF6B35]"></div>
        <div className="w-2 h-2 rounded-full bg-[#FF6B35]"></div>
        <div className="w-2 h-2 rounded-full bg-[#757579]"></div>
      </div>
    </div>
  );
}
