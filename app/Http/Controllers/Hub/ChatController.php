<?php

namespace App\Http\Controllers\Hub;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Services\ChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
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

        $list = $conversations->map(fn (Conversation $conv) => $this->formatConversationSummary($conv, $user));

        $activeId = $request->integer('conversation') ?: ($list->first()['id'] ?? null);
        $messages = [];
        $activePartner = null;

        if ($activeId) {
            $conv = $this->findParticipantConversation($user, $activeId);
            $other = $conv->participants->firstWhere('id', '!=', $user->id);
            $activePartner = [
                'id' => $other?->id,
                'name' => $other?->name,
                'avatar' => $other?->displayAvatar(),
            ];

            $messages = $conv->messages->map(fn ($m) => $this->formatMessage($m, $user));
        }

        $isCreatorView = $request->routeIs('creator.messages');
        $messagesBaseUrl = $isCreatorView ? '/creator/messages' : '/dashboard/messages';

        return Inertia::render($isCreatorView ? 'creator/messages' : 'hub/messages', [
            'conversations' => $list,
            'activeConversationId' => $activeId,
            'activePartner' => $activePartner,
            'messages' => $messages,
            'messagesBaseUrl' => $messagesBaseUrl,
        ]);
    }

    public function poll(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();
        $this->ensureParticipant($user, $conversation);

        $afterId = $request->integer('after', 0);

        $messages = $conversation->messages()
            ->with('sender')
            ->when($afterId > 0, fn ($q) => $q->where('id', '>', $afterId))
            ->orderBy('created_at')
            ->get()
            ->map(fn ($m) => $this->formatMessage($m, $user));

        $conversations = null;
        if ($request->boolean('conversations')) {
            $conversations = Conversation::query()
                ->whereHas('participants', fn ($q) => $q->where('users.id', $user->id))
                ->with([
                    'participants.profile',
                    'messages' => fn ($q) => $q->latest()->limit(1),
                ])
                ->orderByDesc('last_message_at')
                ->get()
                ->map(fn (Conversation $conv) => $this->formatConversationSummary($conv, $user));
        }

        return response()->json([
            'messages' => $messages,
            'conversations' => $conversations,
        ]);
    }

    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'conversation_id' => ['required', 'exists:conversations,id'],
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $user = $request->user();
        $conversation = $this->findParticipantConversation($user, (int) $validated['conversation_id']);

        $message = $this->chat->sendMessage($conversation, $user, $validated['body']);
        $message->load('sender');

        if ($request->wantsJson()) {
            return response()->json([
                'message' => $this->formatMessage($message, $user),
            ]);
        }

        $route = $user->role === UserRole::Creator ? 'creator.messages' : 'hub.messages';

        return redirect()->route($route, ['conversation' => $conversation->id]);
    }

    public function start(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $user = $request->user();
        $other = User::query()->findOrFail($validated['user_id']);

        if ($other->id === $user->id) {
            return back()->with('error', 'Tidak dapat memulai chat dengan diri sendiri.');
        }

        $conversation = $this->chat->findOrCreateBetween($user, $other);

        $route = $user->role === UserRole::Creator ? 'creator.messages' : 'hub.messages';

        return redirect()->route($route, ['conversation' => $conversation->id]);
    }

    private function findParticipantConversation(User $user, int $conversationId): Conversation
    {
        return Conversation::query()
            ->whereHas('participants', fn ($q) => $q->where('users.id', $user->id))
            ->with(['messages.sender.profile', 'participants.profile'])
            ->findOrFail($conversationId);
    }

    private function ensureParticipant(User $user, Conversation $conversation): void
    {
        if (! $conversation->participants()->where('users.id', $user->id)->exists()) {
            abort(403);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function formatConversationSummary(Conversation $conv, User $user): array
    {
        $other = $conv->participants->firstWhere('id', '!=', $user->id);
        $last = $conv->messages->first();

        return [
            'id' => $conv->id,
            'name' => $other?->name ?? 'Unknown',
            'username' => $other?->profile?->username,
            'avatar' => $other?->displayAvatar(),
            'last_message' => $last?->body ?? 'Belum ada pesan',
            'time' => $last?->created_at?->diffForHumans() ?? '',
            'unread' => false,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formatMessage(Message $message, User $user): array
    {
        return [
            'id' => $message->id,
            'body' => $message->body,
            'is_mine' => $message->user_id === $user->id,
            'time' => $message->created_at->format('H:i'),
            'sender_name' => $message->sender->name,
        ];
    }
}
