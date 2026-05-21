<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(Request $request): Response
    {
        $role = $request->string('role')->toString();

        $query = User::query()
            ->where('role', '!=', UserRole::Admin)
            ->with('profile');

        if ($role && in_array($role, ['buyer', 'creator'], true)) {
            $query->where('role', $role);
        }

        $users = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/users', [
            'users' => $users->through(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role->value,
                'username' => $u->profile?->username,
                'is_active' => $u->is_active,
                'created_at' => $u->created_at->format('d M Y'),
            ]),
            'filters' => ['role' => $role],
        ]);
    }

    public function toggleActive(User $user)
    {
        if ($user->isAdmin()) {
            abort(403);
        }

        $user->update(['is_active' => ! $user->is_active]);

        return back()->with('success', 'Status pengguna diperbarui.');
    }
}
