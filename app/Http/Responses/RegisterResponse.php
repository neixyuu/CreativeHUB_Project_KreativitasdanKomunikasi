<?php

namespace App\Http\Responses;

use App\Support\AuthRedirect;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request)
    {
        $target = AuthRedirect::pathFor($request->user());

        if ($request->wantsJson()) {
            return new JsonResponse('', 201);
        }

        return redirect()->intended($target);
    }
}
