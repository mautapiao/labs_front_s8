import { Component, OnInit } from '@angular/core';
import { TipoAnalisis } from '../../../../models/tipo-analisis.model';
import { TipoAnalisisService } from '../../../../services/tipo-analisis.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ta-edit',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './ta-edit.component.html',
  styleUrl: './ta-edit.component.scss'
})
export class TaEditComponent implements OnInit {

  // Modelo a editar
  tipoAnalisis: TipoAnalisis = {
    codigo: '',
    nombre: '',

  };

  loading = false;
  cargando = true;
  errores: { [key: string]: string } = {};
  tipoAnalisisId?: number;

  constructor(
    private tipoAnalisisSrv: TipoAnalisisService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // ===================================================================
  // Cargar el registro al inicializar el componente
  // ===================================================================
  ngOnInit(): void {
    this.tipoAnalisisId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.tipoAnalisisId) {
      Swal.fire('Error', 'No se especificó un registro para editar', 'error')
        .then(() => this.router.navigate(['/tipo-analisis']));
      return;
    }

    this.cargarTipoAnalisis();
  }

  // ===================================================================
  // Obtener los datos del registro por ID
  // ===================================================================
  cargarTipoAnalisis(): void {
    this.tipoAnalisisSrv.getById(this.tipoAnalisisId!).subscribe({
      next: (tipoAnalisis) => {
        this.tipoAnalisis = tipoAnalisis;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar registro:', err);
        this.cargando = false;
        Swal.fire('Error', 'No se pudo cargar el registro', 'error')
          .then(() => this.router.navigate(['/tipo-analisis']));
      }
    });
  }

  // ===================================================================
  // Validar formulario
  // ===================================================================
  validar(): boolean {
    this.errores = {};

     if (!this.tipoAnalisis.codigo || this.tipoAnalisis.codigo.trim() === '') {
      this.errores['codigo'] = 'El código es requerido';
    }

    if (!this.tipoAnalisis.nombre || this.tipoAnalisis.nombre.trim() === '') {
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

    this.tipoAnalisisSrv.update(this.tipoAnalisisId!, this.tipoAnalisis).subscribe({
     
      next: (tipoAnalisisActualizado) => {
        this.loading = false;
        Swal.fire({
          title: '¡Actualizado!',
          text: `"${tipoAnalisisActualizado.nombre}" ha sido actualizado correctamente`,
          icon: 'success',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['/tipo-analisis']);
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
    this.router.navigate(['/tipo-analisis']);
  }

  // ===================================================================
  // Resetear formulario a los valores originales
  // ===================================================================
  resetear(): void {
    this.cargarTipoAnalisis();
    this.errores = {};
  }
}