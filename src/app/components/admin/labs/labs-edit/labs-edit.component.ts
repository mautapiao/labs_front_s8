import { Component, OnInit } from '@angular/core';
import { Laboratorio } from '../../../../models/laboratorio.model';
import { LaboratorioService } from '../../../../services/laboratorio.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-labs-edit',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './labs-edit.component.html',
  styleUrl: './labs-edit.component.scss'
})

export class LabsEditComponent implements OnInit{

  // Modelo a editar
  laboratorio: Laboratorio = {
    nombre: '',

  };

  loading = false;
  cargando = true;
  errores: { [key: string]: string } = {};
  laboratorioId?: number;

  constructor(
    private laboratorioSrv: LaboratorioService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // ===================================================================
  // Cargar el registro al inicializar el componente
  // ===================================================================
  ngOnInit(): void {
    this.laboratorioId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.laboratorioId) {
      Swal.fire('Error', 'No se especificó un registro para editar', 'error')
        .then(() => this.router.navigate(['/laboratorios']));
      return;
    }

    this.cargarLaboratorio();
  }

  // ===================================================================
  // Obtener los datos del registro por ID
  // ===================================================================
  cargarLaboratorio(): void {
    this.laboratorioSrv.getById(this.laboratorioId!).subscribe({
      next: (laboratorio) => {
        this.laboratorio = laboratorio;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar registro:', err);
        this.cargando = false;
        Swal.fire('Error', 'No se pudo cargar el registro', 'error')
          .then(() => this.router.navigate(['/laboratorios']));
      }
    });
  }

  // ===================================================================
  // Validar formulario
  // ===================================================================
  validar(): boolean {
    this.errores = {};

    if (!this.laboratorio.nombre || this.laboratorio.nombre.trim() === '') {
      this.errores['nombre'] = 'El nombre es requerido';
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

    this.laboratorioSrv.update(this.laboratorioId!, this.laboratorio).subscribe({
     
      next: (laboratorioActualizado) => {
        this.loading = false;
        Swal.fire({
          title: '¡Actualizado!',
          text: `"${laboratorioActualizado.nombre}" ha sido actualizado correctamente`,
          icon: 'success',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['/laboratorios']);
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
    this.router.navigate(['/laboratorios']);
  }

  // ===================================================================
  // Resetear formulario a los valores originales
  // ===================================================================
  resetear(): void {
    this.cargarLaboratorio();
    this.errores = {};
  }
}