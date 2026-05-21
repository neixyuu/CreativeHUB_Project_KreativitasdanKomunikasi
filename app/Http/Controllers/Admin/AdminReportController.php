<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminReportController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        $query = Report::with(['reporter.profile', 'reportedUser.profile']);

        if ($status) {
            $query->where('status', $status);
        }

        $reports = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/reports', [
            'reports' => $reports->through(fn ($r) => [
                'id' => $r->id,
                'subject' => $r->subject,
                'message' => $r->message,
                'type' => $r->type,
                'status' => $r->status->value,
                'admin_notes' => $r->admin_notes,
                'reporter' => $r->reporter->name,
                'reported_user' => $r->reportedUser?->name,
                'created_at' => $r->created_at->format('d M Y H:i'),
            ]),
            'filters' => ['status' => $status],
        ]);
    }

    public function update(Request $request, Report $report)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:open,in_review,resolved,dismissed'],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $report->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? $report->admin_notes,
            'resolved_by' => in_array($validated['status'], ['resolved', 'dismissed'], true) ? $request->user()->id : null,
            'resolved_at' => in_array($validated['status'], ['resolved', 'dismissed'], true) ? now() : null,
        ]);

        return back()->with('success', 'Laporan diperbarui.');
    }
}
