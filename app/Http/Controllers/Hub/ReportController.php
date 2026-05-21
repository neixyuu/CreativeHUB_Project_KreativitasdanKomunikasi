<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', 'in:feedback,complaint,bug,other'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'reported_user_id' => ['nullable', 'exists:users,id'],
            'commission_id' => ['nullable', 'exists:commissions,id'],
        ]);

        Report::create([
            'reporter_id' => $request->user()->id,
            'reported_user_id' => $validated['reported_user_id'] ?? null,
            'commission_id' => $validated['commission_id'] ?? null,
            'type' => $validated['type'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
        ]);

        return back()->with('success', 'Laporan Anda telah dikirim. Admin akan meninjau segera.');
    }
}
