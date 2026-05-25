<?php

namespace Tests\Feature\Hub;

use App\Enums\CommissionStatus;
use App\Enums\UserRole;
use App\Models\Commission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HubPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_buyer_can_view_notifications_page(): void
    {
        $buyer = User::factory()->create();

        $this->actingAs($buyer)
            ->get(route('hub.notifications'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('hub/notifications'));
    }

    public function test_creator_messages_use_creator_layout_page(): void
    {
        $creator = User::factory()->creator()->create();

        $this->actingAs($creator)
            ->get(route('creator.messages'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('creator/messages')
                ->where('messagesBaseUrl', '/creator/messages'));
    }

    public function test_buyer_can_submit_review_for_completed_commission(): void
    {
        $buyer = User::factory()->create();
        $creator = User::factory()->creator()->create();

        $commission = Commission::query()->create([
            'buyer_id' => $buyer->id,
            'creator_id' => $creator->id,
            'title' => 'Logo Design',
            'category' => 'Design',
            'description' => 'Test commission',
            'status' => CommissionStatus::Completed,
            'progress' => 100,
        ]);

        $this->actingAs($buyer)
            ->post(route('reviews.store'), [
                'commission_id' => $commission->id,
                'rating' => 5,
                'comment' => 'Bagus sekali!',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('reviews', [
            'commission_id' => $commission->id,
            'rating' => 5,
        ]);

        $creator->refresh();
        $this->assertSame(1, $creator->creatorProfile->reviews_count);
        $this->assertEquals(5.0, (float) $creator->creatorProfile->rating_avg);
    }

    public function test_contact_page_is_accessible_when_authenticated(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('contact'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('hub/contact'));
    }

    public function test_creator_can_edit_marketplace_profile(): void
    {
        $creator = User::factory()->creator()->create();

        $this->actingAs($creator)
            ->get(route('creator.marketplace-profile'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('creator/marketplace-profile'));

        $this->actingAs($creator)
            ->post(route('creator.marketplace-profile.update'), [
                'specialty' => 'UI Design',
                'starting_price' => 150000,
                'bio' => 'Designer profesional',
                'skills' => 'Figma, Photoshop',
                'languages' => 'Indonesian, English',
                'is_accepting_orders' => true,
            ])
            ->assertRedirect();

        $creator->refresh();
        $this->assertSame('UI Design', $creator->creatorProfile->specialty);
        $this->assertContains('Figma', $creator->creatorProfile->skills);
    }
}
