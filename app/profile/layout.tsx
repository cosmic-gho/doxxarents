import type { Metadata } from 'next';
import ProfileClientLayout from "./ClientLayout";

export const metadata: Metadata = {
    title: "Profile Settings — DOXXARentals",
    description: "Manage your DOXXARentals account details, contact information and preferences.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <ProfileClientLayout>{children}</ProfileClientLayout>;
}
