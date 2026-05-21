<?php

namespace Database\Seeders;

use App\Enums\CommissionStatus;
use App\Enums\UserRole;
use App\Models\Commission;
use App\Models\CreatorProfile;
use App\Models\PortfolioItem;
use App\Models\Profile;
use App\Models\Service;
use App\Models\User;
use App\Support\UsernameGenerator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MarketplaceSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin CreativeHub',
            'email' => 'admin@creativehub.test',
            'password' => Hash::make('password'),
            'role' => UserRole::Admin,
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $admin->id,
            'username' => 'admin',
        ]);

        $buyer = User::create([
            'name' => 'John Pembeli',
            'email' => 'buyer@creativehub.test',
            'password' => Hash::make('password'),
            'role' => UserRole::Buyer,
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $buyer->id,
            'username' => UsernameGenerator::fromName($buyer->name, $buyer->email),
            'bio' => 'Saya mencari jasa desain dan ilustrasi.',
            'location' => 'Jakarta',
        ]);

        $creators = [
            [
                'name' => 'Sarah Wijaya',
                'email' => 'sarah@creativehub.test',
                'username' => 'sarahdesigns',
                'specialty' => 'Graphic Designer',
                'location' => 'Jakarta',
                'starting_price' => 150000,
            ],
            [
                'name' => 'Andi Pratama',
                'email' => 'andi@creativehub.test',
                'username' => 'andiart',
                'specialty' => 'Illustrator',
                'location' => 'Bandung',
                'starting_price' => 200000,
            ],
        ];

        foreach ($creators as $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => UserRole::Creator,
                'email_verified_at' => now(),
            ]);

            Profile::create([
                'user_id' => $user->id,
                'username' => $data['username'],
                'bio' => 'Kreator profesional siap membantu proyek Anda.',
                'location' => $data['location'],
                'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
            ]);

            CreatorProfile::create([
                'user_id' => $user->id,
                'specialty' => $data['specialty'],
                'starting_price' => $data['starting_price'],
                'response_time' => '1 jam',
                'rating_avg' => 4.9,
                'reviews_count' => 50,
                'completed_projects' => 80,
                'skills' => ['Logo', 'Branding'],
                'languages' => ['Indonesian', 'English'],
            ]);

            Service::create([
                'user_id' => $user->id,
                'title' => 'Desain Logo Profesional',
                'category' => 'Logo Design',
                'description' => 'Logo custom dengan revisi.',
                'price' => $data['starting_price'],
                'delivery_days' => 5,
                'revisions' => 3,
            ]);

            PortfolioItem::create([
                'user_id' => $user->id,
                'title' => 'Portfolio Sample',
                'description' => 'Contoh karya',
                'image_url' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
            ]);
        }

        $sarah = User::where('email', 'sarah@creativehub.test')->first();

        Commission::create([
            'buyer_id' => $buyer->id,
            'creator_id' => $sarah->id,
            'title' => 'Logo Coffee Shop',
            'category' => 'Logo Design',
            'description' => 'Butuh logo minimalis untuk coffee shop.',
            'budget' => 350000,
            'deadline' => now()->addDays(14),
            'status' => CommissionStatus::InProgress,
            'progress' => 40,
        ]);
    }
}
