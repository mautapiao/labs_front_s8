import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PacienteModel } from '../../../../models/paciente.model';
import { PacienteService } from '../../../../services/paciente.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente-create',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente-create.component.html',
  styleUrl: './paciente-create.component.scss'
})
export class PacienteCreateComponent {

  // Modelo a crear
  paciente: PacienteModel = {
    email: '',
  rut:'',
  dv: '',
  nombres: '',
  paterno: '',
  materno: '',
  telefono: ''

  };

  loading = false;
  errores: { [key: string]: string } = {};

  constructor(
    private pacienteSrv: PacienteService,
    private router: Router
  ) { }

  //===================================================================
  // Validar formulario
  // ===================================================================
  validar(): boolean {
    this.errores = {};

    if (!this.paciente.rut || this.paciente.rut.trim() === '') {
      this.errores['rut'] = 'El rut es requerido';
    }

    if (!this.paciente.dv || this.paciente.dv.trim() === '') {
      this.errores['dv'] = 'El dv es requerido';
    }

    if (!this.paciente.nombres || this.paciente.nombres.trim() === '') {
      this.errores['nombres'] = 'Los nombres son requerido';
    }
     if (!this.paciente.paterno || this.paciente.paterno.trim() === '') {
      this.errores['paterno'] = 'El apellido paterno es requerido';
    }
     if (!this.paciente.materno || this.paciente.materno.trim() === '') {
      this.errores['materno'] = 'El apellido materno es requerido';
    }
     if (!this.paciente.email || this.paciente.email.trim() === '') {
      this.errores['email'] = 'El email es requerido';
    }
 if (!this.paciente.telefono || this.paciente.telefono.trim() === '') {
      this.errores['telefono'] = 'El teléfono es requerido';
    }

    return Object.keys(this.errores).length === 0;
  }

  //===================================================================
  // Crear el registro
  // ===================================================================
  guardar(): void {
    if (!this.validar()) {
      Swal.fire({
        title: 'Errores en el formulario',
        html: Object.values(this.errores).join('<br>'),
        icon: 'error',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    this.loading = true;

    this.pacienteSrv.create(this.paciente).subscribe({
      next: (nuevoPaciente) => {
        this.loading = false;
        Swal.fire({
          title: '¡Éxito!',
          text: `"${nuevoPaciente.nombres}" ha sido creado correctamente`,
          icon: 'success',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['/pacientes']);
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al crear registro:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo crear el registro. Intenta de nuevo.',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  // ===================================================================
  // Cancelar y volver
  // ===================================================================
  cancelar(): void {
    this.router.navigate(['/pacientes']);
  }

  //===================================================================
  // Resetear formulario
  // ===================================================================
  limpiar(): void {
    this.paciente = {
       email: '',
  rut:'',
  dv: '',
  nombres: '',
  paterno: '',
  materno: '',
  telefono: ''
      };
    this.errores = {};
  }
}