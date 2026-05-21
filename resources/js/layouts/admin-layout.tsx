import { Link, usePage } from '@inertiajs/react';
import {
    Flag,
    LayoutDashboard,
    Sparkles,
    Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Pengguna', icon: Users },
    { href: '/admin/reports', label: 'Laporan', icon: Flag },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { url } = usePage();

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 border-r border-sidebar-border bg-sidebar">
                <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold">Admin Panel</span>
                </div>
                <nav className="space-y-1 p-4">
                    {links.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                url === item.href || url.startsWith(item.href + '/')
                                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                    : 'text-sidebar-foreground hover:bg-sidebar-accent',
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 bg-muted/20">{children}</main>
        </div>
    );
}
