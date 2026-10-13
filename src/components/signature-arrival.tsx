"use client";

import { useEffect, useRef } from "react";

export function SignatureArrival() {
  const pending = useRef<string | null>(null);
  useEffect(() => {
    const match = /^#vnt_ref=([A-Za-z0-9_.-]{1,512})$/.exec(window.location.hash);
    if (match) pending.current = match[1];
    if (!pending.current) return;
    // Remove only our fragment. React remounts and page refreshes cannot resend it.
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
    const confirm = () => {
      if (document.visibilityState !== "visible" || !pending.current) return;
      document.removeEventListener("visibilitychange", confirm);
      const token = pending.current;
      pending.current = null;
      void fetch("/api/signature-arrival", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: token,
        credentials: "omit",
        keepalive: true,
        cache: "no-store",
      }).catch(() => {});
    };
    if (document.visibilityState === "visible") confirm();
    else document.addEventListener("visibilitychange", confirm);
    return () => document.removeEventListener("visibilitychange", confirm);
  }, []);

  return null;
}
