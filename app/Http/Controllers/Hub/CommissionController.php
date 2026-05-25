<?php

namespace App\Http\Controllers\Hub;

use App\Enums\CommissionStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use App\Services\ChatService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CommissionController extends Controller
{
    public function __construct(private ChatService $chat) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $status = $request->string('status')->toString();

        $query = Commission::query()
            ->where('buyer_id', $user->id)
            ->with(['creator.profile', 'conversation']);

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $commissionRows = $query->latest()->get();

        $reviewedIds = Review::query()
            ->whereIn('commission_id', $commissionRows->pluck('id'))
            ->pluck('commission_id')
            ->all();

        $commissions = $commissionRows->map(fn ($c) => [
            'id' => $c->id,
            'title' => $c->title,
            'category' => $c->category,
            'status' => $c->status->value,
            'status_label' => ucfirst(str_replace('_', ' ', $c->status->value)),
            'progress' => $c->progress,
            'deadline' => $c->deadline?->format('M d, Y'),
            'budget' => $c->budget,
            'conversation_id' => $c->conversation?->id,
            'can_review' => $c->status === CommissionStatus::Completed
                && ! in_array($c->id, $reviewedIds, true),
            'creator' => [
                'id' => $c->creator->id,
                'name' => $c->creator->name,
                'username' => $c->creator->profile?->username,
                'avatar' => $c->creator->displayAvatar(),
            ],
        ]);

        return Inertia::render('hub/commissions', [
            'commissions' => $commissions,
            'activeTab' => $status ?: 'all',
        ]);
    }

    public function create(Request $request): Response
    {
        $creators = User::query()
            ->where('role', UserRole::Creator)
            ->where('is_active', true)
            ->with('profile')
            ->orderBy('name')
            ->get()
            ->map(fn ($u) => ['id' => $u->id, 'name' => $u->name, 'username' => $u->profile?->username]);

        $services = [];
        if ($creatorId = $request->integer('creator')) {
            $services = Service::query()
                ->where('user_id', $creatorId)
                ->where('is_active', true)
                ->get()
                ->map(fn ($s) => ['id' => $s->id, 'title' => $s->title, 'price' => $s->price]);
        }

        return Inertia::render('hub/commission-create', [
            'creators' => $creators,
            'services' => $services,
            'categories' => config('marketplace.commission_categories', []),
            'prefill' => [
                'creator_id' => $request->integer('creator') ?: null,
                'service_id' => $request->integer('service') ?: null,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->merge([
            'service_id' => $request->input('service_id') ?: null,
        ]);

        $validated = $request->validate([
            'creator_id' => ['required', 'exists:users,id'],
            'service_id' => ['nullable', 'exists:services,id'],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100', Rule::in(config('marketplace.commission_categories', []))],
            'description' => ['required', 'string'],
            'budget' => ['nullable', 'integer', 'min:0'],
            'deadline' => ['nullable', 'date', 'after:today'],
        ]);

        $creator = User::query()->where('role', UserRole::Creator)->findOrFail($validated['creator_id']);

        $commission = Commission::create([
            'buyer_id' => $request->user()->id,
            'creator_id' => $creator->id,
            'service_id' => $validated['service_id'] ?? null,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'description' => $validated['description'],
            'budget' => $validated['budget'] ?? null,
            'deadline' => $validated['deadline'] ?? null,
            'status' => CommissionStatus::Pending,
            'progress' => 0,
        ]);

        $conversation = $this->chat->findOrCreateBetween($request->user(), $creator, $commission->id);
        $conversation->update(['commission_id' => $commission->id]);

        $this->chat->sendMessage(
            $conversation,
            $request->user(),
            "Halo! Saya mengajukan komisi baru: {$commission->title}",
        );

        return redirect()->route('hub.commissions')->with('success', 'Komisi berhasil diajukan. Kreator akan menghubungi Anda via chat.');
    }
}
