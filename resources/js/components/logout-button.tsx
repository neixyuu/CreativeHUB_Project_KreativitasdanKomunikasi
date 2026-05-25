import { router } from '@inertiajs/react';
import type { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    className?: string;
};

export function LogoutButton({ children, className }: Props) {
    return (
        <button
            type="button"
            className={className}
            onClick={() => router.post('/logout')}
        >
            {children}
        </button>
    );
}
