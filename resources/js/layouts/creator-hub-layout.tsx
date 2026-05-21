import { CreatorSidebar } from '@/components/hub/creator-sidebar';

export default function CreatorHubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <CreatorSidebar />
            <main className="flex-1">{children}</main>
        </div>
    );
}
