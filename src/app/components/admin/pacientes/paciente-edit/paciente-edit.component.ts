import { Component, OnInit } from '@angular/core';
import { PacienteModel } from '../../../../models/paciente.model';
import { PacienteService } from '../../../../services/paciente.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente-edit',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './paciente-edit.component.html',
  styleUrl: './paciente-edit.component.scss'
})
export class PacienteEditComponent implements OnInit {

  // Modelo a editar
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
  cargando = true;
  errores: { [key: string]: string } = {};
  pacienteId?: number;

  constructor(
    private pacienteSrv: PacienteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // ===================================================================
  // Cargar el registro al inicializar el componente
  // ===================================================================
  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.pacienteId) {
      Swal.fire('Error', 'No se especificó un registro para editar', 'error')
        .then(() => this.router.navigate(['/pacientes']));
      return;
    }

    this.cargarPaciente();
  }

  // ===================================================================
  // Obtener los datos del registro por ID
  // ===================================================================
  cargarPaciente(): void {
    this.pacienteSrv.getById(this.pacienteId!).subscribe({
      next: (paciente) => {
        this.paciente = paciente;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar registro:', err);
        this.cargando = false;
        Swal.fire('Error', 'No se pudo cargar el registro', 'error')
          .then(() => this.router.navigate(['/pacientes']));
      }
    });
  }

  // ===================================================================
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

  // ===================================================================
  // Guardar cambios
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

    this.pacienteSrv.update(this.pacienteId!, this.paciente).subscribe({
     
      next: (pacienteActualizado) => {
        this.loading = false;
        Swal.fire({
          title: '¡Actualizado!',
          text: `"${pacienteActualizado.nombres}" ha sido actualizado correctamente`,
          icon: 'success',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['/pacientes']);
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al actualizar registro:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el registro. Intenta de nuevo.',
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

  // ===================================================================
  // Resetear formulario a los valores originales
  // ===================================================================
  resetear(): void {
    this.cargarPaciente();
    this.errores = {};
  }
}