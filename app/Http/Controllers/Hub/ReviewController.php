<?php

namespace App\Http\Controllers\Hub;

use App\Enums\CommissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\CreatorProfile;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'commission_id' => ['required', 'exists:commissions,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $commission = Commission::query()->findOrFail($validated['commission_id']);

        if ($commission->buyer_id !== $request->user()->id) {
            abort(403);
        }

        if ($commission->status !== CommissionStatus::Completed) {
            return back()->with('error', 'Ulasan hanya dapat diberikan setelah komisi selesai.');
        }

        if (Review::query()->where('commission_id', $commission->id)->exists()) {
            return back()->with('error', 'Anda sudah memberikan ulasan untuk komisi ini.');
        }

        Review::create([
            'commission_id' => $commission->id,
            'reviewer_id' => $request->user()->id,
            'creator_id' => $commission->creator_id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        $profile = CreatorProfile::query()->firstOrCreate(
            ['user_id' => $commission->creator_id],
            ['specialty' => '', 'starting_price' => 0, 'skills' => [], 'languages' => ['Indonesian']],
        );

        $reviews = Review::query()->where('creator_id', $commission->creator_id);
        $count = $reviews->count();
        $avg = round($reviews->avg('rating'), 2);

        $profile->update([
            'reviews_count' => $count,
            'rating_avg' => $avg,
        ]);

        return back()->with('success', 'Terima kasih! Ulasan Anda telah disimpan.');
    }
}
