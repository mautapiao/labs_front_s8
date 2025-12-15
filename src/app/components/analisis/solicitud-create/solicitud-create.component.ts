// solicitud-create.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Modelos
import { CreateSolicitudDto } from '../../../models/solicitud.model';
import { Laboratorio } from '../../../models/laboratorio.model';
import { PacienteModel } from '../../../models/paciente.model';
import { TipoAnalisis } from '../../../models/tipo-analisis.model';

// Servicios
import { SolicitudService } from '../../../services/solicitud.service';
import { LaboratorioService } from '../../../services/laboratorio.service';
import { PacienteService } from '../../../services/paciente.service';
import { TipoAnalisisService } from '../../../services/tipo-analisis.service';

// Este es un Template-Driven Form Formulario Dirigido por Plantilla de Angular.
// menos completo que ReactiveForm

@Component({
  selector: 'app-solicitud-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitud-create.component.html',
  styleUrl: './solicitud-create.component.scss'
})
export class SolicitudCreateComponent implements OnInit {

  laboratorios: Laboratorio[] = [];
  pacientes: PacienteModel[] = [];
  tiposAnalisis: TipoAnalisis[] = [];

  // ✅ CAMBIO: Estructura correcta que coincide con el backend
  solicitud: CreateSolicitudDto = {
    numeroAtencion: '',
    fechaSolicitud: '',
    detalleExamen: '',
    tipoAnalisis: { id: 0 },
    paciente: { id: 0 },
    laboratorio: { id: 0 }
  };

  loading = false;
  loadingData = false;
  errores: { [key: string]: string } = {};

  constructor(
    private solicitudSrv: SolicitudService,
    private laboratorioSrv: LaboratorioService,
    private pacienteSrv: PacienteService,
    private tipoAnalisisSrv: TipoAnalisisService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.loadingData = true;

    Promise.all([
      this.laboratorioSrv.getAll().toPromise(),
      this.pacienteSrv.getAll().toPromise(),
      this.tipoAnalisisSrv.getAll().toPromise()
    ])
    .then(([laboratorios, pacientes, tiposAnalisis]) => {
      this.laboratorios = laboratorios || [];
      this.pacientes = pacientes || [];
      this.tiposAnalisis = tiposAnalisis || [];
      this.loadingData = false;

      console.log('✅ Datos cargados:', {
        laboratorios: this.laboratorios.length,
        pacientes: this.pacientes.length,
        tiposAnalisis: this.tiposAnalisis.length
      });
    })
    .catch(error => {
      this.loadingData = false;
      console.error('❌ Error al cargar datos iniciales:', error);
      
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos necesarios.',
        icon: 'error',
        confirmButtonColor: '#dc3545'
      });
    });
  }

  //Validar con los nuevos nombres
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

    // validar objetos anidados
    if (!this.solicitud.laboratorio.id || this.solicitud.laboratorio.id === 0) {
      this.errores['laboratorio'] = 'Debe seleccionar un laboratorio';
    }

    if (!this.solicitud.paciente.id || this.solicitud.paciente.id === 0) {
      this.errores['paciente'] = 'Debe seleccionar un paciente';
    }

    if (!this.solicitud.tipoAnalisis.id || this.solicitud.tipoAnalisis.id === 0) {
      this.errores['tipoAnalisis'] = 'Debe seleccionar un tipo de análisis';
    }

    return Object.keys(this.errores).length === 0;
  }

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

    //  Ver exactamente que  envía
    console.log('📤 Enviando al backend:', JSON.stringify(this.solicitud, null, 2));

    this.solicitudSrv.create(this.solicitud).subscribe({
      next: (nuevaSolicitud) => {
        this.loading = false;
        console.log('✅ Respuesta del backend:', nuevaSolicitud);
        
        Swal.fire({
          title: '¡Éxito!',
          text: `Solicitud "${nuevaSolicitud.numeroAtencion}" creada correctamente`,
          icon: 'success',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['/solicitudes']);
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error completo:', err);
        console.error('❌ Error del backend:', err.error);
        
        const mensajeError = err.error?.numeroAtencion || 
                            err.error?.message || 
                            'No se pudo crear la solicitud';
        
        Swal.fire({
          title: 'Error',
          text: mensajeError,
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  getNombreCompletoPaciente(paciente: PacienteModel): string {
    return `${paciente.nombres} ${paciente.paterno} ${paciente.materno} (${paciente.rut}-${paciente.dv})`;
  }

  getTipoAnalisisDisplay(tipo: TipoAnalisis): string {
    return `${tipo.codigo} - ${tipo.nombre}`;
  }

  // Limpiar con nueva estructura
  limpiar(): void {
    this.solicitud = {
      numeroAtencion: '',
      fechaSolicitud: '',
      detalleExamen: '',
      tipoAnalisis: { id: 0 },
      paciente: { id: 0 },
      laboratorio: { id: 0 }
    };
    this.errores = {};
  }

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
}
