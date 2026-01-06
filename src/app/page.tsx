"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [venmoUsername, setVenmoUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp({ email, password, firstName, lastName, venmoUsername });
      }
      router.push("/home");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sb-black flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-sb-orange mb-2">SideBet</h1>
        <p className="text-sb-muted">Every Party Needs Stakes</p>
      </div>

      {/* Auth Form */}
      <div className="w-full max-w-sm">
        {/* Mode Toggle */}
        <div className="flex mb-6 bg-sb-card rounded-lg p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
              mode === "login"
                ? "bg-sb-orange text-white"
                : "text-sb-muted hover:text-white"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
              mode === "signup"
                ? "bg-sb-orange text-white"
                : "text-sb-muted hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-sb-red/10 border border-sb-red/30 rounded-lg">
            <p className="text-sb-red text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Signup Fields */}
          {mode === "signup" && (
            <>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-sb-muted mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-sb-card border border-sb-border rounded-lg text-white placeholder:text-sb-muted focus:outline-none focus:border-sb-orange transition-colors"
                    placeholder="Phil"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-sb-muted mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-sb-card border border-sb-border rounded-lg text-white placeholder:text-sb-muted focus:outline-none focus:border-sb-orange transition-colors"
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-sb-muted mb-1">
                  Venmo Username <span className="text-sb-muted">(optional)</span>
                </label>
                <input
                  type="text"
                  value={venmoUsername}
                  onChange={(e) => setVenmoUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-sb-card border border-sb-border rounded-lg text-white placeholder:text-sb-muted focus:outline-none focus:border-sb-orange transition-colors"
                  placeholder="@username"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm text-sb-muted mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-sb-card border border-sb-border rounded-lg text-white placeholder:text-sb-muted focus:outline-none focus:border-sb-orange transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-sb-muted mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-sb-card border border-sb-border rounded-lg text-white placeholder:text-sb-muted focus:outline-none focus:border-sb-orange transition-colors pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sb-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sb-orange text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
