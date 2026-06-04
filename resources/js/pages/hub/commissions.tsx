import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Eye,
    MessageSquare,
    Plus,
    Search,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Commission = {
    id: number;
    conversation_id: number | null;
    title: string;
    category: string;
    status: string;
    status_label: string;
    progress: number;
    deadline: string | null;
    budget: number | null;
    creator: {
        name: string;
        username: string | null;
        avatar: string;
        specialty: string | null;
    };
};

type Props = {
    commissions: Commission[];
    activeTab: string;
};

function formatPrice(price: number | null) {
    if (price == null) {
        return '—';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'in_progress':
            return {
                label: 'In Progress',
                className: 'bg-blue-100 text-blue-700',
                icon: Clock,
            };
        case 'review':
            return {
                label: 'Under Review',
                className: 'bg-yellow-100 text-yellow-700',
                icon: AlertCircle,
            };
        case 'completed':
            return {
                label: 'Completed',
                className: 'bg-green-100 text-green-700',
                icon: CheckCircle,
            };
        default:
            return {
                label: 'Pending',
                className: 'bg-gray-100 text-gray-700',
                icon: Clock,
            };
    }
}

export default function CommissionsPage() {
    const { commissions, activeTab: initialTab } = usePage<Props>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState(initialTab || 'all');

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.get(
            '/dashboard/commissions',
            { status: tab === 'all' ? undefined : tab },
            { preserveState: true },
        );
    };

    const filteredCommissions = commissions.filter((commission) => {
        const matchesSearch =
            commission.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            commission.creator.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesTab =
            activeTab === 'all' || commission.status === activeTab;

        return matchesSearch && matchesTab;
    });

    const activeCount = commissions.filter(
        (c) => c.status === 'in_progress' || c.status === 'review',
    ).length;
    const completedCount = commissions.filter(
        (c) => c.status === 'completed',
    ).length;

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="mb-2 text-2xl font-bold lg:text-3xl">
                        My Commissions
                    </h1>
                    <p className="text-muted-foreground">
                        Lacak dan kelola proyek komisi Anda
                    </p>
                </div>
                <Button
                    asChild
                    className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                    <Link href="/commission/create">
                        <Plus className="h-4 w-4" />
                        New Commission
                    </Link>
                </Button>
            </div>

            <div className="mb-8 grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-primary">
                            {commissions.length}
                        </p>
                        <p className="text-sm text-muted-foreground">Total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            {activeCount}
                        </p>
                        <p className="text-sm text-muted-foreground">Active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {completedCount}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Completed
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search commissions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="space-y-6"
            >
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                    <TabsTrigger value="review">Review</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                    {filteredCommissions.length > 0 ? (
                        filteredCommissions.map((commission) => {
                            const statusBadge = getStatusBadge(
                                commission.status,
                            );

                            return (
                                <Card
                                    key={commission.id}
                                    className="transition-shadow hover:shadow-md"
                                >
                                    <CardContent className="p-4 lg:p-6">
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                                            <div className="flex flex-1 items-center gap-4">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage
                                                        src={
                                                            commission.creator
                                                                .avatar
                                                        }
                                                        alt={
                                                            commission.creator
                                                                .name
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {commission.creator.name.charAt(
                                                            0,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate font-semibold">
                                                        {commission.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            commission.creator
                                                                .name
                                                        }
                                                        {commission.creator
                                                            .specialty &&
                                                            ` • ${commission.creator.specialty}`}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:gap-8">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge.className}`}
                                                >
                                                    <statusBadge.icon className="h-3 w-3" />
                                                    {statusBadge.label}
                                                </span>

                                                {commission.status !==
                                                    'completed' && (
                                                    <div className="w-full sm:w-32">
                                                        <div className="mb-1 flex items-center justify-between text-xs">
                                                            <span className="text-muted-foreground">
                                                                Progress
                                                            </span>
                                                            <span className="font-medium">
                                                                {
                                                                    commission.progress
                                                                }
                                                                %
                                                            </span>
                                                        </div>
                                                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                                            <div
                                                                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                                                                style={{
                                                                    width: `${commission.progress}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="text-right">
                                                    <p className="font-semibold text-primary">
                                                        {formatPrice(
                                                            commission.budget,
                                                        )}
                                                    </p>
                                                    {commission.deadline && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Due:{' '}
                                                            {
                                                                commission.deadline
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/creator/${commission.creator.username ?? ''}`}
                                                        >
                                                            <Eye className="mr-1 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={
                                                                commission.conversation_id
                                                                    ? `/dashboard/messages?conversation=${commission.conversation_id}`
                                                                    : '/dashboard/messages'
                                                            }
                                                        >
                                                            <MessageSquare className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="py-12 text-center">
                            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold">
                                Tidak ada komisi
                            </h3>
                            <p className="mb-4 text-muted-foreground">
                                {activeTab === 'all'
                                    ? 'Mulai komisi pertama Anda'
                                    : `Tidak ada komisi dengan status ${activeTab.replace('_', ' ')}`}
                            </p>
                            <Button
                                asChild
                                className="bg-gradient-to-r from-primary to-secondary"
                            >
                                <Link href="/commission/create">
                                    Create Commission
                                </Link>
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
