<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Enums\UserRole;
use App\Models\CreatorProfile;
use App\Models\Profile;
use App\Models\User;
use App\Support\UsernameGenerator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'account_type' => ['required', Rule::in(['buyer', 'creator'])],
        ])->validate();

        $role = $input['account_type'] === 'creator'
            ? UserRole::Creator
            : UserRole::Buyer;

        return DB::transaction(function () use ($input, $role) {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'role' => $role,
                'email_verified_at' => now(),
            ]);

            Profile::create([
                'user_id' => $user->id,
                'username' => UsernameGenerator::fromName($input['name'], $input['email']),
                'bio' => null,
                'location' => null,
            ]);

            if ($role === UserRole::Creator) {
                CreatorProfile::create([
                    'user_id' => $user->id,
                    'specialty' => 'Kreator Digital',
                    'starting_price' => 150000,
                    'response_time' => '24 jam',
                    'skills' => [],
                    'languages' => ['Indonesian'],
                ]);
            }

            return $user;
        });
    }
}
