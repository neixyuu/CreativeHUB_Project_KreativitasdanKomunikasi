<?php

namespace App\Http\Controllers\Creator;

use App\Enums\CommissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Commission;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CreatorOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Commission::query()
            ->where('creator_id', $request->user()->id)
            ->with('buyer.profile')
            ->latest()
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'title' => $c->title,
                'client' => $c->buyer->name,
                'status' => $c->status->value,
                'progress' => $c->progress,
                'budget' => $c->budget,
                'deadline' => $c->deadline?->format('M d, Y'),
            ]);

        return Inertia::render('creator/orders', [
            'orders' => $orders,
        ]);
    }

    public function updateStatus(Request $request, Commission $commission)
    {
        if ($commission->creator_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['required', Rule::enum(CommissionStatus::class)],
            'progress' => ['nullable', 'integer', 'min:0', 'max:100'],
        ]);

        $commission->update([
            'status' => $validated['status'],
            'progress' => $validated['progress'] ?? $commission->progress,
        ]);

        return back()->with('success', 'Status pesanan diperbarui.');
    }
}
