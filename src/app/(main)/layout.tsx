"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Header, BottomNav, FAB } from "@/components/layout";
import { CreateBetWizard, CreateBetState } from "@/components/bet/CreateBetWizard";
import { createBet } from "@/lib/firebase/services/bets";
import { createNotification } from "@/lib/firebase/services/notifications";
import { incrementActiveBets } from "@/lib/firebase/services/groups";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showCreateBet, setShowCreateBet] = useState(false);
  const [showCreateTournament, setShowCreateTournament] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sb-black flex items-center justify-center">
        <div className="text-sb-orange text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleCreateBet = () => {
    setShowCreateBet(true);
  };

  const handleCreateTournament = () => {
    setShowCreateTournament(true);
    // TODO: Open CreateTournamentWizard modal
    console.log("Open Create Tournament Wizard");
  };

  const handleCloseBetWizard = () => {
    setShowCreateBet(false);
  };

  const handleSubmitBet = async (data: CreateBetState) => {
    if (!user) return;

    try {
      // Parse closing date and time
      const closingDateTime = new Date(`${data.closingDate} ${data.closingTime || "23:59"}`);

      // Create the bet in Firestore
      const betId = await createBet({
        type: data.betType || "YES_NO",
        question: data.title,
        description: data.description || undefined,
        creatorId: user.uid,
        creatorName: user.displayName || `${user.firstName} ${user.lastName}`,
        groupId: data.selectedGroupId,
        groupName: data.selectedGroupName,
        isH2H: data.betCategory === "H2H",
        challengerId: data.betCategory === "H2H" ? user.uid : undefined,
        challengerName: data.betCategory === "H2H" ? (user.displayName || `${user.firstName} ${user.lastName}`) : undefined,
        challengedId: data.selectedFriendId,
        challengedName: data.selectedFriendName,
        stakes: data.wagerAmount,
        overUnderLine: data.line,
        closingTime: closingDateTime,
      });

      console.log("[MainLayout] Bet created:", betId);

      // If H2H, send notification to challenged user
      if (data.betCategory === "H2H" && data.selectedFriendId) {
        await createNotification({
          userId: data.selectedFriendId,
          type: "BET_CHALLENGE",
          message: `${user.displayName || user.firstName} challenged you to a bet: ${data.title}`,
          link: "/home",
          metadata: {
            betId,
            challengerName: user.displayName || `${user.firstName} ${user.lastName}`,
            betTitle: data.title,
          },
        });
      }

      // If group bet, increment active bets count
      if (data.selectedGroupId) {
        await incrementActiveBets(data.selectedGroupId, 1);
      }

      setShowCreateBet(false);
    } catch (error) {
      console.error("[MainLayout] Failed to create bet:", error);
      // TODO: Show error toast
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(204deg, rgb(24, 24, 27) 0%, rgb(30, 30, 30) 50%, rgb(215, 99, 45) 100%)",
      }}
    >
      <Header />

      {/* Main content with padding for header and nav */}
      <main className="pt-14 pb-24 min-h-screen">
        {children}
      </main>

      <FAB onCreateBet={handleCreateBet} onCreateTournament={handleCreateTournament} />
      <BottomNav />

      {/* Create Bet Wizard */}
      <CreateBetWizard
        isOpen={showCreateBet}
        onClose={handleCloseBetWizard}
        onSubmit={handleSubmitBet}
      />

      {/* TODO: Add CreateTournamentWizard modal */}
    </div>
  );
}
