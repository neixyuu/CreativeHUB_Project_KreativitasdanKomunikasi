<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class CreatorCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $creator = $this->creatorProfile;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->profile?->username,
            'avatar' => $this->displayAvatar(),
            'specialty' => $creator?->specialty,
            'location' => $this->profile?->location,
            'rating' => (float) ($creator?->rating_avg ?? 0),
            'reviews' => $creator?->reviews_count ?? 0,
            'starting_price' => $creator?->starting_price ?? 0,
            'skills' => $creator?->skills ?? [],
            'portfolio' => $this->portfolioItems->first()?->image_url,
        ];
    }
}
