<?php

namespace App\Support;

use App\Enums\UserRole;
use App\Models\User;

class AuthRedirect
{
    public static function pathFor(?User $user): string
    {
        if (! $user) {
            return '/';
        }

        if (! $user->hasVerifiedEmail()) {
            return route('verification.notice', absolute: false);
        }

        return match ($user->role) {
            UserRole::Admin => '/admin',
            UserRole::Creator => '/creator/dashboard',
            default => '/dashboard',
        };
    }
}
