<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreatorMarketplaceProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $user->loadMissing(['profile', 'creatorProfile']);
        $user->ensureCreatorProfile();

        $cp = $user->creatorProfile;

        return Inertia::render('creator/marketplace-profile', [
            'profile' => [
                'username' => $user->profile?->username,
                'bio' => $user->profile?->bio,
                'location' => $user->profile?->location,
                'specialty' => $cp?->specialty ?? '',
                'starting_price' => $cp?->starting_price ?? 0,
                'response_time' => $cp?->response_time,
                'skills' => $cp?->skills ?? [],
                'languages' => $cp?->languages ?? ['Indonesian'],
                'is_accepting_orders' => $cp?->is_accepting_orders ?? true,
            ],
            'categories' => config('marketplace.explore_categories', []),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $user->ensureCreatorProfile();

        $skillsInput = $request->input('skills');
        $languagesInput = $request->input('languages');

        $request->merge([
            'skills' => is_array($skillsInput)
                ? $skillsInput
                : array_values(array_filter(array_map('trim', explode(',', (string) $skillsInput)))),
            'languages' => is_array($languagesInput)
                ? $languagesInput
                : array_values(array_filter(array_map('trim', explode(',', (string) $languagesInput)))),
            'is_accepting_orders' => $request->boolean('is_accepting_orders'),
        ]);

        $validated = $request->validate([
            'bio' => ['nullable', 'string', 'max:1000'],
            'location' => ['nullable', 'string', 'max:255'],
            'specialty' => ['required', 'string', 'max:255'],
            'starting_price' => ['required', 'integer', 'min:0'],
            'response_time' => ['nullable', 'string', 'max:100'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:100'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:50'],
            'is_accepting_orders' => ['boolean'],
        ]);

        $user->profile?->update([
            'bio' => $validated['bio'] ?? null,
            'location' => $validated['location'] ?? null,
        ]);

        $user->creatorProfile->update([
            'specialty' => $validated['specialty'],
            'starting_price' => $validated['starting_price'],
            'response_time' => $validated['response_time'] ?? null,
            'skills' => array_values($validated['skills'] ?? []),
            'languages' => array_values($validated['languages'] ?? ['Indonesian']),
            'is_accepting_orders' => $validated['is_accepting_orders'] ?? true,
        ]);

        return back()->with('success', 'Profil marketplace berhasil disimpan.');
    }
}
