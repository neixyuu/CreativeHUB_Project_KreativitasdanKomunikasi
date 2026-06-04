<?php

namespace App\Support;

use App\Enums\UserRole;
use App\Models\User;

class RedirectsUsersByRole
{
    public static function pathFor(?User $user): string
    {
        return match ($user?->role) {
            UserRole::Admin => '/admin',
            UserRole::Creator => '/creator/dashboard',
            default => '/dashboard',
        };
    }
}
