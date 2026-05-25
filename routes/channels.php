<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('conversation.{conversationId}', function ($user, int $conversationId) {
    return Conversation::query()
        ->where('id', $conversationId)
        ->whereHas('participants', fn ($q) => $q->where('users.id', $user->id))
        ->exists();
});
