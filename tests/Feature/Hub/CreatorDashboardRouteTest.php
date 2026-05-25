<?php

namespace Tests\Feature\Hub;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreatorDashboardRouteTest extends TestCase
{
    use RefreshDatabase;

    public function test_creator_dashboard_is_not_treated_as_public_profile(): void
    {
        $creator = User::factory()->creator()->create([
            'email_verified_at' => now(),
        ]);

        $this->actingAs($creator)
            ->get('/creator/dashboard')
            ->assertOk();
    }
}
