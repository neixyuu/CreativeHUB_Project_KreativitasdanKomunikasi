<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\CreatorProfile;
use App\Models\Message;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    private function createCreator(string $username = 'seller1'): User
    {
        $creator = User::factory()->creator()->create();
        Profile::create(['user_id' => $creator->id, 'username' => $username]);
        CreatorProfile::create(['user_id' => $creator->id, 'specialty' => 'Designer']);

        return $creator;
    }

    public function test_buyer_can_start_chat_with_creator(): void
    {
        $buyer = User::factory()->buyer()->create();
        $creator = $this->createCreator();

        $this->actingAs($buyer)
            ->post(route('hub.chat.start'), ['user_id' => $creator->id])
            ->assertRedirect(route('hub.messages', ['conversation' => Conversation::first()->id]));

        $this->assertDatabaseCount('conversations', 1);
        $this->assertDatabaseHas('conversation_participants', [
            'user_id' => $buyer->id,
        ]);
        $this->assertDatabaseHas('conversation_participants', [
            'user_id' => $creator->id,
        ]);
    }

    public function test_buyer_can_send_first_message_when_starting_chat(): void
    {
        $buyer = User::factory()->buyer()->create();
        $creator = $this->createCreator();

        $this->actingAs($buyer)
            ->post(route('hub.chat.start'), [
                'user_id' => $creator->id,
                'body' => 'Halo, apakah Anda tersedia?',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('messages', [
            'user_id' => $buyer->id,
            'body' => 'Halo, apakah Anda tersedia?',
        ]);
    }

    public function test_buyer_can_send_message_in_existing_conversation(): void
    {
        $buyer = User::factory()->buyer()->create();
        $creator = $this->createCreator();

        $this->actingAs($buyer)->post(route('hub.chat.start'), ['user_id' => $creator->id]);
        $conversation = Conversation::first();

        $this->actingAs($buyer)
            ->post(route('hub.messages.store'), [
                'conversation_id' => $conversation->id,
                'body' => 'Pesan lanjutan',
            ])
            ->assertRedirect(route('hub.messages', ['conversation' => $conversation->id]));

        $this->assertSame(1, Message::where('body', 'Pesan lanjutan')->count());
    }

    public function test_creator_cannot_start_chat_via_buyer_route(): void
    {
        $creator = $this->createCreator('creatorA');
        $other = $this->createCreator('creatorB');

        $this->actingAs($creator)
            ->post(route('hub.chat.start'), ['user_id' => $other->id])
            ->assertRedirect('/creator/dashboard');

        $this->assertDatabaseCount('conversations', 0);
    }

    public function test_buyer_cannot_chat_with_inactive_creator(): void
    {
        $buyer = User::factory()->buyer()->create();
        $creator = $this->createCreator();
        $creator->update(['is_active' => false]);

        $this->actingAs($buyer)
            ->post(route('hub.chat.start'), ['user_id' => $creator->id])
            ->assertNotFound();
    }
}
