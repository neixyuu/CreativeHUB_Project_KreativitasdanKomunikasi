<?php

namespace Tests\Feature\Hub;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WelcomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_view_welcome_page(): void
    {
        $this->get(route('welcome'))->assertOk();
    }

    public function test_guests_cannot_access_home_and_are_redirected_to_welcome(): void
    {
        $this->get(route('home'))->assertRedirect(route('welcome'));
    }

    public function test_authenticated_users_visiting_welcome_are_redirected_to_home(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('welcome'))
            ->assertRedirect('/dashboard');
    }
}
