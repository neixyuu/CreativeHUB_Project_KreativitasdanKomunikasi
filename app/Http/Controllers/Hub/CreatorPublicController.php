<?php

namespace App\Http\Controllers\Hub;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreatorPublicController extends Controller
{
    public function show(Request $request, string $username): Response
    {
        $creator = User::query()
            ->where('role', UserRole::Creator)
            ->where('is_active', true)
            ->whereHas('profile', fn ($q) => $q->where('username', $username))
            ->whereHas('creatorProfile')
            ->with(['profile', 'creatorProfile', 'services' => fn ($q) => $q->where('is_active', true), 'portfolioItems' => fn ($q) => $q->orderBy('sort_order')])
            ->firstOrFail();

        $isFavorite = false;
        if ($request->user()) {
            $isFavorite = Favorite::query()
                ->where('user_id', $request->user()->id)
                ->where('creator_id', $creator->id)
                ->exists();
        }

        $cp = $creator->creatorProfile;

        return Inertia::render('hub/creator-profile', [
            'creator' => [
                'id' => $creator->id,
                'name' => $creator->name,
                'username' => $creator->profile?->username,
                'avatar' => $creator->displayAvatar(),
                'cover_image' => $creator->portfolioItems->first()?->image_url,
                'specialty' => $cp?->specialty ?? 'Kreator',
                'location' => $creator->profile?->location,
                'rating' => (float) ($cp?->rating_avg ?? 0),
                'reviews' => $cp?->reviews_count ?? 0,
                'completed_projects' => $cp?->completed_projects ?? 0,
                'response_time' => $cp?->response_time,
                'bio' => $creator->profile?->bio,
                'skills' => $cp?->skills ?? [],
                'languages' => $cp?->languages ?? ['Indonesian'],
                'services' => $creator->services->map(fn ($s) => [
                    'id' => $s->id,
                    'title' => $s->title,
                    'category' => $s->category,
                    'description' => $s->description,
                    'price' => $s->price,
                    'delivery_days' => $s->delivery_days,
                    'revisions' => $s->revisions,
                ]),
                'portfolio' => $creator->portfolioItems->map(fn ($p) => [
                    'id' => $p->id,
                    'title' => $p->title,
                    'description' => $p->description,
                    'image' => $p->image_url,
                ]),
            ],
            'isFavorite' => $isFavorite,
            'canChat' => (bool) $request->user(),
            'canCommission' => (bool) $request->user() && $request->user()->isBuyer(),
        ]);
    }
}
