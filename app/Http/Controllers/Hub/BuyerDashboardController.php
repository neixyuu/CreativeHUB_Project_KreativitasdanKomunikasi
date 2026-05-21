<?php

namespace App\Http\Controllers\Hub;

use App\Enums\CommissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\Conversation;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BuyerDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $activeCommissions = Commission::query()
            ->where('buyer_id', $user->id)
            ->whereIn('status', [CommissionStatus::Pending, CommissionStatus::InProgress, CommissionStatus::Review])
            ->with(['creator.profile'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($c) => $this->formatCommission($c));

        $recentMessages = Conversation::query()
            ->whereHas('participants', fn ($q) => $q->where('users.id', $user->id))
            ->with(['participants.profile', 'messages' => fn ($q) => $q->latest()->limit(1)])
            ->orderByDesc('last_message_at')
            ->limit(5)
            ->get()
            ->map(function (Conversation $conv) use ($user) {
                $other = $conv->participants->firstWhere('id', '!=', $user->id);
                $last = $conv->messages->first();

                return [
                    'id' => $conv->id,
                    'sender' => [
                        'name' => $other?->name,
                        'avatar' => $other?->displayAvatar(),
                    ],
                    'message' => $last?->body ?? '',
                    'time' => $last?->created_at?->diffForHumans() ?? '',
                    'unread' => false,
                ];
            });

        return Inertia::render('hub/dashboard', [
            'stats' => [
                'active' => Commission::where('buyer_id', $user->id)->whereIn('status', [CommissionStatus::InProgress, CommissionStatus::Review])->count(),
                'completed' => Commission::where('buyer_id', $user->id)->where('status', CommissionStatus::Completed)->count(),
                'favorites' => Favorite::where('user_id', $user->id)->count(),
                'messages' => Conversation::whereHas('participants', fn ($q) => $q->where('users.id', $user->id))->count(),
            ],
            'activeCommissions' => $activeCommissions,
            'recentMessages' => $recentMessages,
            'userName' => $user->name,
        ]);
    }

    private function formatCommission(Commission $c): array
    {
        return [
            'id' => $c->id,
            'title' => $c->title,
            'status' => $c->status->value,
            'status_label' => ucfirst(str_replace('_', ' ', $c->status->value)),
            'deadline' => $c->deadline?->format('M d, Y'),
            'progress' => $c->progress,
            'creator' => [
                'name' => $c->creator->name,
                'avatar' => $c->creator->displayAvatar(),
            ],
        ];
    }
}
