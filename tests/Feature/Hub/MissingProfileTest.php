<?php

namespace Tests\Feature\Hub;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MissingProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_buyer_without_profile_can_open_dashboard(): void
    {
        $user = User::factory()->create();
        Profile::query()->where('user_id', $user->id)->delete();

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk();

        $this->assertDatabaseHas('profiles', ['user_id' => $user->id]);
    }
}
