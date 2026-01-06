"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, or } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "./useAuth";
import { BetData } from "@/components/bet/BetCard";
import { Timestamp } from "firebase/firestore";

// Status mapping from Firestore to UI
function mapBetStatus(status: string, userId: string | undefined, creatorId: string, result?: string): "PENDING" | "OPEN" | "WON" | "LOST" | "JUDGE" {
  switch (status) {
    case "PENDING":
      return "PENDING";
    case "OPEN":
      return "OPEN";
    case "CLOSED":
      // Closed means it needs judging - only show JUDGE to creator
      return creatorId === userId ? "JUDGE" : "OPEN";
    case "JUDGED":
    case "SETTLED":
      // Determine if user won or lost
      // This is simplified - in reality we'd check the picks
      return result ? "WON" : "LOST";
    default:
      return "OPEN";
  }
}

// Format Timestamp to MM/DD/YYYY
function formatTimestamp(timestamp: Timestamp | null): string {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

// Transform Firestore bet document to BetData
function transformBetToBetData(
  betDoc: Record<string, unknown>,
  userId: string | undefined
): BetData {
  const picks = (betDoc.picks as Record<string, { pick: string; amount: number }>) || {};
  const userPick = userId && picks[userId] ? picks[userId].pick as "YES" | "NO" | "OVER" | "UNDER" : undefined;

  // Calculate vote percentages
  let yesCount = 0;
  let noCount = 0;
  let overCount = 0;
  let underCount = 0;

  Object.values(picks).forEach((pick) => {
    switch (pick.pick) {
      case "YES":
        yesCount++;
        break;
      case "NO":
        noCount++;
        break;
      case "OVER":
        overCount++;
        break;
      case "UNDER":
        underCount++;
        break;
    }
  });

  const totalVotes = yesCount + noCount + overCount + underCount;
  const betType = betDoc.type as "YES_NO" | "OVER_UNDER";

  let yesPercentage = 50;
  let noPercentage = 50;

  if (totalVotes > 0) {
    if (betType === "YES_NO") {
      yesPercentage = Math.round((yesCount / totalVotes) * 100);
      noPercentage = 100 - yesPercentage;
    } else {
      yesPercentage = Math.round((overCount / totalVotes) * 100);
      noPercentage = 100 - yesPercentage;
    }
  }

  const status = mapBetStatus(
    betDoc.status as string,
    userId,
    betDoc.creatorId as string,
    betDoc.result as string | undefined
  );

  // Calculate potential payout (simplified - equal split)
  const pot = (betDoc.pot as number) || 0;
  const potentialPayout = userPick && pot > 0 ? Math.round(pot / Math.max(1, totalVotes)) : undefined;

  return {
    id: betDoc.id as string,
    type: betType,
    category: betDoc.isH2H ? "H2H" : "GROUP",
    title: betDoc.question as string,
    description: betDoc.description as string | undefined,
    challenger: betDoc.challengerName as string | undefined,
    challenged: betDoc.challengedName as string | undefined,
    groupName: betDoc.groupName as string | undefined,
    creatorName: betDoc.creatorName as string | undefined,
    playerCount: totalVotes > 0 ? totalVotes : undefined,
    wager: (betDoc.stakes as number) || 0,
    totalPot: pot,
    line: betDoc.overUnderLine as number | undefined,
    closingDate: formatTimestamp(betDoc.closingTime as Timestamp | null),
    yesPercentage,
    noPercentage,
    userPick,
    potentialPayout,
    status,
  };
}

export interface UseBetsOptions {
  groupIds?: string[];
  status?: string;
}

export function useBets(options?: UseBetsOptions) {
  const [bets, setBets] = useState<BetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setBets([]);
      setLoading(false);
      return;
    }

    const betsRef = collection(db, "bets");

    // Build query - we'll filter client-side for complex queries
    let q = query(betsRef, orderBy("createdAt", "desc"));

    // If we have specific group IDs, filter to those
    if (options?.groupIds && options.groupIds.length > 0) {
      q = query(
        betsRef,
        where("groupId", "in", options.groupIds),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allBets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Record<string, unknown>[];

        // Filter bets relevant to the user
        const userBets = allBets.filter((bet) => {
          // User is the creator
          if (bet.creatorId === user.uid) return true;
          // User is challenged in H2H
          if (bet.challengedId === user.uid) return true;
          // User is challenger in H2H
          if (bet.challengerId === user.uid) return true;
          // Bet is in one of user's groups
          if (options?.groupIds && bet.groupId && options.groupIds.includes(bet.groupId as string)) return true;
          // User has a pick on this bet
          const picks = bet.picks as Record<string, unknown> | undefined;
          if (picks && picks[user.uid]) return true;
          // For now, show all bets if no group filter
          if (!options?.groupIds || options.groupIds.length === 0) return true;
          return false;
        });

        // Transform to BetData format
        const transformedBets = userBets.map((bet) =>
          transformBetToBetData(bet as Record<string, unknown>, user.uid)
        );

        setBets(transformedBets);
        setLoading(false);
      },
      (err) => {
        console.error("[useBets] Error fetching bets:", err);
        setError("Failed to load bets");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, options?.groupIds?.join(","), options?.status]);

  return { bets, loading, error };
}

export function useUserGroups() {
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setGroupIds([]);
      setLoading(false);
      return;
    }

    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("members", "array-contains", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ids = snapshot.docs.map((doc) => doc.id);
      setGroupIds(ids);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { groupIds, loading };
}
