"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, LogOut } from "lucide-react";
import { useAuth, ProtectedRoute } from "@/lib/auth";

const navigation = [
  { name: "Personal Info", href: "/profile", icon: User },
  { name: "Security", href: "/profile/security", icon: Shield },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex min-h-[calc(100vh-64px)] flex-col md:flex-row bg-stone-50">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-stone-200 bg-white">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-center border-b border-stone-200 py-6">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-2xl font-bold text-stone-400">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <h2 className="mt-3 font-medium text-ink">{user?.username || "User"}</h2>
                <p className="text-xs text-stone-500 capitalize">{user?.role?.toLowerCase() || "User"}</p>
              </div>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                        ? "bg-stone-100 text-ink"
                        : "text-stone-500 hover:bg-stone-50 hover:text-ink"
                      }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? "text-ink" : "text-stone-400"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-stone-200 p-4">
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
