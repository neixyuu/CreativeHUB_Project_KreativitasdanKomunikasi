<?php

namespace App\Http\Responses;

use App\Support\AuthRedirect;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;

class VerifyEmailResponse implements VerifyEmailResponseContract
{
    public function toResponse($request)
    {
        $path = AuthRedirect::pathFor($request->user());

        return $request->wantsJson()
            ? new JsonResponse('', 204)
            : redirect()->intended($path.(str_contains($path, '?') ? '&' : '?').'verified=1');
    }
}
