// ===================================================================
// Semana 3 - Componente: LibrosListaComponent
// ===================================================================
// Objetivo: Mostrar todos los libros obtenidos desde el backend
// usando el servicio LibrosService y la directiva *ngFor.
//
// Angular (Frontend) ←→ Spring Boot (Backend)
// ===================================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 necesario para *ngFor, *ngIf
import { LaboratorioService } from '../../../../services/laboratorio.service'
import { Laboratorio } from '../../../../models/laboratorio.model';   // ✅ modelo desde /models
import { RouterLink } from '@angular/router';       // necesario para routerLink
import Swal from 'sweetalert2';

@Component({
  selector: 'app-labs-list',
  standalone: true,             // Angular 17: componente independiente
  imports: [CommonModule, RouterLink],      // Importamos directivas básicas (ngIf, ngFor) , agregado RouterLink
  templateUrl: './labs-list.component.html',
  styleUrls: ['./labs-list.component.scss'],
})

export class LabsListComponent implements OnInit {

  laboratorios: Laboratorio[] = [];
  loading = true;
  error = '';

  constructor(private laboratorioSrv: LaboratorioService) { }

  ngOnInit(): void {

    console.log('🔍 ngOnInit ejecutándose...');

    // (Semana 5) Consumimos el servicio apenas se carga el componente
    this.laboratorioSrv.getAll().subscribe({
      next: (data) => {
        this.laboratorios = data;
        this.loading = false;
        console.log('✅ registros obtenidos:', this.laboratorios);
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

        this.laboratorioSrv.delete(id).subscribe({
          next: () => {
            // Quitamos el libro del array sin recargar
            this.laboratorios = this.laboratorios.filter(l => l.id !== id);

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

