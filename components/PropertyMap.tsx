"use client";

import { MapPin } from "lucide-react";

interface PropertyMapProps {
  latitude: string | number | null;
  longitude: string | number | null;
  address: string;
}

export function PropertyMap({ latitude, longitude, address }: PropertyMapProps) {
  if (!latitude || !longitude) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-500">
        <MapPin className="mb-2 h-8 w-8 text-stone-400" />
        <p>Location coordinates not provided</p>
        <p className="text-sm mt-1 max-w-sm text-center">{address}</p>
      </div>
    );
  }

  // A free embed map that uses a simple Google Maps query string
  const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  const fullMapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="group relative h-[400px] w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 z-0 h-full w-full"
      />
      
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg bg-white/95 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-ink">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-ink line-clamp-1">{address}</p>
            <p className="text-xs text-stone-500">Coordinates: {Number(latitude).toFixed(4)}, {Number(longitude).toFixed(4)}</p>
          </div>
        </div>
        <a
          href={fullMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-ink-light"
        >
          Open in Maps
        </a>
      </div>
    </div>
  );
}
