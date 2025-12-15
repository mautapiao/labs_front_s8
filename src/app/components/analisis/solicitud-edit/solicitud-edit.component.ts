// solicitud-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// Modelos
import { SolicitudModel } from '../../../models/solicitud.model';
import { Laboratorio } from '../../../models/laboratorio.model';
import { PacienteModel } from '../../../models/paciente.model';
import { TipoAnalisis } from '../../../models/tipo-analisis.model';

// Servicios
import { SolicitudService } from '../../../services/solicitud.service';
import { LaboratorioService } from '../../../services/laboratorio.service';
import { PacienteService } from '../../../services/paciente.service';
import { TipoAnalisisService } from '../../../services/tipo-analisis.service';

@Component({
  selector: 'app-solicitud-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitud-edit.component.html',
  styleUrl: './solicitud-edit.component.scss'
})
export class SolicitudEditComponent implements OnInit {

  
  // PROPIEDADES
  solicitudId!: number;
  
  // Modelo para editar 
  solicitud: SolicitudModel = {
    numeroAtencion: '',
    fechaSolicitud: '',
    detalleExamen: '',
    tipoAnalisis: { id: 0, codigo: '', nombre: '' },
    paciente: { 
      id: 0, 
      rut: '', 
      dv: '', 
      nombres: '', 
      paterno: '', 
      materno: '', 
      email: '', 
      telefono: '' 
    },
    laboratorio: { id: 0, nombre: '' }
  };

  // Listas para los selectores
  laboratorios: Laboratorio[] = [];
  pacientes: PacienteModel[] = [];
  tiposAnalisis: TipoAnalisis[] = [];

  // Estados de carga
  loading = false;
  loadingData = true;
  loadingSolicitud = true;

  // Errores de validación
  errores: { [key: string]: string } = {};

  constructor(
    private solicitudSrv: SolicitudService,
    private laboratorioSrv: LaboratorioService,
    private pacienteSrv: PacienteService,
    private tipoAnalisisSrv: TipoAnalisisService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ===================================================================
  // INICIALIZACIÓN
  // ===================================================================
  ngOnInit(): void {
    // Obtener el ID de la URL
    this.route.params.subscribe(params => {
      this.solicitudId = +params['id']; // el "+" convierte string a number
      
      if (this.solicitudId) {
        this.cargarDatos();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'ID de solicitud no válido',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        }).then(() => {
          this.router.navigate(['/solicitudes']);
        });
      }
    });
  }

  // ===================================================================
  // CARGAR DATOS (Selectores + Solicitud)
  // ===================================================================
  cargarDatos(): void {
    this.loadingData = true;
    this.loadingSolicitud = true;

    // Cargar en paralelo: selectores + solicitud
    Promise.all([
      this.laboratorioSrv.getAll().toPromise(),
      this.pacienteSrv.getAll().toPromise(),
      this.tipoAnalisisSrv.getAll().toPromise(),
      this.solicitudSrv.getById(this.solicitudId).toPromise()
    ])
    .then(([laboratorios, pacientes, tiposAnalisis, solicitud]) => {
      // Cargar selectores
      this.laboratorios = laboratorios || [];
      this.pacientes = pacientes || [];
      this.tiposAnalisis = tiposAnalisis || [];
      
      // Cargar solicitud existente
      if (solicitud) {
        this.solicitud = solicitud;
        
        console.log('Solicitud cargada:', this.solicitud);
        console.log('Datos cargados:', {
          laboratorios: this.laboratorios.length,
          pacientes: this.pacientes.length,
          tiposAnalisis: this.tiposAnalisis.length
        });
      }

      this.loadingData = false;
      this.loadingSolicitud = false;
    })
    .catch(error => {
      this.loadingData = false;
      this.loadingSolicitud = false;
      
      console.error('❌ Error al cargar datos:', error);
      
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#dc3545'
      }).then(() => {
        this.router.navigate(['/solicitudes']);
      });
    });
  }

  // ===================================================================
  // VALIDACIÓN
  // ===================================================================
  validar(): boolean {
    this.errores = {};

    if (!this.solicitud.numeroAtencion?.trim()) {
      this.errores['numeroAtencion'] = 'El número de atención es obligatorio';
    }

    if (!this.solicitud.detalleExamen?.trim()) {
      this.errores['detalleExamen'] = 'El detalle del examen es obligatorio';
    }

    if (!this.solicitud.fechaSolicitud?.trim()) {
      this.errores['fechaSolicitud'] = 'La fecha es obligatoria';
    }

    if (!this.solicitud.laboratorio?.id || this.solicitud.laboratorio.id === 0) {
      this.errores['laboratorio'] = 'Debe seleccionar un laboratorio';
    }

    if (!this.solicitud.paciente?.id || this.solicitud.paciente.id === 0) {
      this.errores['paciente'] = 'Debe seleccionar un paciente';
    }

    if (!this.solicitud.tipoAnalisis?.id || this.solicitud.tipoAnalisis.id === 0) {
      this.errores['tipoAnalisis'] = 'Debe seleccionar un tipo de análisis';
    }

    return Object.keys(this.errores).length === 0;
  }

  // ===================================================================
  // ACTUALIZAR SOLICITUD
  // ===================================================================
  actualizar(): void {
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

    // Preparar payload (lo que se enviará al backend)
    const payload = {
      numeroAtencion: this.solicitud.numeroAtencion,
      fechaSolicitud: this.solicitud.fechaSolicitud,
      detalleExamen: this.solicitud.detalleExamen,
      tipoAnalisis: { id: this.solicitud.tipoAnalisis.id },
      paciente: { id: this.solicitud.paciente.id },
      laboratorio: { id: this.solicitud.laboratorio.id }
    };

    console.log('📤 Actualizando solicitud:', payload);

    this.solicitudSrv.update(this.solicitudId, payload).subscribe({
      next: (solicitudActualizada) => {
        this.loading = false;
        console.log('✅ Solicitud actualizada:', solicitudActualizada);
        
        Swal.fire({
          title: '¡Éxito!',
          text: `Solicitud "${solicitudActualizada.numeroAtencion}" actualizada correctamente`,
          icon: 'success',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['/solicitudes']);
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error al actualizar:', err);
        
        const mensajeError = err.error?.numeroAtencion || 
                            err.error?.message || 
                            'No se pudo actualizar la solicitud';
        
        Swal.fire({
          title: 'Error',
          text: mensajeError,
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  // ===================================================================
  // MÉTODOS AUXILIARES
  // ===================================================================
  getNombreCompletoPaciente(paciente: PacienteModel): string {
    return `${paciente.nombres} ${paciente.paterno} ${paciente.materno} (${paciente.rut}-${paciente.dv})`;
  }

  getTipoAnalisisDisplay(tipo: TipoAnalisis): string {
    return `${tipo.codigo} - ${tipo.nombre}`;
  }

  // ===================================================================
  // CANCELAR
  // ===================================================================
  cancelar(): void {
    Swal.fire({
      title: '¿Deseas cancelar?',
      text: 'Los cambios no guardados se perderán',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/solicitudes']);
      }
    });
  }

  // ===================================================================
  // VOLVER A CARGAR DATOS
  // ===================================================================
  recargar(): void {
    this.cargarDatos();
  }
}
