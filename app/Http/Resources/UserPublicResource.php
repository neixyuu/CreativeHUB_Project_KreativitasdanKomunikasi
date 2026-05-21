<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserPublicResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->profile?->username,
            'avatar' => $this->displayAvatar(),
            'bio' => $this->profile?->bio,
            'location' => $this->profile?->location,
            'role' => $this->role->value,
            'is_creator' => $this->isCreator(),
        ];
    }
}
