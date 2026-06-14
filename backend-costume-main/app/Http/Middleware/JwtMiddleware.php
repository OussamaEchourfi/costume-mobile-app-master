<?php

namespace App\Http\Middleware;

use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtMiddleware
{
    public function __construct(private JwtService $jwtService)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $token = $this->getTokenFromRequest($request);

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token d\'authentification manquant'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Valider le token
        if (!$this->jwtService->validateToken($token)) {
            return response()->json([
                'success' => false,
                'message' => 'Token invalide ou expiré'
            ], Response::HTTP_UNAUTHORIZED);
        }


        $user = $this->jwtService->getUserFromToken($token);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $request->merge(['user' => $user]);
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        // Ajouter le token à la requête pour usage ultérieur
        $request->merge(['jwt_token' => $token]);

        return $next($request);
    }

    private function getTokenFromRequest(Request $request): ?string
    {

        $header = $request->header('Authorization');

        if (!$header) {
            return null;
        }

        if (preg_match('/Bearer\s+(.*)$/i', $header, $matches)) {
            return $matches[1];
        }

        return null;
    }
}
