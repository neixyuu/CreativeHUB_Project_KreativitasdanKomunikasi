<?php

use App\Http\Controllers\Creator\CreatorDashboardController;
use App\Http\Controllers\Creator\CreatorOrderController;
use App\Http\Controllers\Creator\PortfolioController;
use App\Http\Controllers\Creator\ServiceController;
use App\Http\Controllers\Hub\BuyerDashboardController;
use App\Http\Controllers\Hub\BuyerProfileController;
use App\Http\Controllers\Hub\ChatController;
use App\Http\Controllers\Hub\CommissionController;
use App\Http\Controllers\Hub\CreatorPublicController;
use App\Http\Controllers\Hub\ExploreController;
use App\Http\Controllers\Hub\FavoriteController;
use App\Http\Controllers\Creator\CreatorMarketplaceProfileController;
use App\Http\Controllers\Hub\HomeController;
use App\Http\Controllers\Hub\NotificationController;
use App\Http\Controllers\Hub\ReportController;
use App\Http\Controllers\Hub\ReviewController;
use App\Http\Controllers\Hub\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', WelcomeController::class)->name('welcome');

/*
|--------------------------------------------------------------------------
| Rute kreator (statis) harus didaftarkan SEBELUM /creator/{username}
| agar "/creator/dashboard" tidak tertangkap sebagai username "dashboard".
|--------------------------------------------------------------------------
*/
Route::prefix('creator')->middleware(['auth', 'verified', 'role:creator'])->name('creator.')->group(function () {
    Route::get('/dashboard', CreatorDashboardController::class)->name('dashboard');
    Route::get('/orders', [CreatorOrderController::class, 'index'])->name('orders');
    Route::patch('/orders/{commission}', [CreatorOrderController::class, 'updateStatus'])->name('orders.update');
    Route::get('/services', [ServiceController::class, 'index'])->name('services');
    Route::post('/services', [ServiceController::class, 'store'])->name('services.store');
    Route::patch('/services/{service}', [ServiceController::class, 'update'])->name('services.update');
    Route::delete('/services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');
    Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio');
    Route::post('/portfolio', [PortfolioController::class, 'store'])->name('portfolio.store');
    Route::patch('/portfolio/{portfolioItem}', [PortfolioController::class, 'update'])->name('portfolio.update');
    Route::delete('/portfolio/{portfolioItem}', [PortfolioController::class, 'destroy'])->name('portfolio.destroy');
    Route::get('/messages', [ChatController::class, 'index'])->name('messages');
    Route::get('/marketplace-profile', [CreatorMarketplaceProfileController::class, 'edit'])->name('marketplace-profile');
    Route::post('/marketplace-profile', [CreatorMarketplaceProfileController::class, 'update'])->name('marketplace-profile.update');
    Route::redirect('/profile', '/creator/marketplace-profile')->name('profile');
    Route::redirect('/settings', '/settings/profile')->name('settings');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', HomeController::class)->name('home');

    Route::inertia('/about', 'hub/about')->name('about');
    Route::inertia('/contact', 'hub/contact')->name('contact');

    Route::get('/explore', ExploreController::class)->name('explore');

    Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');

    Route::middleware(['role:buyer'])->group(function () {
        Route::get('/dashboard', BuyerDashboardController::class)->name('dashboard');
        Route::get('/dashboard/profile', [BuyerProfileController::class, 'show'])->name('hub.profile');
        Route::post('/dashboard/profile', [BuyerProfileController::class, 'update'])->name('hub.profile.update');
        Route::get('/dashboard/commissions', [CommissionController::class, 'index'])->name('hub.commissions');
        Route::get('/commission/create', [CommissionController::class, 'create'])->name('commission.create');
        Route::post('/commission/create', [CommissionController::class, 'store'])->name('commission.store');
        Route::get('/dashboard/favorites', [FavoriteController::class, 'index'])->name('hub.favorites');
        Route::post('/favorites/toggle', [FavoriteController::class, 'toggle'])->name('hub.favorites.toggle');
        Route::get('/dashboard/notifications', [NotificationController::class, 'index'])->name('hub.notifications');
    });

    Route::get('/dashboard/messages', [ChatController::class, 'index'])->name('hub.messages');
    Route::get('/dashboard/messages/{conversation}/poll', [ChatController::class, 'poll'])->name('hub.messages.poll');
    Route::post('/dashboard/messages', [ChatController::class, 'store'])->name('hub.messages.store');
    Route::post('/chat/start', [ChatController::class, 'start'])->name('hub.chat.start');

    Route::redirect('/dashboard/settings', '/settings/profile')->name('hub.settings');

    Route::get('/creator/{username}', [CreatorPublicController::class, 'show'])
        ->name('creator.profile')
        ->where('username', '^(?!dashboard|orders|services|portfolio|messages|profile|settings|marketplace-profile)[a-zA-Z0-9_-]+$');
});
