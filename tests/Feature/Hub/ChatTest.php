<?php

namespace Tests\Feature\Hub;

use App\Enums\UserRole;
use App\Models\Conversation;
use App\Models\User;
use App\Services\ChatService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_participant_can_send_and_poll_messages(): void
    {
        $buyer = User::factory()->create(['role' => UserRole::Buyer]);
        $creator = User::factory()->create(['role' => UserRole::Creator]);

        $conversation = app(ChatService::class)->findOrCreateBetween($buyer, $creator);

        $this->actingAs($buyer)
            ->postJson('/dashboard/messages', [
                'conversation_id' => $conversation->id,
                'body' => 'Halo kreator!',
            ])
            ->assertOk()
            ->assertJsonPath('message.body', 'Halo kreator!');

        $this->actingAs($creator)
            ->getJson("/dashboard/messages/{$conversation->id}/poll?after=0")
            ->assertOk()
            ->assertJsonCount(1, 'messages')
            ->assertJsonPath('messages.0.body', 'Halo kreator!');
    }

    public function test_non_participant_cannot_poll_conversation(): void
    {
        $buyer = User::factory()->create(['role' => UserRole::Buyer]);
        $creator = User::factory()->create(['role' => UserRole::Creator]);
        $stranger = User::factory()->create(['role' => UserRole::Buyer]);

        $conversation = Conversation::create();
        $conversation->participants()->attach([$buyer->id, $creator->id]);

        $this->actingAs($stranger)
            ->getJson("/dashboard/messages/{$conversation->id}/poll")
            ->assertForbidden();
    }
}
