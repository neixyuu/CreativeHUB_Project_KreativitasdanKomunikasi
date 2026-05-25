import { Form, Link, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, MessageSquare, Plus, Search, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Commission = {
    id: number;
    title: string;
    category: string;
    status: string;
    status_label: string;
    progress: number;
    deadline: string | null;
    budget: number | null;
    conversation_id: number | null;
    can_review: boolean;
    creator: { id: number; name: string; username: string | null; avatar: string };
};

type Props = {
    commissions: Commission[];
    activeTab: string;
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'in_progress':
            return { label: 'Berjalan', className: 'bg-blue-100 text-blue-700', icon: Clock };
        case 'review':
            return { label: 'Review', className: 'bg-yellow-100 text-yellow-700', icon: AlertCircle };
        case 'completed':
            return { label: 'Selesai', className: 'bg-green-100 text-green-700', icon: CheckCircle };
        case 'cancelled':
            return { label: 'Dibatalkan', className: 'bg-red-100 text-red-700', icon: AlertCircle };
        default:
            return { label: 'Menunggu', className: 'bg-gray-100 text-gray-700', icon: Clock };
    }
}

export default function CommissionsPage() {
    const { commissions, activeTab: initialTab } = usePage<Props>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState(initialTab || 'all');

    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    const filtered = useMemo(
        () =>
            commissions.filter((c) => {
                const q = searchQuery.toLowerCase();
                const matchesSearch =
                    c.title.toLowerCase().includes(q) ||
                    c.creator.name.toLowerCase().includes(q);
                const matchesTab = activeTab === 'all' || c.status === activeTab;
                return matchesSearch && matchesTab;
            }),
        [commissions, searchQuery, activeTab],
    );

    const activeCount = commissions.filter((c) =>
        ['pending', 'in_progress', 'review'].includes(c.status),
    ).length;

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="mb-2 text-2xl font-bold lg:text-3xl">Komisi Saya</h1>
                    <p className="text-muted-foreground">Lacak dan kelola pesanan jasa Anda</p>
                </div>
                <Button asChild className="gap-2 bg-gradient-to-r from-primary to-secondary">
                    <Link href="/commission/create">
                        <Plus className="h-4 w-4" />
                        Komisi Baru
                    </Link>
                </Button>
            </div>

            <div className="mb-8 grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-primary">{commissions.length}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{activeCount}</p>
                        <p className="text-sm text-muted-foreground">Aktif</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {commissions.filter((c) => c.status === 'completed').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Selesai</p>
                    </CardContent>
                </Card>
            </div>

            <div className="relative mb-6 flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Cari komisi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="all">Semua</TabsTrigger>
                    <TabsTrigger value="pending">Menunggu</TabsTrigger>
                    <TabsTrigger value="in_progress">Berjalan</TabsTrigger>
                    <TabsTrigger value="review">Review</TabsTrigger>
                    <TabsTrigger value="completed">Selesai</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                    {filtered.length > 0 ? (
                        filtered.map((commission) => {
                            const badge = getStatusBadge(commission.status);
                            return (
                                <Card key={commission.id}>
                                    <CardContent className="p-4 lg:p-6">
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                                            <div className="flex flex-1 items-center gap-4">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={commission.creator.avatar} />
                                                    <AvatarFallback>
                                                        {commission.creator.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate font-semibold">
                                                        {commission.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {commission.creator.name}
                                                        {commission.creator.username &&
                                                            ` · @${commission.creator.username}`}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {commission.category}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
                                            >
                                                <badge.icon className="h-3 w-3" />
                                                {badge.label}
                                            </span>
                                            {commission.status !== 'completed' && (
                                                <div className="w-full sm:w-32">
                                                    <p className="mb-1 text-xs text-muted-foreground">
                                                        Progress {commission.progress}%
                                                    </p>
                                                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                                                            style={{ width: `${commission.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="text-right">
                                                <p className="font-semibold text-primary">
                                                    {commission.budget
                                                        ? formatPrice(commission.budget)
                                                        : '-'}
                                                </p>
                                                {commission.deadline && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Tenggat: {commission.deadline}
                                                    </p>
                                                )}
                                            </div>
                                            {commission.conversation_id ? (
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link
                                                        href={`/dashboard/messages?conversation=${commission.conversation_id}`}
                                                    >
                                                        <MessageSquare className="mr-1 h-4 w-4" />
                                                        Chat
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/commission/create?creator=${commission.creator.id}`}
                                                    >
                                                        Detail
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                        {commission.can_review && (
                                            <div className="mt-4 rounded-lg border border-dashed p-4">
                                                <p className="mb-2 flex items-center gap-1 text-sm font-medium">
                                                    <Star className="h-4 w-4 text-yellow-500" />
                                                    Beri ulasan untuk {commission.creator.name}
                                                </p>
                                                <Form
                                                    action="/reviews"
                                                    method="post"
                                                    className="flex flex-wrap items-end gap-3"
                                                >
                                                    <input
                                                        type="hidden"
                                                        name="commission_id"
                                                        value={commission.id}
                                                    />
                                                    <div>
                                                        <label className="text-xs text-muted-foreground">
                                                            Rating (1-5)
                                                        </label>
                                                        <select
                                                            name="rating"
                                                            required
                                                            className="mt-1 flex h-9 rounded-md border border-input bg-background px-2 text-sm"
                                                            defaultValue="5"
                                                        >
                                                            {[5, 4, 3, 2, 1].map((n) => (
                                                                <option key={n} value={n}>
                                                                    {n} bintang
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="min-w-[200px] flex-1">
                                                        <label className="text-xs text-muted-foreground">
                                                            Komentar (opsional)
                                                        </label>
                                                        <input
                                                            name="comment"
                                                            className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                                                            placeholder="Pengalaman Anda..."
                                                        />
                                                    </div>
                                                    <Button type="submit" size="sm">
                                                        Kirim ulasan
                                                    </Button>
                                                </Form>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="py-12 text-center">
                            <p className="mb-4 text-muted-foreground">Belum ada komisi di tab ini.</p>
                            <Button asChild className="bg-gradient-to-r from-primary to-secondary">
                                <Link href="/commission/create">Buat Komisi</Link>
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
