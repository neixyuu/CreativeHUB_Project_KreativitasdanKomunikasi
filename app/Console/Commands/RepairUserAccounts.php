<?php

namespace App\Console\Commands;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Console\Command;

class RepairUserAccounts extends Command
{
    protected $signature = 'users:repair';

    protected $description = 'Lengkapi profil & verifikasi email untuk akun yang belum lengkap (development)';

    public function handle(): int
    {
        $verified = 0;
        $profiles = 0;
        $creatorProfiles = 0;

        User::query()->whereNull('email_verified_at')->each(function (User $user) use (&$verified) {
            $user->forceFill(['email_verified_at' => now()])->save();
            $verified++;
        });

        User::query()->doesntHave('profile')->each(function (User $user) use (&$profiles) {
            $user->ensureProfile();
            $profiles++;
        });

        User::query()
            ->where('role', UserRole::Creator)
            ->doesntHave('creatorProfile')
            ->each(function (User $user) use (&$creatorProfiles) {
                $user->ensureCreatorProfile();
                $creatorProfiles++;
            });

        $this->info("Email diverifikasi: {$verified}");
        $this->info("Profil dibuat: {$profiles}");
        $this->info("Profil kreator dibuat: {$creatorProfiles}");

        return self::SUCCESS;
    }
}
