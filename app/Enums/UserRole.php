<?php

namespace App\Enums;

enum UserRole: string
{
    case Buyer = 'buyer';
    case Creator = 'creator';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Buyer => 'Pembeli',
            self::Creator => 'Kreator',
            self::Admin => 'Admin',
        };
    }

    public function isAdmin(): bool
    {
        return $this === self::Admin;
    }

    public function isCreator(): bool
    {
        return $this === self::Creator;
    }
}
