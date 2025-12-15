import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TipoAnalisis } from '../../../../models/tipo-analisis.model';
import { TipoAnalisisService } from '../../../../services/tipo-analisis.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ta-list',
  standalone: true,             // Angular 17: componente independiente
  imports: [CommonModule, RouterLink],      // Importamos directivas básicas (ngIf, ngFor) , agregado RouterLink
  templateUrl: './ta-list.component.html',
  styleUrl: './ta-list.component.scss'
})
export class TaListComponent implements OnInit{

  tipoAnalisis: TipoAnalisis[] = [];
  loading = true;
  error = '';

  constructor(private tipoAnalisisSrv: TipoAnalisisService) { }

  ngOnInit(): void {

    console.log('🔍 ngOnInit ejecutándose...');

    // (Semana 3) Consumimos el servicio apenas se carga el componente
    this.tipoAnalisisSrv.getAll().subscribe({
      next: (data) => {
        this.tipoAnalisis = data;
        this.loading = false;
        console.log('✅ registros obtenidos:', this.tipoAnalisis);
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los registros.';
        this.loading = false;
        console.error('❌ (Semana 3) Error al obtener registros:', err);
      }
    });
  }
  // ===================================================================
  // Funcionalidad DELETE (Eliminar registro por ID)
  // ===================================================================
  eliminar(id?: number): void {
    if (!id) return;

    Swal.fire({
      title: '¿Eliminar este registro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '🗑️ Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Mostrar loading
        Swal.fire({
          title: 'Eliminando...',
          didOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false
        });

        this.tipoAnalisisSrv.delete(id).subscribe({
          next: () => {
            // Quitamos el registro del array sin recargar
            this.tipoAnalisis = this.tipoAnalisis.filter(l => l.id !== id);

            // Mostrar éxito
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El registro ha sido eliminado correctamente',
              icon: 'success',
              confirmButtonColor: '#28a745'
            });
          },
          error: (err) => {
            console.error('❌ Error al eliminar:', err);

            // Mostrar error
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el registro. Intenta de nuevo.',
              icon: 'error',
              confirmButtonColor: '#dc3545'
            });
          }
        });
      }
    });
  }

}

