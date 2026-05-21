<?php

namespace App\Http\Controllers\Hub;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\CreatorCardResource;
use App\Models\Favorite;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExploreController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $query = User::query()
            ->where('role', UserRole::Creator)
            ->where('is_active', true)
            ->with(['profile', 'creatorProfile', 'portfolioItems' => fn ($q) => $q->orderBy('sort_order')->limit(1)]);

        if ($search = $request->string('q')->trim()->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('profile', fn ($p) => $p->where('username', 'like', "%{$search}%"));
            });
        }

        if ($category = $request->string('category')->trim()->toString()) {
            if ($category !== 'all' && $category !== '') {
                $query->whereHas('creatorProfile', fn ($q) => $q->where('specialty', 'like', '%'.str_replace('-', ' ', $category).'%'));
            }
        }

        $creators = $query->latest()->paginate(12)->withQueryString();

        $favoriteIds = [];
        if ($request->user()) {
            $favoriteIds = Favorite::query()
                ->where('user_id', $request->user()->id)
                ->pluck('creator_id')
                ->all();
        }

        return Inertia::render('hub/explore', [
            'creators' => CreatorCardResource::collection($creators)->additional([
                'meta' => [
                    'current_page' => $creators->currentPage(),
                    'last_page' => $creators->lastPage(),
                    'total' => $creators->total(),
                ],
            ]),
            'favoriteIds' => $favoriteIds,
            'filters' => [
                'q' => $search ?? '',
                'category' => $category ?? '',
            ],
        ]);
    }
}
