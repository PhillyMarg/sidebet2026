"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import {
  FriendCard,
  PendingRequestCard,
  SentRequestCard,
  SuggestedFriendCard,
  FriendSection,
  AddFriendModal,
} from "@/components/friends";
import {
  sampleFriends,
  currentUser,
  PendingRequest,
  MyFriend,
  SuggestedFriend,
  SentRequest,
} from "@/lib/data/sampleFriends";

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Local state to manage friends data (simulating state management)
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>(
    sampleFriends.pendingRequests
  );
  const [myFriends, setMyFriends] = useState<MyFriend[]>(sampleFriends.myFriends);
  const [suggested, setSuggested] = useState<SuggestedFriend[]>(sampleFriends.suggested);
  const [sentRequests, setSentRequests] = useState<SentRequest[]>(sampleFriends.sentRequests);

  // Filter friends based on search query
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        pendingRequests,
        myFriends,
        suggested,
        sentRequests,
      };
    }

    const lowerQuery = searchQuery.toLowerCase();
    return {
      pendingRequests: pendingRequests.filter(
        (f) =>
          f.name.toLowerCase().includes(lowerQuery) ||
          f.username.toLowerCase().includes(lowerQuery)
      ),
      myFriends: myFriends.filter(
        (f) =>
          f.name.toLowerCase().includes(lowerQuery) ||
          f.username.toLowerCase().includes(lowerQuery)
      ),
      suggested: suggested.filter(
        (f) =>
          f.name.toLowerCase().includes(lowerQuery) ||
          f.username.toLowerCase().includes(lowerQuery)
      ),
      sentRequests: sentRequests.filter(
        (f) =>
          f.name.toLowerCase().includes(lowerQuery) ||
          f.username.toLowerCase().includes(lowerQuery)
      ),
    };
  }, [searchQuery, pendingRequests, myFriends, suggested, sentRequests]);

  // Check if there are any friends/requests at all
  const hasAnyFriends =
    pendingRequests.length > 0 ||
    myFriends.length > 0 ||
    suggested.length > 0 ||
    sentRequests.length > 0;

  // Handlers
  const handleAcceptRequest = (id: string) => {
    const request = pendingRequests.find((r) => r.id === id);
    if (request) {
      // Move from pending to my friends
      setPendingRequests((prev) => prev.filter((r) => r.id !== id));
      setMyFriends((prev) => [
        ...prev,
        {
          id: request.id,
          name: request.name,
          username: request.username,
          record: { wins: 0, losses: 0, ties: 0 },
        },
      ]);
      showToast(`${request.name} added as friend!`);
    }
  };

  const handleDeclineRequest = (id: string) => {
    const request = pendingRequests.find((r) => r.id === id);
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    if (request) {
      showToast(`Request from ${request.name} declined`);
    }
  };

  const handleChallenge = (name: string) => {
    // Placeholder - would open Create Bet Wizard with H2H flow
    showToast(`Challenge ${name} - Coming soon!`);
  };

  const handleAddSuggestedFriend = (id: string) => {
    const friend = suggested.find((f) => f.id === id);
    if (friend) {
      // Move from suggested to sent requests
      setSuggested((prev) => prev.filter((f) => f.id !== id));
      setSentRequests((prev) => [
        ...prev,
        { id: friend.id, name: friend.name, username: friend.username },
      ]);
      showToast(`Friend request sent to ${friend.name}!`);
    }
  };

  const handleSendRequest = (username: string) => {
    // Generate a unique ID for the new request
    const newId = `sent-${crypto.randomUUID()}`;
    setSentRequests((prev) => [
      ...prev,
      { id: newId, name: username, username: username },
    ]);
    setIsModalOpen(false);
    showToast(`Friend request sent to @${username}!`);
  };

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(currentUser.username);
    showToast("Username copied to clipboard!");
  };

  const handleShareUsername = () => {
    if (navigator.share) {
      navigator.share({
        title: "Add me on SideBet!",
        text: `Add me on SideBet! My username is @${currentUser.username}`,
      });
    } else {
      // Fallback to copy
      handleCopyUsername();
    }
  };

  const handleSyncContacts = () => {
    showToast("Coming soon!");
  };

  // Simple toast notification (placeholder)
  const showToast = (message: string) => {
    console.log("[Toast]", message);
    // In a real app, this would use a toast library
    alert(message);
  };

  // Empty state - Matches Figma "FRIENDS PAGE | EMPTY"
  if (!hasAnyFriends) {
    return (
      <div className="px-[18px] pt-[66px]">
        {/* Add Friend Button - Full width orange */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full h-[28px] bg-sb-orange text-white text-[10px] font-semibold font-montserrat uppercase rounded-[6px] hover:opacity-90 transition-opacity mb-4"
        >
          + ADD FRIEND
        </button>

        {/* Search Bar */}
        <div className="flex items-center justify-center px-6 py-2 mb-8">
          <div className="bg-[#2B2B2F] h-[24px] rounded-[6px] px-3 py-2 flex items-center gap-2 w-full">
            <Search size={12} className="text-[#B3B3B3]" />
            <span className="text-[#B3B3B3] text-[12px] font-semibold font-montserrat">
              Search Friends...
            </span>
          </div>
        </div>

        {/* Empty State Message */}
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-white text-[14px] font-light italic font-montserrat">
            No Friends Yet? Let&apos;s Change That!
          </p>
        </div>

        <AddFriendModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSendRequest={handleSendRequest}
          onCopyUsername={handleCopyUsername}
          onShareUsername={handleShareUsername}
          onSyncContacts={handleSyncContacts}
        />
      </div>
    );
  }

  // Filled state - Matches Figma "FRIENDS PAGE | FILLED"
  return (
    <div className="px-[18px] pt-[66px]">
      {/* Add Friend Button - Full width orange */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full h-[28px] bg-sb-orange text-white text-[10px] font-semibold font-montserrat uppercase rounded-[6px] hover:opacity-90 transition-opacity mb-4"
      >
        + ADD FRIEND
      </button>

      {/* Search Bar */}
      <div className="flex items-center justify-center px-6 py-2 mb-4">
        <div className="bg-[#2B2B2F] h-[24px] rounded-[6px] px-3 py-2 flex items-center gap-2 w-full">
          <Search size={12} className="text-[#B3B3B3]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Friends..."
            className="bg-transparent text-white text-[12px] font-semibold font-montserrat placeholder:text-[#B3B3B3] outline-none flex-1"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="pb-24 px-[6px]">
        {/* Pending Requests */}
        {filteredFriends.pendingRequests.length > 0 && (
          <FriendSection
            title="PENDING REQUESTS"
            count={filteredFriends.pendingRequests.length}
            defaultExpanded={true}
          >
            {filteredFriends.pendingRequests.map((request) => (
              <PendingRequestCard
                key={request.id}
                name={request.name}
                username={request.username}
                onAccept={() => handleAcceptRequest(request.id)}
                onDecline={() => handleDeclineRequest(request.id)}
              />
            ))}
          </FriendSection>
        )}

        {/* My Friends */}
        {filteredFriends.myFriends.length > 0 && (
          <FriendSection
            title="MY FRIENDS"
            count={filteredFriends.myFriends.length}
            defaultExpanded={true}
          >
            {filteredFriends.myFriends.map((friend) => (
              <FriendCard
                key={friend.id}
                name={friend.name}
                username={friend.username}
                record={friend.record}
                onChallenge={() => handleChallenge(friend.name)}
              />
            ))}
          </FriendSection>
        )}

        {/* Suggested */}
        {filteredFriends.suggested.length > 0 && (
          <FriendSection
            title="SUGGESTED"
            count={filteredFriends.suggested.length}
            defaultExpanded={true}
          >
            {filteredFriends.suggested.map((friend) => (
              <SuggestedFriendCard
                key={friend.id}
                name={friend.name}
                username={friend.username}
                source={friend.source}
                onAddFriend={() => handleAddSuggestedFriend(friend.id)}
              />
            ))}
          </FriendSection>
        )}

        {/* Sent Requests */}
        {filteredFriends.sentRequests.length > 0 && (
          <FriendSection
            title="SENT REQUESTS"
            count={filteredFriends.sentRequests.length}
            defaultExpanded={true}
          >
            {filteredFriends.sentRequests.map((request) => (
              <SentRequestCard
                key={request.id}
                name={request.name}
                username={request.username}
              />
            ))}
          </FriendSection>
        )}
      </div>

      {/* Add Friend Modal */}
      <AddFriendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSendRequest={handleSendRequest}
        onCopyUsername={handleCopyUsername}
        onShareUsername={handleShareUsername}
        onSyncContacts={handleSyncContacts}
      />
    </div>
  );
}
