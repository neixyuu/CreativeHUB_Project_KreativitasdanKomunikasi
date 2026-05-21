<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ChatService
{
    public function findOrCreateBetween(User $userA, User $userB, ?int $commissionId = null): Conversation
    {
        $existing = Conversation::query()
            ->whereHas('participants', fn ($q) => $q->where('users.id', $userA->id))
            ->whereHas('participants', fn ($q) => $q->where('users.id', $userB->id))
            ->when($commissionId, fn ($q) => $q->where('commission_id', $commissionId))
            ->first();

        if ($existing) {
            return $existing;
        }

        return DB::transaction(function () use ($userA, $userB, $commissionId) {
            $conversation = Conversation::create([
                'commission_id' => $commissionId,
            ]);

            $conversation->participants()->attach([$userA->id, $userB->id]);

            return $conversation;
        });
    }

    public function sendMessage(Conversation $conversation, User $sender, string $body): Message
    {
        $message = $conversation->messages()->create([
            'user_id' => $sender->id,
            'body' => $body,
        ]);

        $conversation->update(['last_message_at' => $message->created_at]);

        return $message;
    }
}
