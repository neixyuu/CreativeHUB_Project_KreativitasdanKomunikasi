<?php

namespace App\Http\Controllers\Hub;

use App\Enums\CommissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Commission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $commissions = Commission::query()
            ->where('buyer_id', $user->id)
            ->with(['creator.profile'])
            ->latest('updated_at')
            ->limit(30)
            ->get();

        $notifications = $commissions->map(function (Commission $c) {
            $statusLabel = match ($c->status) {
                CommissionStatus::Pending => 'Menunggu konfirmasi kreator',
                CommissionStatus::InProgress => 'Sedang dikerjakan',
                CommissionStatus::Review => 'Siap untuk Anda tinjau',
                CommissionStatus::Completed => 'Komisi selesai',
                CommissionStatus::Cancelled => 'Komisi dibatalkan',
                default => 'Status diperbarui',
            };

            return [
                'id' => 'commission-'.$c->id,
                'title' => $c->title,
                'message' => $statusLabel.' · '.$c->creator->name,
                'time' => $c->updated_at->diffForHumans(),
                'href' => '/dashboard/commissions?status='.$c->status->value,
                'read' => in_array($c->status, [CommissionStatus::Completed, CommissionStatus::Cancelled], true),
            ];
        });

        return Inertia::render('hub/notifications', [
            'notifications' => $notifications,
            'unreadCount' => $notifications->where('read', false)->count(),
        ]);
    }
}
