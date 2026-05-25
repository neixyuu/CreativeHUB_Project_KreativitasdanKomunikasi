<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        if ($user) {
            $user->loadMissing(['profile', 'creatorProfile']);
            $user->ensureProfile();

            if ($user->isCreator()) {
                $user->ensureCreatorProfile();
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                    'username' => $user->profile?->username,
                    'avatar' => $user->displayAvatar(),
                    'bio' => $user->profile?->bio,
                    'location' => $user->profile?->location,
                    'is_creator' => $user->isCreator(),
                    'is_admin' => $user->isAdmin(),
                    'email_verified_at' => $user->email_verified_at,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
