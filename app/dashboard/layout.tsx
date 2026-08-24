import type { Metadata } from 'next';
import DashboardClientLayout from "./ClientLayout";

export const metadata: Metadata = {
    title: "Agent Dashboard — DOXXARentals",
    description: "Manage your property listings, view analytics, and handle inspection requests from your DOXXARentals agent dashboard.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
