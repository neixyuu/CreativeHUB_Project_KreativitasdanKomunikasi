<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UnverifiedLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_unverified_user_is_redirected_to_email_verification_after_login(): void
    {
        $user = User::factory()->unverified()->create();

        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ])
            ->assertRedirect(route('verification.notice'));

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertRedirect(route('verification.notice'));
    }
}
