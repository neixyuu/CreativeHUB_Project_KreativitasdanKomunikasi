<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\AuthRedirect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($user = $request->user()) {
            return redirect($this->homePathFor($user));
        }

        return Inertia::render('welcome');
    }

    private function homePathFor(User $user): string
    {
        return AuthRedirect::pathFor($user);
    }
}
