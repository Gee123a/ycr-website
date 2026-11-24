"use client";

import { useSyncExternalStore } from "react";
import { parseCart, type CartItem } from "./cart";

const STORAGE_KEY = "ycr-cart";
const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cached = EMPTY;
// Private browsing can block localStorage; the cart then lives only until the page reloads.
let storageBlocked = false;

function getSnapshot(): CartItem[] {
  if (storageBlocked) return cached;
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    storageBlocked = true;
    return cached;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = parseCart(raw);
  }
  return cached;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function updateCart(change: (cart: CartItem[]) => CartItem[]): CartItem[] {
  const next = change(getSnapshot());
  cached = next;
  cachedRaw = JSON.stringify(next);
  try {
    localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    storageBlocked = true;
  }
  listeners.forEach((listener) => listener());
  return next;
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

let toast = "";
let toastTimer: ReturnType<typeof setTimeout> | undefined;

export function showToast(message: string) {
  clearTimeout(toastTimer);
  toast = message;
  listeners.forEach((listener) => listener());
  if (message) toastTimer = setTimeout(() => showToast(""), 4000);
}

export function useToast(): string {
  return useSyncExternalStore(subscribe, () => toast, () => "");
}
