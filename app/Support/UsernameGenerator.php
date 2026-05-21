<?php

namespace App\Support;

use App\Models\Profile;
use Illuminate\Support\Str;

class UsernameGenerator
{
    public static function fromName(string $name, ?string $email = null): string
    {
        $base = Str::slug(Str::lower($name), '');
        if ($base === '') {
            $base = Str::before($email ?? 'user', '@');
            $base = Str::slug($base, '') ?: 'user';
        }

        $username = $base;
        $suffix = 1;

        while (Profile::query()->where('username', $username)->exists()) {
            $username = $base.$suffix;
            $suffix++;
        }

        return $username;
    }
}
