import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Verificar si está logueado Y es admin
    if (this.authService.isLoggedIn() && this.authService.esAdmin()) {
      return true; // Permitir acceso
    }

    // Si no es admin, redirigir a clínica
    this.router.navigate(['/clinica']);
    return false; // Bloquear acceso
  }
}