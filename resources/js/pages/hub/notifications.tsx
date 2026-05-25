import { Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type Notification = {
    id: string;
    title: string;
    message: string;
    time: string;
    href: string;
    read: boolean;
};

type Props = {
    notifications: Notification[];
    unreadCount: number;
};

export default function NotificationsPage() {
    const { notifications, unreadCount } = usePage<Props>().props;

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8 flex items-center gap-3">
                <Bell className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold lg:text-3xl">Notifikasi</h1>
                    <p className="text-muted-foreground">
                        {unreadCount > 0
                            ? `${unreadCount} pembaruan komisi belum selesai`
                            : 'Semua komisi sudah selesai atau tidak ada pembaruan baru'}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <Card
                            key={n.id}
                            className={n.read ? 'opacity-80' : 'border-primary/30'}
                        >
                            <CardContent className="flex items-start justify-between gap-4 p-4">
                                <div>
                                    <p className="font-semibold">{n.title}</p>
                                    <p className="text-sm text-muted-foreground">{n.message}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                                </div>
                                <Link
                                    href={n.href}
                                    className="shrink-0 text-sm font-medium text-primary hover:underline"
                                >
                                    Lihat
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="py-12 text-center text-muted-foreground">
                        Belum ada notifikasi. Buat komisi pertama Anda untuk memulai.
                    </p>
                )}
            </div>
        </div>
    );
}
