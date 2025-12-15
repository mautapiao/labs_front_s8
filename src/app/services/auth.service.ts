import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Interfaz para definir la estructura de un usuario
interface Usuario {
  id: number;
  username: string;
  password: string;
  rol: 'ADMIN' | 'USUARIO';
  email: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // Lista de usuarios disponibles
  private usuarios: Usuario[] = [
    {
      id: 1,
      username: 'admin',
      password: '1234',
      rol: 'ADMIN',
      email: 'admin@duocuc.cl'
    },
    {
      id: 2,
      username: 'usuario',
      password: '5678',
      rol: 'USUARIO',
      email: 'usuario@duocuc.cl'
    }
  ];

  // Usuario que esta logueado actualmente
  private usuarioActual: Usuario | null = null;

  constructor(private router: Router) {
    // Al iniciar, verificar si hay un usuario guardado en localStorage
    this.cargarUsuarioDelStorage();
  }

  // Cargar usuario del localStorage si existe
  private cargarUsuarioDelStorage(): void {
    const usuarioGuardado = localStorage.getItem('usuarioActual');
    if (usuarioGuardado) {
      this.usuarioActual = JSON.parse(usuarioGuardado);
    }
  }

  // Intentar login con username y password
  login(username: string, password: string): boolean {
    // Buscar el usuario en la lista
    const usuario = this.usuarios.find(
      u => u.username === username && u.password === password
    );

    // Si encontró el usuario
    if (usuario) {
      // Guardar usuario,sin contraseña por seguridad
      this.usuarioActual = {
        id: usuario.id,
        username: usuario.username,
        password: '', // No guardar contraseña
        rol: usuario.rol,
        email:usuario.email
      };

      // Guardar en localStorage
      localStorage.setItem('usuarioActual', JSON.stringify(this.usuarioActual));
      localStorage.setItem('isLoggedIn', 'true');

       // GUARDAR EMAIL por ahora hardcodeado, después vendrá del backend
       // localStorage.setItem('userEmail', 'mj.tapia.o@gmail.com');
      

      // Ir a clinica con navbar
      this.router.navigate(['/clinica']);
      return true;
    }

    // Si no encontró el usuario, retornar false
    return false;
  }

  // Cerrar sesión
  logout(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuarioActual');
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

  // Verificar si está logueado
  isLoggedIn(): boolean {
    return this.usuarioActual !== null;
  }

  // Obtener el nombre del usuario logueado
  getUsername(): string {
    return this.usuarioActual?.username || '';
  }

  // Obtener el rol del usuario logueado, que sirve oara 
  // mostrar  páginas dependiendo del rol ADMIN  USUARIO o usar los otros metodos 
  getRol(): string {
    return this.usuarioActual?.rol || '';
  }

  // obtener el email para etapa 2 autenticar con backend
   getUserEmail(): string {
    // return localStorage.getItem('userEmail') || '';
    return this.usuarioActual?.email || ''; 
   }

  // Verificar si es ADMIN
  esAdmin(): boolean {
    return this.usuarioActual?.rol === 'ADMIN';
  }

  // Verificar si es USUARIO
  esUsuario(): boolean {
    return this.usuarioActual?.rol === 'USUARIO';
  }

  // Obtener la información completa del usuario
  getUsuarioActual(): Usuario | null {
    return this.usuarioActual;
  }
}