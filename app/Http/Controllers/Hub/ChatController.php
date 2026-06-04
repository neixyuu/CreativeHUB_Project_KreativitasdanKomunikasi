<?php

namespace App\Http\Controllers\Hub;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\User;
use App\Services\ChatService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function __construct(private ChatService $chat) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        $conversations = Conversation::query()
            ->whereHas('participants', fn ($q) => $q->where('users.id', $user->id))
            ->with([
                'participants.profile',
                'messages' => fn ($q) => $q->latest()->limit(1),
            ])
            ->orderByDesc('last_message_at')
            ->get();

        $list = $conversations->map(function (Conversation $conv) use ($user) {
            $other = $conv->participants->firstWhere('id', '!=', $user->id);
            $last = $conv->messages->first();

            return [
                'id' => $conv->id,
                'name' => $other?->name,
                'username' => $other?->profile?->username,
                'avatar' => $other?->displayAvatar(),
                'last_message' => $last?->body ?? 'Belum ada pesan',
                'time' => $last?->created_at?->diffForHumans() ?? '',
                'unread' => false,
            ];
        });

        $activeId = $request->integer('conversation') ?: ($list->first()['id'] ?? null);
        $messages = [];
        $activePartner = null;

        if ($activeId) {
            $conv = Conversation::query()
                ->whereHas('participants', fn ($q) => $q->where('users.id', $user->id))
                ->with(['messages.sender.profile', 'participants.profile'])
                ->findOrFail($activeId);

            $other = $conv->participants->firstWhere('id', '!=', $user->id);
            $activePartner = [
                'id' => $other?->id,
                'name' => $other?->name,
                'avatar' => $other?->displayAvatar(),
            ];

            $messages = $conv->messages->map(fn ($m) => [
                'id' => $m->id,
                'body' => $m->body,
                'is_mine' => $m->user_id === $user->id,
                'time' => $m->created_at->format('H:i'),
                'sender_name' => $m->sender->name,
            ]);
        }

        $page = $user->isCreator() ? 'creator/messages' : 'hub/messages';

        return Inertia::render($page, [
            'conversations' => $list,
            'activeConversationId' => $activeId,
            'activePartner' => $activePartner,
            'messages' => $messages,
            'messagesPath' => $user->isCreator() ? '/creator/messages' : '/dashboard/messages',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'conversation_id' => ['required', 'exists:conversations,id'],
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $user = $request->user();
        $conversation = Conversation::query()
            ->whereHas('participants', fn ($q) => $q->where('users.id', $user->id))
            ->findOrFail($validated['conversation_id']);

        $this->chat->sendMessage($conversation, $user, $validated['body']);

        return redirect()->route($this->messagesRouteName($user), ['conversation' => $conversation->id]);
    }

    public function start(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'body' => ['nullable', 'string', 'max:5000'],
        ]);

        $user = $request->user();

        if (! $user->isBuyer()) {
            abort(403, 'Hanya pembeli yang dapat memulai chat dengan penjual.');
        }

        $creator = User::query()
            ->where('role', UserRole::Creator)
            ->where('is_active', true)
            ->findOrFail($validated['user_id']);

        $conversation = $this->chat->findOrCreateBetween($user, $creator);

        $body = trim($validated['body'] ?? '');
        if ($body !== '') {
            $this->chat->sendMessage($conversation, $user, $body);
        }

        return redirect()->route('hub.messages', ['conversation' => $conversation->id]);
    }

    private function messagesRouteName(User $user): string
    {
        return $user->isCreator() ? 'creator.messages' : 'hub.messages';
    }
}
