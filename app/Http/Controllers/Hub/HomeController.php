<?php

namespace App\Http\Controllers\Hub;

use App\Enums\CommissionStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\CreatorCardResource;
use App\Models\Commission;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $featured = User::query()
            ->where('role', UserRole::Creator)
            ->where('is_active', true)
            ->with(['profile', 'creatorProfile', 'portfolioItems' => fn ($q) => $q->orderBy('sort_order')->limit(1)])
            ->leftJoin('creator_profiles', 'users.id', '=', 'creator_profiles.user_id')
            ->orderByDesc('creator_profiles.rating_avg')
            ->select('users.*')
            ->limit(4)
            ->get();

        $creatorCount = User::query()
            ->where('role', UserRole::Creator)
            ->where('is_active', true)
            ->count();

        $completedProjects = Commission::query()
            ->where('status', CommissionStatus::Completed)
            ->count();

        $avgRating = User::query()
            ->where('role', UserRole::Creator)
            ->whereHas('creatorProfile', fn ($q) => $q->where('rating_avg', '>', 0))
            ->with('creatorProfile')
            ->get()
            ->avg(fn ($u) => $u->creatorProfile?->rating_avg ?? 0);

        return Inertia::render('home', [
            'featuredCreators' => CreatorCardResource::collection($featured),
            'stats' => [
                'creators' => $creatorCount,
                'projects' => $completedProjects,
                'avg_rating' => round((float) $avgRating, 1),
            ],
        ]);
    }
}
