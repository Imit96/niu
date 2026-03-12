"use client";

import { useState, useTransition } from "react";
import { adminUpdateUserEmail, adminSendPasswordReset } from "@/app/actions/user";
import { Mail, Pencil, X, Check } from "lucide-react";

interface Props {
  userId: string;
  currentEmail: string;
}

export function AdminUserActions({ userId, currentEmail }: Props) {
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(currentEmail);
  const [emailMsg, setEmailMsg] = useState<{ ok?: boolean; text: string } | null>(null);
  const [resetMsg, setResetMsg] = useState<{ ok?: boolean; text: string } | null>(null);
  const [isPendingEmail, startEmailTransition] = useTransition();
  const [isPendingReset, startResetTransition] = useTransition();

  function handleEditCancel() {
    setEmailInput(currentEmail);
    setEditingEmail(false);
    setEmailMsg(null);
  }

  function handleEmailSave() {
    startEmailTransition(async () => {
      const result = await adminUpdateUserEmail(userId, emailInput);
      if (result.error) {
        setEmailMsg({ ok: false, text: result.error });
      } else {
        setEmailMsg({ ok: true, text: "Email updated." });
        setEditingEmail(false);
      }
    });
  }

  function handlePasswordReset() {
    startResetTransition(async () => {
      const result = await adminSendPasswordReset(userId);
      if (result.error) {
        setResetMsg({ ok: false, text: result.error });
      } else {
        setResetMsg({ ok: true, text: "Password reset email sent." });
      }
    });
  }

  return (
    <div className="bg-cream border border-earth/10 p-6 space-y-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-earth/50">
        Account Recovery
      </h2>

      {/* Email editor */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-earth/60 uppercase tracking-wider">Email Address</p>
        {editingEmail ? (
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 text-sm border border-earth/20 rounded-sm px-3 py-1.5 bg-white text-earth focus:border-bronze focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleEmailSave}
              disabled={isPendingEmail || !emailInput}
              className="p-1.5 text-emerald-600 hover:text-emerald-700 disabled:opacity-40"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleEditCancel}
              className="p-1.5 text-earth/50 hover:text-earth"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-earth">{currentEmail}</span>
            <button
              onClick={() => { setEditingEmail(true); setEmailMsg(null); }}
              className="text-earth/40 hover:text-bronze transition-colors"
              title="Edit email"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {emailMsg && (
          <p className={`text-xs ${emailMsg.ok ? "text-emerald-600" : "text-red-600"}`}>
            {emailMsg.text}
          </p>
        )}
      </div>

      {/* Send password reset */}
      <div className="space-y-2 pt-1 border-t border-earth/10">
        <p className="text-xs text-earth/60 pt-3">
          Send a password reset link to the user&apos;s current email address.
        </p>
        <button
          onClick={handlePasswordReset}
          disabled={isPendingReset}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 border border-earth/20 text-earth hover:border-bronze hover:text-bronze transition-colors disabled:opacity-40"
        >
          <Mail className="w-3.5 h-3.5" />
          {isPendingReset ? "Sending..." : "Send Password Reset"}
        </button>
        {resetMsg && (
          <p className={`text-xs ${resetMsg.ok ? "text-emerald-600" : "text-red-600"}`}>
            {resetMsg.text}
          </p>
        )}
      </div>
    </div>
  );
}
