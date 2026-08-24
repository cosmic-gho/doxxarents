"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/lib/auth";
import { API_BASE } from "@/lib/api";
import { ClipboardCheck, Calendar, Clock, MapPin, Check, X } from "lucide-react";

interface InspectionRequest {
  id: number;
  property: {
    id: number;
    title: string;
    address: string;
  };
  user: {
    username: string;
    email: string;
    phone_number: string;
  };
  date: string;
  time: string;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  created_at: string;
}

export default function DashboardInspections() {
  const [requests, setRequests] = useState<InspectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/inspections/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error("Failed to load inspections", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: "APPROVED" | "REJECTED") {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/inspections/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  }

  return (
    <ProtectedRoute requireAgent>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display text-ink">Inspection Requests</h1>
          <p className="mt-1 text-stone-500">Manage viewing requests from prospective tenants.</p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-stone-500 border border-stone-200 rounded-xl bg-white">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="p-16 text-center border border-stone-200 rounded-xl bg-white">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-50 mb-4">
                <ClipboardCheck className="h-8 w-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-medium text-ink">No requests yet</h3>
              <p className="mt-1 text-stone-500 max-w-sm mx-auto">
                When prospective tenants request to view your properties, they'll appear here.
              </p>
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-6 justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between md:justify-start gap-4">
                    <h3 className="font-medium text-ink">{req.property?.title || "Unknown Property"}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize
                      ${req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                        req.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                        req.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {req.status.toLowerCase()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-stone-400" />
                      <span className="truncate max-w-[200px]">{req.property?.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-stone-400" />
                      {req.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-stone-400" />
                      {req.time}
                    </div>
                  </div>
                  
                  <div className="bg-stone-50 p-4 rounded-lg mt-2 text-sm">
                    <div className="font-medium text-ink mb-1">Requested by {req.user?.username}</div>
                    <div className="text-stone-500 mb-2">
                      {req.user?.email} {req.user?.phone_number ? `• ${req.user.phone_number}` : ''}
                    </div>
                    {req.message && (
                      <p className="italic text-stone-600">"{req.message}"</p>
                    )}
                  </div>
                </div>

                {req.status === "PENDING" && (
                  <div className="flex md:flex-col gap-3 shrink-0">
                    <button
                      onClick={() => updateStatus(req.id, "APPROVED")}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" /> Approve
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, "REJECTED")}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 text-red-600 px-4 py-2 text-sm font-medium transition hover:bg-red-100"
                    >
                      <X className="h-4 w-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
