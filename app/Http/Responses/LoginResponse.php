<?php

namespace App\Http\Responses;

use App\Support\RedirectsUsersByRole;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $path = RedirectsUsersByRole::pathFor($request->user());

        return $request->wantsJson()
            ? new JsonResponse('', 204)
            : redirect()->intended($path);
    }
}
