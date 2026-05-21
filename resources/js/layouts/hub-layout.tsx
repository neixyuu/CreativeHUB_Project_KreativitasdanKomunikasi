import { DashboardHeader } from '@/components/hub/dashboard-header';
import { DashboardSidebar } from '@/components/hub/dashboard-sidebar';

export default function HubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex flex-1 flex-col lg:pl-0">
                <DashboardHeader />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
