"use client";

import { X } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-sb-card border border-sb-border rounded-xl p-6 max-w-sm w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-sb-muted hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-4">DELETE ACCOUNT?</h2>

        {/* Message */}
        <p className="text-white text-sm mb-2">
          You&apos;re About to Delete Your Account, all bets, groups, and history
        </p>

        {/* Warning */}
        <p className="text-sb-red text-sm italic mb-6">
          This cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-sb-card border border-sb-border rounded-lg text-white text-sm font-semibold uppercase tracking-wide hover:bg-sb-card-hover transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-sb-red rounded-lg text-white text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            DELETE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
}
