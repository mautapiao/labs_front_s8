// import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
// al crear este guard:
// ng generate guard guards/auth
// se usara para evitar que el usuario logeado vuelva a la raiz
// se redireccionara a /clinica
// cuando se creo el guard se selecciono CanActivate
//
// info guards:
// https://angular.dev/guide/routing/route-guards

// Guard para rutas PÚBLICAS (login, home)
// Si está logueado redirige a /clinica
export const publicGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    router.navigate(['/clinica']);
    return false;
  }
  return true;
};

// Guard para rutas PRIVADAS (clinica)
// Si NO está logueado redirige a /login
export const privateGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};