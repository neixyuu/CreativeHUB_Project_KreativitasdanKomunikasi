<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class VerifyAllUserEmails extends Command
{
    protected $signature = 'users:verify-emails';

    protected $description = 'Tandai semua email pengguna sebagai terverifikasi (untuk development)';

    public function handle(): int
    {
        $count = User::query()
            ->whereNull('email_verified_at')
            ->update(['email_verified_at' => now()]);

        $this->info("{$count} akun ditandai terverifikasi.");

        return self::SUCCESS;
    }
}
