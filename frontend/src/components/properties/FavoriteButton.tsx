"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { favoriteApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function FavoriteButton({
  propertyId,
  initialFavorited,
  className = "",
}: {
  propertyId: string;
  initialFavorited: boolean;
  className?: string;
}) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    const next = !favorited;
    setFavorited(next); // optimistic
    try {
      if (next) await favoriteApi.add(propertyId);
      else await favoriteApi.remove(propertyId);
    } catch {
      setFavorited(!next); // revert on failure
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      className={`h-9 w-9 rounded-full bg-white/95 shadow flex items-center justify-center transition-transform active:scale-90 ${className}`}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${favorited ? "fill-gold text-gold" : "text-ink/50"}`}
      />
    </button>
  );
}