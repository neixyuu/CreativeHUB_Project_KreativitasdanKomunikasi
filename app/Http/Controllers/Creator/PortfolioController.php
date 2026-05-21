<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function index(Request $request): Response
    {
        $items = $request->user()->portfolioItems()->orderBy('sort_order')->get();

        return Inertia::render('creator/portfolio', [
            'portfolio' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image_url' => ['required', 'url', 'max:500'],
        ]);

        $request->user()->portfolioItems()->create([
            ...$validated,
            'sort_order' => $request->user()->portfolioItems()->count(),
        ]);

        return back()->with('success', 'Portfolio ditambahkan.');
    }

    public function update(Request $request, PortfolioItem $portfolioItem)
    {
        $this->authorizeItem($request, $portfolioItem);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image_url' => ['required', 'url', 'max:500'],
        ]);

        $portfolioItem->update($validated);

        return back()->with('success', 'Portfolio diperbarui.');
    }

    public function destroy(Request $request, PortfolioItem $portfolioItem)
    {
        $this->authorizeItem($request, $portfolioItem);
        $portfolioItem->delete();

        return back()->with('success', 'Portfolio dihapus.');
    }

    private function authorizeItem(Request $request, PortfolioItem $item): void
    {
        if ($item->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
