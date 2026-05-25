import { createInertiaApp, router } from '@inertiajs/react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import AdminLayout from '@/layouts/admin-layout';
import CreatorHubLayout from '@/layouts/creator-hub-layout';
import HubLayout from '@/layouts/hub-layout';
import PublicLayout from '@/layouts/public-layout';
import WelcomeLayout from '@/layouts/welcome-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Creative Hub';

const pages = import.meta.glob('./pages/**/*.tsx');

type FlashProps = {
    flash?: { success?: string; error?: string };
};

type AuthLayoutMeta = {
    title?: string;
    description?: string;
};

type LayoutComponent = React.ComponentType<{ children: ReactNode }>;

class InertiaErrorBoundary extends Component<
    { children: ReactNode },
    { error: Error | null }
> {
    state = { error: null as Error | null };

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Inertia render error:', error, info);
    }

    render() {
        if (this.state.error) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-background p-6">
                    <div className="max-w-lg rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
                        <h1 className="mb-2 text-lg font-semibold text-destructive">
                            Terjadi kesalahan di halaman
                        </h1>
                        <p className="mb-4 text-muted-foreground">
                            Muat ulang halaman. Jika masih gagal, jalankan{' '}
                            <code className="rounded bg-muted px-1">npm run build</code>{' '}
                            lalu pastikan{' '}
                            <code className="rounded bg-muted px-1">APP_URL</code> di .env
                            sama dengan URL browser (mis. http://127.0.0.1:8000).
                        </p>
                        <pre className="overflow-auto rounded bg-muted p-3 text-xs">
                            {this.state.error.message}
                        </pre>
                        <button
                            type="button"
                            className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
                            onClick={() => window.location.reload()}
                        >
                            Muat ulang
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

router.on('navigate', (event) => {
    const flash = (event.detail.page.props as FlashProps).flash;

    if (flash?.success) {
        toast.success(flash.success);
    }

    if (flash?.error) {
        toast.error(flash.error);
    }
});

function layoutFor(name: string): LayoutComponent | LayoutComponent[] {
    switch (true) {
        case name === 'welcome':
            return WelcomeLayout;
        case name === 'home':
        case name === 'hub/explore':
        case name === 'hub/creator-profile':
        case name === 'hub/about':
        case name === 'hub/contact':
            return PublicLayout;
        case name.startsWith('auth/'):
            return AuthLayout;
        case name.startsWith('settings/'):
            return [AppLayout, SettingsLayout];
        case name.startsWith('admin/'):
            return AdminLayout;
        case name.startsWith('hub/'):
            return HubLayout;
        case name.startsWith('creator/'):
            return CreatorHubLayout;
        default:
            return AppLayout;
    }
}

function applyLayout(
    name: string,
    page: { layout?: unknown },
    LayoutComponent: LayoutComponent | LayoutComponent[],
) {
    const meta = page.layout as AuthLayoutMeta | undefined;

    if (name.startsWith('auth/') && meta?.title !== undefined) {
        page.layout = (children: ReactNode) => (
            <AuthLayout title={meta.title} description={meta.description}>
                {children}
            </AuthLayout>
        );

        return;
    }

    if (Array.isArray(LayoutComponent)) {
        page.layout = (children: ReactNode) =>
            LayoutComponent.reduceRight(
                (child, Layout) => <Layout>{child}</Layout>,
                children,
            );

        return;
    }

    page.layout = (children: ReactNode) => (
        <LayoutComponent>{children}</LayoutComponent>
    );
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        const path = `./pages/${name}.tsx`;
        const loader = pages[path];

        if (!loader) {
            throw new Error(`Halaman Inertia tidak ditemukan: ${name}`);
        }

        const module = await loader();
        const page = module.default;

        applyLayout(name, page, layoutFor(name));

        return page;
    },
    strictMode: false,
    withApp(app) {
        return (
            <InertiaErrorBoundary>
                <TooltipProvider delayDuration={0}>
                    {app}
                    <Toaster />
                </TooltipProvider>
            </InertiaErrorBoundary>
        );
    },
    progress: {
        color: '#7c3aed',
    },
});

initializeTheme();
