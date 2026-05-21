<?php

namespace App\Http\Controllers\Creator;

use App\Enums\CommissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Commission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreatorDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $orders = Commission::query()
            ->where('creator_id', $user->id)
            ->with('buyer.profile')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'title' => $c->title,
                'client' => $c->buyer->name,
                'status' => $c->status->value,
                'budget' => $c->budget,
                'deadline' => $c->deadline?->format('M d, Y'),
            ]);

        return Inertia::render('creator/dashboard', [
            'stats' => [
                'active_orders' => Commission::where('creator_id', $user->id)->whereIn('status', [CommissionStatus::Pending, CommissionStatus::InProgress, CommissionStatus::Review])->count(),
                'completed' => Commission::where('creator_id', $user->id)->where('status', CommissionStatus::Completed)->count(),
                'earnings' => Commission::where('creator_id', $user->id)->where('status', CommissionStatus::Completed)->sum('budget'),
                'rating' => (float) ($user->creatorProfile?->rating_avg ?? 0),
            ],
            'orders' => $orders,
            'creator' => [
                'name' => $user->name,
                'specialty' => $user->creatorProfile?->specialty,
            ],
        ]);
    }
}
