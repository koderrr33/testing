"use client";

import { useEffect } from "react";

export function HomeScrollSnap() {
  useEffect(() => {
    document.documentElement.classList.add("home-scroll-snap");
    return () => document.documentElement.classList.remove("home-scroll-snap");
  }, []);

  return null;
}
