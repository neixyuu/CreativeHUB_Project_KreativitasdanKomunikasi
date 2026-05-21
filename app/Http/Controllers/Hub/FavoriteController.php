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

class FavoriteController extends Controller
{
    public function index(Request $request): Response
    {
        $creatorIds = Favorite::query()
            ->where('user_id', $request->user()->id)
            ->pluck('creator_id');

        $creators = User::query()
            ->whereIn('id', $creatorIds)
            ->where('role', UserRole::Creator)
            ->with(['profile', 'creatorProfile', 'portfolioItems' => fn ($q) => $q->limit(1)])
            ->get();

        return Inertia::render('hub/favorites', [
            'creators' => CreatorCardResource::collection($creators),
        ]);
    }

    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'creator_id' => ['required', 'exists:users,id'],
        ]);

        $favorite = Favorite::query()
            ->where('user_id', $request->user()->id)
            ->where('creator_id', $validated['creator_id'])
            ->first();

        if ($favorite) {
            $favorite->delete();

            return back();
        }

        Favorite::create([
            'user_id' => $request->user()->id,
            'creator_id' => $validated['creator_id'],
        ]);

        return back();
    }
}
