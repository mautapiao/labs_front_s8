import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { ActualizarPerfil, Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;

  isLoading = true;
  isSubmitting = false;

  usuarioActual: Usuario | null = null;

  // Inyecta los servicios necesarios y al iniciar el componente
  // inicializa los formularios y carga los datos del usuario.
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.inicializarFormularios(); // Crea y configura los formularios
    this.cargarDatosUsuario();     // Obtiene y carga la información del usuario
  }

  inicializarFormularios(): void {
    // Formulario de datos personales
    this.perfilForm = this.fb.group({
      email: [{ value: '', disabled: true }], // Email NO editable
      rut: [{ value: '', disabled: true }],    // RUT NO editable
      dv: [{ value: '', disabled: true }],     // DV NO editable
      nombreUsuario: [{ value: '', disabled: true }], // Usuario NO editable
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
      rol: [{ value: '', disabled: true }],    // Rol NO editable
      fechaCreacion: [{ value: '', disabled: true }] // Fecha NO editable
    });

  }

  cargarDatosUsuario(): void {
    this.isLoading = true;
    const email = this.authService.getUserEmail();

    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el email del usuario',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    // Obtener datos del usuario por email
    this.usuarioService.buscarPorEmail(email).subscribe({
      next: (usuario) => {
        this.usuarioActual = usuario;
        this.cargarFormulario(usuario);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos del usuario',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  cargarFormulario(usuario: Usuario): void {


    // Cargar datos en el formulario
    this.perfilForm.patchValue({
      email: usuario.email,
      rut: usuario.rut,
      dv: usuario.dv,
      nombreUsuario: usuario.nombreUsuario,
      nombres: usuario.nombres,
      paterno: usuario.paterno,
      materno: usuario.materno || '',
      rol: usuario.rolModel?.nombre || 'N/A',
    });
  }

  // Ese método es un getter que devuelve los controls del formulario
  //  para poder acceder a ellos de forma más corta y sencilla desde el HTML.
  get f() {
    return this.perfilForm.controls;
  }

  onSubmitPerfil(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Formulario Incompleto',
        text: 'Por favor completa todos los campos correctamente',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    if (!this.usuarioActual?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo identificar el usuario',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    Swal.fire({
      title: '¿Actualizar Perfil?',
      text: '¿Estás seguro de guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarPerfil();
      }
    });
  }

  actualizarPerfil(): void {
    this.isSubmitting = true;

    // Preparar objeto simple con los 3 campos
    const datosActualizados: ActualizarPerfil = {
      nombres: this.f['nombres'].value.trim(),
      paterno: this.f['paterno'].value.trim(),
      materno: this.f['materno'].value?.trim() || null
    };

    console.log('Enviando al backend:', datosActualizados);

    this.usuarioService.actualizarPerfil(this.usuarioActual!.id!, datosActualizados).subscribe({
      next: (usuarioActualizado) => {
        this.isSubmitting = false;
        this.usuarioActual = usuarioActualizado;

        console.log('Respuesta del backend:', usuarioActualizado);

        Swal.fire({
          icon: 'success',
          title: '¡Perfil Actualizado!',
          html: `
            <p class="mb-2">Tus datos se han actualizado correctamente:</p>
            <ul class="text-start list-unstyled">
              <li><strong>Nombres:</strong> ${usuarioActualizado.nombres}</li>
              <li><strong>Apellido Paterno:</strong> ${usuarioActualizado.paterno}</li>
              <li><strong>Apellido Materno:</strong> ${usuarioActualizado.materno || 'N/A'}</li>
            </ul>
          `,
          confirmButtonColor: '#198754',
          timer: 3000
        });

        this.cargarFormulario(usuarioActualizado);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error al actualizar:', error);

        let mensajeError = 'No se pudieron actualizar los datos';

        if (error.error?.message) {
          mensajeError = error.error.message;
        } else if (typeof error.error === 'string') {
          mensajeError = error.error;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error al Actualizar',
          html: mensajeError,
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  cancelarEdicion(): void {
    if (this.usuarioActual) {
      this.cargarFormulario(this.usuarioActual);
      Swal.fire({
        icon: 'info',
        title: 'Cambios Descartados',
        text: 'Se han restaurado los datos originales',
        timer: 1500,
        showConfirmButton: false
      });
    }
  }



  // Verifica si un control del formulario tiene un error específico
  // y solo lo muestra si el usuario ya interactuó con él (dirty o touched).
  // touched a entrar o salir del campo , el usuario interactuo con el input
  // dirty al cambiar el valor, el usuario modificó el contenido
  hasError(controlName: string, errorType: string): boolean {
    const control = this.perfilForm.get(controlName);
    return !!(control?.hasError(errorType) && (control?.dirty || control?.touched));
  }

  // Devuelve el mensaje de error correspondiente según la validación
  // que falle en el control (required, maxlength, etc.).
  getErrorMessage(controlName: string): string {
    const control = this.perfilForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `No debe exceder ${maxLength} caracteres`;
    }

    return '';
  }

  /**
   *  uso de comillas 
   * ' comilla simple string simples ej: return 'Este campo es obligatorio';
   * " comilla doble string simples /json ej: ts const saludo = "Hola";
   * ` backtick string con variables y multilinea ej:  return `No debe exceder ${maxLength} caracteres`;
   **/

}

