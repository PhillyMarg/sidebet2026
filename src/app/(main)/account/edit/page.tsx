"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProfileHeader, NotificationToggle } from "@/components/account";
import { sampleAccount } from "@/lib/data/sampleAccount";

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = sampleAccount;

  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    password: user.password,
  });
  const [pushNotifications, setPushNotifications] = useState(user.pushNotifications);

  const handleBack = () => {
    router.back();
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleNotifications = (enabled: boolean) => {
    setPushNotifications(enabled);
  };

  // Mask password for display
  const maskedPassword = "••••••••";

  return (
    <div className="px-4 py-4">
      {/* Header with Back Button */}
      <div className="flex items-center mb-4">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 text-white hover:text-sb-orange transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white ml-2">EDIT PROFILE</h1>
      </div>

      {/* Profile Header */}
      <ProfileHeader
        name={user.name}
        username={user.username}
        initials={user.initials}
        memberSince={user.memberSince}
      />

      {/* Form Fields */}
      <div className="space-y-4 mt-6">
        {/* Name */}
        <div>
          <label className="block text-sb-muted text-sm mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-4 py-3 bg-sb-card border border-sb-border rounded-lg text-white text-sm focus:border-sb-orange focus:outline-none transition-colors"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sb-muted text-sm mb-2">Username</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sb-muted">@</span>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-sb-card border border-sb-border rounded-lg text-white text-sm focus:border-sb-orange focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sb-muted text-sm mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-4 py-3 bg-sb-card border border-sb-border rounded-lg text-white text-sm focus:border-sb-orange focus:outline-none transition-colors"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sb-muted text-sm mb-2">Password</label>
          <input
            type="password"
            value={maskedPassword}
            readOnly
            className="w-full px-4 py-3 bg-sb-card border border-sb-border rounded-lg text-white text-sm cursor-not-allowed opacity-70"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-sb-border" />
        <span className="text-sb-muted text-sm">PREVIEW</span>
        <div className="flex-1 h-px bg-sb-border" />
      </div>

      {/* Settings */}
      <div className="bg-sb-card border border-sb-border rounded-lg px-4">
        <NotificationToggle
          enabled={pushNotifications}
          onToggle={handleToggleNotifications}
        />
      </div>
    </div>
  );
}
