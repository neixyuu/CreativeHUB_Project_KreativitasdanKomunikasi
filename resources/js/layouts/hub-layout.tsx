import { DashboardHeader } from '@/components/hub/dashboard-header';
import { DashboardSidebar } from '@/components/hub/dashboard-sidebar';

export default function HubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <DashboardHeader />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
