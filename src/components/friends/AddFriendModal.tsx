"use client";

import { useState } from "react";
import { X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal Content - Matches Figma exactly */}
      <div className="relative w-full max-w-[320px] bg-sb-card border border-sb-orange rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-3 pt-3 pb-10">
        {/* Close Button - Top Right */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-sb-muted hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Title */}
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-white text-[14px] font-semibold font-montserrat uppercase tracking-wide">
            ADD FRIEND
          </h2>
        </div>

        {/* Tabs - Italic styling matching Figma */}
        <div className="flex items-center justify-center gap-[52px] mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[12px] italic font-montserrat transition-colors ${
                activeTab === tab
                  ? "text-sb-orange font-bold"
                  : "text-white font-normal hover:text-sb-orange"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="px-[3px]">
          {/* SEARCH Tab */}
          {activeTab === "SEARCH" && (
            <div className="flex flex-col gap-2">
              {/* Input Field */}
              <div className="h-[22px] bg-transparent border border-[#58585A] rounded-[6px] flex items-center px-2">
                <input
                  type="text"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="Enter @Username"
                  className="w-full bg-transparent text-white text-[12px] italic font-montserrat placeholder:text-white outline-none"
                />
              </div>

              {/* Send Request Button */}
              <button
                onClick={handleSendRequest}
                disabled={!searchUsername.trim()}
                className="h-[28px] bg-sb-orange text-white text-[10px] font-semibold font-montserrat uppercase rounded-[6px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SEND REQUEST
              </button>
            </div>
          )}

          {/* INVITE Tab */}
          {activeTab === "INVITE" && (
            <div className="flex flex-col gap-2">
              {/* Username Display Box - Dashed border */}
              <div className="h-[95px] border-2 border-dashed border-sb-orange rounded-[6px] flex flex-col items-center justify-center gap-1">
                <span className="text-[#919191] text-[10px] italic font-montserrat">
                  YOUR USERNAME
                </span>
                <p className="text-white text-[16px] font-extrabold italic font-montserrat tracking-[4px] uppercase">
                  {currentUser.username}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-[10px]">
                <button
                  onClick={onCopyUsername}
                  className="flex-1 h-[28px] bg-transparent text-white text-[10px] font-semibold font-montserrat uppercase rounded-[6px] hover:bg-white/10 transition-colors"
                >
                  COPY USERNAME
                </button>
                <button
                  onClick={onShareUsername}
                  className="flex-1 h-[28px] bg-transparent text-white text-[10px] font-semibold font-montserrat uppercase rounded-[6px] hover:bg-white/10 transition-colors"
                >
                  SHARE USERNAME
                </button>
              </div>
            </div>
          )}

          {/* CONTACTS Tab */}
          {activeTab === "CONTACTS" && (
            <div className="flex flex-col">
              <button
                onClick={onSyncContacts}
                className="h-[28px] bg-sb-orange text-white text-[10px] font-semibold font-montserrat uppercase rounded-[6px] hover:opacity-90 transition-opacity"
              >
                SYNC CONTACTS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
