<?php

namespace App\Http\Responses;

use App\Support\RedirectsUsersByRole;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request)
    {
        $path = RedirectsUsersByRole::pathFor($request->user());

        return $request->wantsJson()
            ? new JsonResponse('', 201)
            : redirect()->intended($path);
    }
}
