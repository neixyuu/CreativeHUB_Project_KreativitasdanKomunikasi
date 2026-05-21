<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $services = $request->user()->services()->latest()->get();

        return Inertia::render('creator/services', [
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'price' => ['required', 'integer', 'min:0'],
            'delivery_days' => ['required', 'integer', 'min:1'],
            'revisions' => ['required', 'integer', 'min:0'],
        ]);

        $request->user()->services()->create($validated);

        return back()->with('success', 'Layanan berhasil ditambahkan.');
    }

    public function update(Request $request, Service $service)
    {
        $this->authorizeService($request, $service);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'price' => ['required', 'integer', 'min:0'],
            'delivery_days' => ['required', 'integer', 'min:1'],
            'revisions' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $service->update($validated);

        return back()->with('success', 'Layanan diperbarui.');
    }

    public function destroy(Request $request, Service $service)
    {
        $this->authorizeService($request, $service);
        $service->delete();

        return back()->with('success', 'Layanan dihapus.');
    }

    private function authorizeService(Request $request, Service $service): void
    {
        if ($service->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
