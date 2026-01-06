"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Header, BottomNav, FAB } from "@/components/layout";

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
    // TODO: Open CreateBetWizard modal
    console.log("Open Create Bet Wizard");
  };

  const handleCreateTournament = () => {
    setShowCreateTournament(true);
    // TODO: Open CreateTournamentWizard modal
    console.log("Open Create Tournament Wizard");
  };

  return (
    <div className="min-h-screen bg-sb-black">
      <Header />
      
      {/* Main content with padding for header and nav */}
      <main className="pt-14 pb-20 min-h-screen">
        {children}
      </main>

      <FAB onCreateBet={handleCreateBet} onCreateTournament={handleCreateTournament} />
      <BottomNav />

      {/* TODO: Add CreateBetWizard modal */}
      {/* TODO: Add CreateTournamentWizard modal */}
    </div>
  );
}
