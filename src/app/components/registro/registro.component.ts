import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { passwordMatchValidator } from '../../validators/varios.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  isSubmitting = false;
  mostrarPassword = false;
  mostrarConfirmarPassword = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.registroForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(150)
      ]],
      rut: ['', [
        Validators.required,
        Validators.maxLength(15)
      ]],
      dv: ['', [
        Validators.required,
        Validators.maxLength(1)
      ]],
      nombreUsuario: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      nombres: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      paterno: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      materno: ['', [
        Validators.maxLength(100)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmarPassword: ['', [
        Validators.required
      ]],
      aceptarTerminos: [false, [
        Validators.requiredTrue
      ]]
    }, {
      validators: passwordMatchValidator('password', 'confirmarPassword')
    });
  }

  // Getters para facilitar acceso a los controles
  get f() {
    return this.registroForm.controls;
  }

  toggleMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleMostrarConfirmarPassword(): void {
    this.mostrarConfirmarPassword = !this.mostrarConfirmarPassword;
  }

  formatearRut(): void {
    const rut = this.f['rut'].value;
    // Eliminar cualquier caracter no numérico
    const rutLimpio = rut.replace(/\D/g, '');
    this.f['rut'].setValue(rutLimpio);
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Formulario Incompleto',
        text: 'Por favor completa todos los campos correctamente',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    this.isSubmitting = true;

    // Preparar datos para enviar
    const usuarioData = {
      ...this.registroForm.value, // copia todas las propiedades del formulario dentro del objeto usuarioData.
      rolModel: {
        id: 2 // e correjir por defecto todos rol 2
      }
    };

    /**  la opcion 2 sin usar ... propagación
    const usuarioData = {
      nombre: this.registroForm.value.nombre,
      apellido: this.registroForm.value.apellido,
      email: this.registroForm.value.email,
      password: this.registroForm.value.password,
      rolModel: {
        id: 2
      }
    };
    */

    // Eliminar campo que no se envía al backend
    delete usuarioData.aceptarTerminos;

    this.usuarioService.registrarUsuario(usuarioData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'success',
          title: '¡Registro Exitoso!',
          text: 'Usuario registrado correctamente',
          confirmButtonColor: '#198754',
          confirmButtonText: 'Ir al Login'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error en registro:', error);

        let mensajeError = 'No fue posible completar el registro. Si el problema persiste, contacte soporte.';

        if (error.status === 400) {
          mensajeError = 'Datos inválidos. Verifica la información ingresada';
        } else if (error.status === 409) {
          mensajeError = 'El email, RUT o nombre de usuario ya está registrado';
        } else if (error.error?.message) {
          mensajeError = error.error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error al Registrar',
          text: mensajeError,
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  // Métodos auxiliares para mostrar errores
  hasError(controlName: string, errorType: string): boolean {
    const control = this.registroForm.get(controlName);
    return !!(control?.hasError(errorType) && (control?.dirty || control?.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.registroForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `No debe exceder ${maxLength} caracteres`;
    }
    if (control?.hasError('rutInvalido')) {
      return 'RUT inválido (debe tener 7 u 8 dígitos)';
    }
    if (control?.hasError('dvInvalido')) {
      return 'Dígito verificador inválido';
    }

    return '';
  }

  getPasswordMatchError(): string {
    if (this.registroForm.hasError('passwordMismatch') &&
      this.f['confirmarPassword'].touched) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }
}