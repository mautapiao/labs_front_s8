import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LaboratorioService } from '../../services/laboratorio.service';
import { Laboratorio } from '../../models/laboratorio.model';
import { PacienteService } from '../../services/paciente.service';
import { SolicitudService } from '../../services/solicitud.service';
import { PacienteModel } from '../../models/paciente.model';
import { SolicitudModel } from '../../models/solicitud.model';

@Component({
  selector: 'app-clinica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clinica.component.html',
  styleUrl: './clinica.component.scss'
})
export class ClinicaComponent implements OnInit {
  menuActivo = 'menu1';
  username = '';
laboratorios: Laboratorio[] = [];
pacientes: PacienteModel[] =[];
solicitudes: SolicitudModel[]=[];
 totalLaboratorios =0;
 totalPacientes =0;
 totalSolicitudes=0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private laboratorioSrv: LaboratorioService,
    private pacienteSrv: PacienteService,
    private solicitudSrv: SolicitudService,

  ) {}

  
  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.username = this.authService.getUsername();

    // (Semana 5) Por tiempo cuento laboratoios no es lo ideal
    this.laboratorioSrv.getAll().subscribe({
      next: (data) => {
        this.laboratorios = data;    
        //  Obtener el total sin otro endpoint
      this.totalLaboratorios = this.laboratorios.length; 
        console.log('✅ registros obtenidos:', this.laboratorios);
      },
      error: (err) => {  
        console.error('❌ Error al obtener registros:', err);
      }
    });

this.pacienteSrv.getAll().subscribe({
      next: (data) => {
        this.pacientes = data;    
        //  Obtener el total sin otro endpoint
      this.totalPacientes = this.pacientes.length; 
        console.log('✅ registros obtenidos:', this.pacientes);
      },
      error: (err) => {  
        console.error('❌ Error al obtener registros:', err);
      }
    });

this.solicitudSrv.getAll().subscribe({
      next: (data) => {
        this.solicitudes = data;    
        //  Obtener el total sin otro endpoint
      this.totalSolicitudes = this.solicitudes.length; 
        console.log('✅ registros obtenidos:', this.solicitudes);
      },
      error: (err) => {  
        console.error('❌ Error al obtener registros:', err);
      }
    });





    
  }

  cambiarMenu(menu: string): void {
    this.menuActivo = menu;
  }
}
