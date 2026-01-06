"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  ProfileHeader,
  OverallRecordCard,
  StatsGrid,
  SettingsMenu,
  DeleteAccountModal,
} from "@/components/account";
import { sampleAccount } from "@/lib/data/sampleAccount";

export default function AccountPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user, stats } = sampleAccount;

  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    router.push("/account/edit");
  };

  const handleConnectVenmo = () => {
    // TODO: Implement Venmo connection
    alert("Coming soon");
  };

  const handleNotifications = () => {
    // Navigate to edit profile where notifications settings are
    router.push("/account/edit");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("[AccountPage] Failed to sign out:", error);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    // TODO: Implement actual account deletion
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("[AccountPage] Failed to delete account:", error);
    }
  };

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
        <h1 className="text-xl font-bold text-white ml-2">ACCOUNT</h1>
      </div>

      {/* Profile Header */}
      <ProfileHeader
        name={user.name}
        username={user.username}
        initials={user.initials}
        memberSince={user.memberSince}
      />

      {/* Overall Record Card */}
      <OverallRecordCard
        wins={stats.overallRecord.wins}
        losses={stats.overallRecord.losses}
        ties={stats.overallRecord.ties}
        winRate={stats.winRate}
      />

      {/* Stats Grid */}
      <StatsGrid
        totalWinnings={stats.totalWinnings}
        totalLosses={stats.totalLosses}
        h2hWins={stats.h2hRecord.wins}
        h2hLosses={stats.h2hRecord.losses}
        totalBets={stats.totalBets}
      />

      {/* Settings Menu */}
      <SettingsMenu
        onEditProfile={handleEditProfile}
        onConnectVenmo={handleConnectVenmo}
        onNotifications={handleNotifications}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
