"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_ENABLED, signOut, useAuth } from "@/lib/auth";

/** Who is signed in, and a way out. Only shown when the build has sign-in. */
export function AccountCard() {
  const { user } = useAuth();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  if (!AUTH_ENABLED || !user) return null;

  return (
    <section className="card p-5">
      <h2 className="eyebrow text-muted">Account</h2>
      <p className="mt-2 text-sm font-semibold text-muted">
        Signed in with Google as <span className="break-all text-ink">{user.email}</span>
      </p>
      <button
        type="button"
        className="btn-secondary mt-4"
        disabled={leaving}
        onClick={async () => {
          setLeaving(true);
          await signOut();
          router.replace("/login/");
        }}
      >
        {leaving ? "Signing out…" : "Sign out"}
      </button>
    </section>
  );
}
