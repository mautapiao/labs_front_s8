import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TipoAnalisis } from '../../../../models/tipo-analisis.model';
import { TipoAnalisisService } from '../../../../services/tipo-analisis.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ta-create',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ta-create.component.html',
  styleUrl: './ta-create.component.scss'
})
export class TaCreateComponent {

  // Modelo a crear
  tipoAnalisis: TipoAnalisis = {
    codigo:'',
    nombre: '',

  };

  loading = false;
  errores: { [key: string]: string } = {};

  constructor(
    private tipoAnalisisSrv: TipoAnalisisService,
    private router: Router
  ) { }

  //===================================================================
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

    this.tipoAnalisisSrv.create(this.tipoAnalisis).subscribe({
      next: (nuevoTipoAnalisis) => {
        this.loading = false;
        Swal.fire({
          title: '¡Éxito!',
          text: `"${nuevoTipoAnalisis.nombre}" ha sido creado correctamente`,
          icon: 'success',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['/tipo-analisis']);
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
    this.router.navigate(['/tipo-analisis']);
  }

  //===================================================================
  // Resetear formulario
  // ===================================================================
  limpiar(): void {
    this.tipoAnalisis = {
      codigo: '',
      nombre: '',
      };
    this.errores = {};
  }
}