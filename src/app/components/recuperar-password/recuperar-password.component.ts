import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.scss'
})
export class RecuperarPasswordComponent implements OnInit {
  recuperarForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.recuperarForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(150)
      ]]
    });
  }

  get f() {
    return this.recuperarForm.controls;
  }

  onSubmit(): void {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Email Inválido',
        text: 'Por favor ingresa un correo electrónico válido',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    this.isSubmitting = true;
    const email = this.f['email'].value;

    // verificar si el email existe en la base de datos backend
    this.usuarioService.buscarPorEmail(email).subscribe({
      
      // Si email encontrado status 200
      next: (usuario) => {
        this.isSubmitting = false;
        
        Swal.fire({
          icon: 'success',
          title: '¡Correo Enviado!',
          html: `
            <div class="text-start">
              <p class="mb-3">Se ha enviado un correo electrónico a:</p>
              <p class="fw-bold text-primary text-center">${email}</p>
              <hr class="my-3">
              <p class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Revisa tu bandeja de entrada</p>
              <p class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Verifica tu carpeta de spam</p>
              <p class="mb-0"><i class="bi bi-clock-fill text-info me-2"></i> El enlace es válido por 24 horas</p>
            </div>
          `,
          confirmButtonColor: '#198754',
          confirmButtonText: 'Entendido',
          allowOutsideClick: false
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      
      // email NO encontrado status 404
      error: (error) => {
        this.isSubmitting = false;

        if (error.status === 404) {
          // email no existe en la db backend
          Swal.fire({
            icon: 'warning',
            title: 'Email No Registrado',
            html: `
              <p class="mb-3">No existe una cuenta asociada al correo:</p>
              <p class="fw-bold text-danger">${email}</p>
              <hr class="my-3">
              <p class="text-muted mb-0">
                <i class="bi bi-info-circle me-2"></i>
                Verifica que el correo esté escrito correctamente o crea una nueva cuenta.
              </p>
            `,
            confirmButtonColor: '#ffc107',
            confirmButtonText: 'Verificar Email',
            showCancelButton: true,
            cancelButtonText: 'Crear Cuenta',
            cancelButtonColor: '#0d6efd'
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
              // Si hace clic en "Crear Cuenta"
              this.router.navigate(['/registro']);
            }
            // Si hace clic en verificar email se queda en el formulario
          });
        } else {
          // Otro  error 
          Swal.fire({
            icon: 'error',
            title: 'Error de Conexión',
            text: 'No se pudo conectar con el servidor. Intenta nuevamente.',
            confirmButtonColor: '#dc3545'
          });
        }
      }
    });
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.recuperarForm.get(controlName);
    return !!(control?.hasError(errorType) && (control?.dirty || control?.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.recuperarForm.get(controlName);

    if (control?.hasError('required')) {
      return 'El correo electrónico es obligatorio';
    }
    if (control?.hasError('email')) {
      return 'Ingresa un correo electrónico válido';
    }
    if (control?.hasError('maxlength')) {
      return 'El correo no debe exceder 150 caracteres';
    }

    return '';
  }
}
