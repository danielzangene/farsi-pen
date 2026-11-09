"use client";
import { useEffect } from "react";
import { startAutoSync } from "@/lib/sync";

/** Starts device sync (if turned on) once per visit. */
export function AutoSync() {
  useEffect(() => startAutoSync(), []);
  return null;
}
