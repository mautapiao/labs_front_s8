import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,                 // Componente independiente (sin módulos)
  imports: [CommonModule, FormsModule, RouterLink], // Importa lo necesario para usar formularios y rutas
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';    // Usuario ingresado
  password = '';    // Contraseña ingresada
  errorMessage = ''; // Mensaje de error para mostrar en pantalla

  constructor(private authService: AuthService) { } // Servicio de autenticación

  onLogin(): void {
    // Valida que ambos campos estén completos
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    // Llama al servicio para verificar credenciales
    const success = this.authService.login(this.username, this.password);

    if (success) {
      // Muestra mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Inicio de sesión exitoso',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      // Muestra error por credenciales incorrectas
      this.errorMessage = 'Usuario o contraseña incorrectos';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Credenciales inválidas. Intenta con admin/1234',
        confirmButtonColor: '#dc3545'
      });
    }
  }
}
