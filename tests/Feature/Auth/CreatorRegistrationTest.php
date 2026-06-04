<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use Tests\TestCase;

class CreatorRegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());
    }

    public function test_creator_is_redirected_to_creator_dashboard_after_register(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Creator User',
            'email' => 'creator@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'account_type' => 'creator',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/creator/dashboard');

        $user = User::where('email', 'creator@example.com')->first();
        $this->assertTrue($user->isCreator());
    }
}
