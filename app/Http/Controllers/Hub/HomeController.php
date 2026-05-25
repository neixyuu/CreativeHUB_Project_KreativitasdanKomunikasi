<?php

namespace App\Http\Controllers\Hub;

use App\Enums\CommissionStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\CreatorCardResource;
use App\Models\Commission;
use App\Models\CreatorProfile;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $creators = User::query()
            ->where('role', UserRole::Creator)
            ->where('is_active', true)
            ->with(['profile', 'creatorProfile', 'portfolioItems' => fn ($q) => $q->orderBy('sort_order')->limit(1)])
            ->join('creator_profiles', 'creator_profiles.user_id', '=', 'users.id')
            ->orderByDesc('creator_profiles.rating_avg')
            ->select('users.*')
            ->limit(4)
            ->get();

        $creatorsCount = User::query()
            ->where('role', UserRole::Creator)
            ->where('is_active', true)
            ->count();

        $projectsCount = Commission::query()
            ->where('status', CommissionStatus::Completed)
            ->count();

        $avgRating = CreatorProfile::query()->avg('rating_avg');

        $categoryCounts = collect(config('marketplace.explore_categories', []))
            ->map(function (string $name) {
                $count = User::query()
                    ->where('role', UserRole::Creator)
                    ->where('is_active', true)
                    ->whereHas('creatorProfile', fn ($q) => $q->where('specialty', 'like', '%'.$name.'%'))
                    ->count();

                return [
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'count' => $count,
                ];
            })
            ->values()
            ->all();

        return Inertia::render('home', [
            'featuredCreators' => CreatorCardResource::collection($creators)->resolve(),
            'platformStats' => [
                'creators' => $creatorsCount,
                'projects' => $projectsCount,
                'avgRating' => $avgRating ? round((float) $avgRating, 1) : 0,
            ],
            'categoryCounts' => $categoryCounts,
        ]);
    }
}
