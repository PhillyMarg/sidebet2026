"use client";

import { useState } from "react";
import { X, Copy, Share2, Users } from "lucide-react";
import { currentUser } from "@/lib/data/sampleFriends";

type TabType = "SEARCH" | "INVITE" | "CONTACTS";

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendRequest: (username: string) => void;
  onCopyUsername: () => void;
  onShareUsername: () => void;
  onSyncContacts: () => void;
}

export function AddFriendModal({
  isOpen,
  onClose,
  onSendRequest,
  onCopyUsername,
  onShareUsername,
  onSyncContacts,
}: AddFriendModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("SEARCH");
  const [searchUsername, setSearchUsername] = useState("");

  if (!isOpen) return null;

  const handleSendRequest = () => {
    if (searchUsername.trim()) {
      onSendRequest(searchUsername.trim());
      setSearchUsername("");
    }
  };

  const tabs: TabType[] = ["SEARCH", "INVITE", "CONTACTS"];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-sb-card rounded-t-2xl p-4 pb-8 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-semibold">Add Friend</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-sb-muted hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-sb-border mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeTab === tab
                  ? "text-sb-orange border-b-2 border-sb-orange"
                  : "text-sb-muted hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === "SEARCH" && (
            <div className="flex flex-col gap-4">
              <p className="text-sb-muted text-sm">
                Enter a username to send a friend request.
              </p>
              <input
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Enter username..."
                className="w-full h-12 px-4 bg-sb-black rounded-lg text-white text-sm placeholder:text-sb-muted border border-sb-border focus:border-sb-orange focus:outline-none transition-colors"
              />
              <button
                onClick={handleSendRequest}
                disabled={!searchUsername.trim()}
                className="w-full h-12 bg-sb-orange text-white font-semibold rounded-lg uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Request
              </button>
            </div>
          )}

          {activeTab === "INVITE" && (
            <div className="flex flex-col gap-4">
              <p className="text-sb-muted text-sm">
                Share your username with friends so they can add you.
              </p>
              <div className="bg-sb-black rounded-lg p-4 text-center">
                <span className="text-sb-muted text-xs uppercase">Your Username</span>
                <p className="text-sb-orange text-xl font-bold mt-1">
                  @{currentUser.username}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onCopyUsername}
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-sb-border text-white font-semibold rounded-lg text-sm hover:bg-sb-card-hover transition-colors"
                >
                  <Copy size={16} />
                  Copy Username
                </button>
                <button
                  onClick={onShareUsername}
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-sb-orange text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          )}

          {activeTab === "CONTACTS" && (
            <div className="flex flex-col gap-4 items-center justify-center py-8">
              <Users size={48} className="text-sb-muted" />
              <p className="text-sb-muted text-sm text-center">
                Sync your contacts to find friends already on SideBet.
              </p>
              <button
                onClick={onSyncContacts}
                className="h-12 px-6 bg-sb-orange text-white font-semibold rounded-lg uppercase text-sm hover:opacity-90 transition-opacity"
              >
                Sync Contacts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
