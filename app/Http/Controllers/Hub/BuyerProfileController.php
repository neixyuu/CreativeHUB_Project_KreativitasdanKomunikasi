<?php

namespace App\Http\Controllers\Hub;

use App\Enums\CommissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Commission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BuyerProfileController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user();
        $profile = $user->ensureProfile();

        $commissions = Commission::query()
            ->where('buyer_id', $user->id)
            ->with('creator.profile')
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('hub/profile', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'username' => $profile->username,
                'avatar' => $user->displayAvatar(),
                'bio' => $profile->bio,
                'location' => $profile->location,
                'phone' => $profile->phone,
                'member_since' => $user->created_at->format('M Y'),
            ],
            'stats' => [
                'total_commissions' => Commission::where('buyer_id', $user->id)->count(),
                'completed' => Commission::where('buyer_id', $user->id)
                    ->where('status', CommissionStatus::Completed)
                    ->count(),
            ],
            'recentCommissions' => $commissions->map(fn ($c) => [
                'id' => $c->id,
                'title' => $c->title,
                'status' => $c->status->value,
                'creator_name' => $c->creator->name,
            ]),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $profile = $user->ensureProfile();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'location' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        $user->update(['name' => $validated['name']]);

        $profileData = [
            'bio' => $validated['bio'] ?? null,
            'location' => $validated['location'] ?? null,
            'phone' => $validated['phone'] ?? null,
        ];

        if ($request->hasFile('avatar')) {
            if ($profile->avatar && ! str_starts_with($profile->avatar, 'http')) {
                Storage::disk('public')->delete($profile->avatar);
            }
            $profileData['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $profile->update($profileData);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }
}
