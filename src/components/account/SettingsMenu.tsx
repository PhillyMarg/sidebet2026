"use client";

interface SettingsMenuProps {
  onEditProfile: () => void;
  onConnectVenmo: () => void;
  onNotifications: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function SettingsMenu({
  onEditProfile,
  onConnectVenmo,
  onNotifications,
  onLogout,
  onDeleteAccount,
}: SettingsMenuProps) {
  return (
    <div className="mt-6">
      {/* Section Title */}
      <h3 className="text-white text-sm font-semibold uppercase tracking-wide mb-3">
        SETTINGS
      </h3>

      {/* Menu Buttons */}
      <div className="flex flex-col gap-3">
        {/* Edit Profile */}
        <button
          onClick={onEditProfile}
          className="w-full py-3 px-4 bg-sb-card border border-sb-border rounded-lg text-white text-sm font-semibold uppercase tracking-wide hover:bg-sb-card-hover transition-colors"
        >
          EDIT PROFILE
        </button>

        {/* Connect Venmo */}
        <button
          onClick={onConnectVenmo}
          className="w-full py-3 px-4 bg-sb-card border border-sb-border rounded-lg text-white text-sm font-semibold uppercase tracking-wide hover:bg-sb-card-hover transition-colors"
        >
          CONNECT VENMO
        </button>

        {/* Notifications */}
        <button
          onClick={onNotifications}
          className="w-full py-3 px-4 bg-sb-card border border-sb-border rounded-lg text-white text-sm font-semibold uppercase tracking-wide hover:bg-sb-card-hover transition-colors"
        >
          NOTIFICATIONS
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full py-3 px-4 bg-sb-orange rounded-lg text-white text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
        >
          LOGOUT
        </button>

        {/* Delete Account */}
        <button
          onClick={onDeleteAccount}
          className="w-full py-3 px-4 bg-sb-red rounded-lg text-white text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
        >
          DELETE ACCOUNT
        </button>
      </div>
    </div>
  );
}
