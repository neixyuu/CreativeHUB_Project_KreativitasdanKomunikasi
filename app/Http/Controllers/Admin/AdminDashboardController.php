<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CommissionStatus;
use App\Enums\ReportStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\Message;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_users' => User::where('role', '!=', UserRole::Admin)->count(),
                'buyers' => User::where('role', UserRole::Buyer)->count(),
                'creators' => User::where('role', UserRole::Creator)->count(),
                'active_commissions' => Commission::whereIn('status', [CommissionStatus::Pending, CommissionStatus::InProgress])->count(),
                'completed_commissions' => Commission::where('status', CommissionStatus::Completed)->count(),
                'open_reports' => Report::where('status', ReportStatus::Open)->count(),
                'messages_today' => Message::whereDate('created_at', today())->count(),
            ],
            'recentReports' => Report::with(['reporter.profile', 'reportedUser.profile'])
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn ($r) => [
                    'id' => $r->id,
                    'subject' => $r->subject,
                    'type' => $r->type,
                    'status' => $r->status->value,
                    'reporter' => $r->reporter->name,
                    'created_at' => $r->created_at->diffForHumans(),
                ]),
            'growth' => [
                'users_this_month' => User::whereMonth('created_at', now()->month)->where('role', '!=', UserRole::Admin)->count(),
                'commissions_this_month' => Commission::whereMonth('created_at', now()->month)->count(),
            ],
        ]);
    }
}
