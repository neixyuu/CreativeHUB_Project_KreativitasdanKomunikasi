import type { User } from '@/types/auth';

export function dashboardPathFor(user: User | null | undefined): string {
    if (!user) {
        return '/login';
    }

    switch (user.role) {
        case 'admin':
            return '/admin';
        case 'creator':
            return '/creator/dashboard';
        default:
            return '/dashboard';
    }
}

export function profilePathFor(user: User | null | undefined): string {
    if (!user) {
        return '/login';
    }

    if (user.role === 'creator' && user.username) {
        return `/creator/${user.username}`;
    }

    return '/dashboard/profile';
}

export function settingsPathFor(user: User | null | undefined): string {
    return user ? '/dashboard/settings' : '/login';
}
