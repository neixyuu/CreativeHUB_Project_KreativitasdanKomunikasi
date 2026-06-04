<?php

namespace Tests\Feature;

use App\Models\CreatorProfile;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreatorRoutesTest extends TestCase
{
    use RefreshDatabase;

    public function test_creator_dashboard_route_is_not_treated_as_public_profile(): void
    {
        $user = User::factory()->creator()->create();
        Profile::create(['user_id' => $user->id, 'username' => 'realcreator']);
        CreatorProfile::create(['user_id' => $user->id, 'specialty' => 'Designer']);

        $this->actingAs($user)
            ->get('/creator/dashboard')
            ->assertOk();
    }

    public function test_reserved_creator_paths_do_not_match_username_route(): void
    {
        $creator = User::factory()->creator()->create();
        Profile::create(['user_id' => $creator->id, 'username' => 'realcreator']);
        CreatorProfile::create(['user_id' => $creator->id, 'specialty' => 'Designer']);

        $this->actingAs($creator)->get('/creator/orders')->assertOk();
        $this->actingAs($creator)->get('/creator/services')->assertOk();
        $this->actingAs($creator)->get('/creator/portfolio')->assertOk();
        $response = $this->actingAs($creator)->get('/creator/messages');
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('creator/messages', false)
            ->where('messagesPath', '/creator/messages'));
    }
}
