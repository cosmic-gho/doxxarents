"use client";

import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import { Lock, Loader2, Maximize2 } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface VirtualTourViewerProps {
  propertyId: string | number;
  hasUnlocked?: boolean;
  tourUrl?: string | null;
  onUnlockSuccess?: () => void;
}

function Model({ url }: { url: string }) {
  // Using useGLTF to load the model. It automatically caches.
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-stone-500">
        <Loader2 className="h-8 w-8 animate-spin text-ink" />
        <span className="text-sm font-medium">Loading 3D Engine...</span>
      </div>
    </Html>
  );
}

export function VirtualTourViewer({ propertyId, hasUnlocked = false, tourUrl, onUnlockSuccess }: VirtualTourViewerProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleUnlock = async () => {
    setIsProcessingPayment(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Please log in to unlock virtual tours.");
        setIsProcessingPayment(false);
        return;
      }

      // Mock Payment processing
      const res = await fetch(`${API_BASE}/api/properties/${propertyId}/unlock_virtual_tour/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        if (onUnlockSuccess) onUnlockSuccess();
      } else {
        alert("Failed to process payment. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during payment.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-50 bg-stone-900" 
    : "relative w-full h-[500px] overflow-hidden rounded-xl border border-stone-200 bg-stone-100";

  if (!hasUnlocked || !tourUrl) {
    return (
      <div className="relative w-full h-[500px] overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-sm scale-105" 
          style={{ backgroundImage: 'url("/images/districts/default-abuja.jpg")' }}
        />
        <div className="absolute inset-0 bg-stone-900/60 flex flex-col items-center justify-center p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white mb-6 backdrop-blur-md">
            <Lock className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-display text-white mb-2">Virtual Inspection Locked</h3>
          <p className="text-stone-300 max-w-md mb-8">
            Experience this property in immersive 3D. Inspect every room and angle from the comfort of your home before committing to a physical visit.
          </p>
          <button
            onClick={handleUnlock}
            disabled={isProcessingPayment}
            className="flex items-center gap-2 rounded-lg bg-gold-default hover:bg-gold-dark text-ink px-8 py-3.5 font-medium transition disabled:opacity-70"
          >
            {isProcessingPayment ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Processing Payment...</>
            ) : (
              "Pay ₦5,000 to Unlock"
            )}
          </button>
          <p className="text-xs text-stone-400 mt-4">Secure payment powered by Paystack</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Environment preset="city" />
          <Model url={tourUrl} />
          <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 1.5} 
            enableZoom={true} 
          />
        </Suspense>
      </Canvas>
      
      <button 
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-ink shadow-sm hover:bg-white backdrop-blur transition"
      >
        <Maximize2 className="h-5 w-5" />
      </button>

      {isFullscreen && (
        <div className="absolute top-4 left-4 z-10 rounded-lg bg-black/50 px-4 py-2 text-sm text-white backdrop-blur">
          Press ESC to exit full screen
        </div>
      )}
    </div>
  );
}
