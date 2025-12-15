import { Component, OnInit } from '@angular/core';
import { SolicitudModel } from '../../../models/solicitud.model';
import { SolicitudService } from '../../../services/solicitud.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitud-list',
 standalone: true,             // Angular 17: componente independiente
  imports: [CommonModule, RouterLink],      // Importamos directivas básicas (ngIf, ngFor) , agregado RouterLink
  templateUrl: './solicitud-list.component.html',
  styleUrl: './solicitud-list.component.scss'
})
export class SolicitudListComponent implements OnInit{

  solicitud: SolicitudModel[] = [];
  loading = true;
  error = '';

  constructor(private solicitudSrv: SolicitudService) { }

  ngOnInit(): void {

    console.log('🔍 ngOnInit ejecutándose...');

    // (Semana 3) Consumimos el servicio apenas se carga el componente
    this.solicitudSrv.getAll().subscribe({
      next: (data) => {
        this.solicitud = data;
        this.loading = false;
        console.log('✅ registros obtenidos:', this.solicitud);
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

        this.solicitudSrv.delete(id).subscribe({
          next: () => {
            // Quitamos el registro del array sin recargar
            this.solicitud = this.solicitud.filter(l => l.id !== id);

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

