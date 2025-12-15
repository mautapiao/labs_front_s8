import { Component } from '@angular/core';
import { Laboratorio } from '../../../../models/laboratorio.model';
import { LaboratorioService } from '../../../../services/laboratorio.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-labs-create',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './labs-create.component.html',
  styleUrl: './labs-create.component.scss'
})
export class LabsCreateComponent {

  // Modelo a crear
  laboratorio: Laboratorio = {
    nombre: '',

  };

  loading = false;
  errores: { [key: string]: string } = {};

  constructor(
    private laboratorioSrv: LaboratorioService,
    private router: Router
  ) { }

  //===================================================================
  // Validar formulario
  // ===================================================================
  validar(): boolean {
    this.errores = {};

    if (!this.laboratorio.nombre || this.laboratorio.nombre.trim() === '') {
      this.errores['nombre'] = 'El nombre es requerido';
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

    this.laboratorioSrv.create(this.laboratorio).subscribe({
      next: (nuevoLaboratorio) => {
        this.loading = false;
        Swal.fire({
          title: '¡Éxito!',
          text: `"${nuevoLaboratorio.nombre}" ha sido creado correctamente`,
          icon: 'success',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['/laboratorios']);
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
    this.router.navigate(['/laboratorios']);
  }

  //===================================================================
  // Resetear formulario
  // ===================================================================
  limpiar(): void {
    this.laboratorio = {
      nombre: '',
      };
    this.errores = {};
  }
}