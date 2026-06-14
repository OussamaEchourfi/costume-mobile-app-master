<?php

namespace App\Providers;

use App\Repositories\Contracts\JwtRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\CostumeRepository;
use App\Repositories\JwtRepository;
use App\Repositories\UserRepository;
use App\Services\AuthService;
use App\Services\JwtService;
use App\Services\UserService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind des interfaces DAO
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(JwtRepositoryInterface::class, JwtRepository::class);
        $this->app->bind(
            \App\Repositories\Contracts\CostumeRepositoryInterface::class,
            CostumeRepository::class
        );
        $this->app->singleton(JwtService::class, function ($app) {
            return new JwtService(
                $app->make(JwtRepositoryInterface::class),
                $app->make(UserRepositoryInterface::class)
            );
        });

        $this->app->singleton(AuthService::class, function ($app) {
            return new AuthService(
                $app->make(UserRepositoryInterface::class),
                $app->make(JwtService::class)
            );
        });

        $this->app->singleton(UserService::class, function ($app) {
            return new UserService(
                $app->make(UserRepositoryInterface::class)
            );
        });
    }

    public function boot(): void
    {
        //
    }
}
