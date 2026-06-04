<?php

namespace App\Http\Controllers\Hub;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
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
            ->with(['profile', 'creatorProfile', 'services' => fn ($q) => $q->where('is_active', true), 'portfolioItems' => fn ($q) => $q->orderBy('sort_order')])
            ->firstOrFail();

        $isFavorite = false;
        if ($request->user()) {
            $isFavorite = \App\Models\Favorite::query()
                ->where('user_id', $request->user()->id)
                ->where('creator_id', $creator->id)
                ->exists();
        }

        $cp = $creator->creatorProfile;

        return Inertia::render('hub/creator-profile', [
            'creator' => [
                'id' => $creator->id,
                'name' => $creator->name,
                'username' => $creator->profile->username,
                'avatar' => $creator->displayAvatar(),
                'cover_image' => $creator->portfolioItems->first()?->image_url,
                'specialty' => $cp->specialty,
                'location' => $creator->profile->location,
                'rating' => (float) $cp->rating_avg,
                'reviews' => $cp->reviews_count,
                'completed_projects' => $cp->completed_projects,
                'response_time' => $cp->response_time,
                'bio' => $creator->profile->bio,
                'skills' => $cp->skills ?? [],
                'languages' => $cp->languages ?? [],
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
            'canChat' => $request->user()?->isBuyer() ?? false,
            'canCommission' => $request->user()?->isBuyer() ?? false,
        ]);
    }
}
