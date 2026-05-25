<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginRedirectTest extends TestCase
{
    use RefreshDatabase;

    public function test_buyer_login_redirects_to_dashboard_inertia(): void
    {
        $user = User::factory()->create(['role' => UserRole::Buyer]);

        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ], [
            'X-Inertia' => 'true',
            'Accept' => 'text/html, application/xhtml+xml',
        ])->assertRedirect('/dashboard');
    }

    public function test_creator_login_redirects_to_creator_dashboard_inertia(): void
    {
        $user = User::factory()->creator()->create();

        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ], [
            'X-Inertia' => 'true',
            'Accept' => 'text/html, application/xhtml+xml',
        ])->assertRedirect('/creator/dashboard');
    }

    public function test_creator_can_load_dashboard_after_login(): void
    {
        $user = User::factory()->creator()->create();

        $this->actingAs($user)
            ->get('/creator/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('creator/dashboard'));
    }

    public function test_buyer_can_load_dashboard_after_login(): void
    {
        $user = User::factory()->create(['role' => UserRole::Buyer]);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('hub/dashboard'));
    }
}
