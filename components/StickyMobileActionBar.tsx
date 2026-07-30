"use client";

import { Heart, Phone, MessageCircle, CalendarCheck } from "lucide-react";

export default function StickyMobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-4 gap-1 px-2 py-2 text-xs">
        <button className="flex flex-col items-center gap-1 rounded-lg py-1.5 text-stone-600">
          <Heart className="h-5 w-5" />
          Save
        </button>
        <button className="flex flex-col items-center gap-1 rounded-lg py-1.5 text-stone-600">
          <Phone className="h-5 w-5" />
          Call
        </button>
        <button className="flex flex-col items-center gap-1 rounded-lg py-1.5 text-emerald-600">
          <MessageCircle className="h-5 w-5" />
          WhatsApp
        </button>
        <button className="flex flex-col items-center gap-1 rounded-lg bg-ink py-1.5 text-paper">
          <CalendarCheck className="h-5 w-5" />
          Book
        </button>
      </div>
    </div>
  );
}
