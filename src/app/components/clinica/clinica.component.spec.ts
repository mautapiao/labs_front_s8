import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ClinicaComponent } from './clinica.component';
import { AuthService } from '../../services/auth.service';
import { LaboratorioService } from '../../services/laboratorio.service';
import { PacienteService } from '../../services/paciente.service';
import { SolicitudService } from '../../services/solicitud.service';
import { Laboratorio } from '../../models/laboratorio.model';
import { PacienteModel } from '../../models/paciente.model';
import { SolicitudModel } from '../../models/solicitud.model';
import { TipoAnalisis } from '../../models/tipo-analisis.model'; // Ajusta la ruta según tu proyecto

describe('ClinicaComponent', () => {
  let component: ClinicaComponent;
  let fixture: ComponentFixture<ClinicaComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let laboratorioService: jasmine.SpyObj<LaboratorioService>;
  let pacienteService: jasmine.SpyObj<PacienteService>;
  let solicitudService: jasmine.SpyObj<SolicitudService>;

  // Mock data con las interfaces correctas
  const mockLaboratorios: Laboratorio[] = [
    { 
      id: 1, 
      nombre: 'Laboratorio Central', 
      direccion: 'Av. Principal 123',
      telefono: '+56912345678',
      email: 'contacto@labcentral.cl'
    } as Laboratorio,
    { 
      id: 2, 
      nombre: 'Laboratorio Norte', 
      direccion: 'Calle Norte 456',
      telefono: '+56987654321',
      email: 'info@labnorte.cl'
    } as Laboratorio
  ];

  const mockPacientes: PacienteModel[] = [
    { 
      id: 1, 
      email: 'juan.perez@email.com',
      rut: '12345678',
      dv: '9',
      nombres: 'Juan Carlos',
      paterno: 'Pérez',
      materno: 'González',
      telefono: '+56911111111'
    },
    { 
      id: 2, 
      email: 'maria.lopez@email.com',
      rut: '23456789',
      dv: '0',
      nombres: 'María Teresa',
      paterno: 'López',
      materno: 'Ramírez',
      telefono: '+56922222222'
    },
    { 
      id: 3, 
      email: 'pedro.silva@email.com',
      rut: '34567890',
      dv: 'K',
      nombres: 'Pedro Andrés',
      paterno: 'Silva',
      materno: 'Muñoz',
      telefono: '+56933333333'
    }
  ];

  const mockTipoAnalisis: TipoAnalisis = {
    id: 1,
    codigo:'324354',
    nombre: 'Hemograma completo'
  } as TipoAnalisis;

  const mockSolicitudes: SolicitudModel[] = [
    { 
      id: 1, 
      detalleExamen: 'Análisis de sangre completo con recuento de glóbulos',
      fechaSolicitud: '2024-01-15',
      numeroAtencion: 'AT-2024-001',
      laboratorio: mockLaboratorios[0],
      paciente: mockPacientes[0],
      tipoAnalisis: mockTipoAnalisis
    },
    { 
      id: 2, 
      detalleExamen: 'Perfil lipídico y glucosa',
      fechaSolicitud: '2024-01-16',
      numeroAtencion: 'AT-2024-002',
      laboratorio: mockLaboratorios[1],
      paciente: mockPacientes[1],
      tipoAnalisis: {
        id: 2,
        codigo:'324354',
        nombre: 'Perfil metabólico',
       
      } as TipoAnalisis
    }
  ];

  beforeEach(async () => {
    // Crear spies para los servicios
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getUsername']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const laboratorioServiceSpy = jasmine.createSpyObj('LaboratorioService', ['getAll']);
    const pacienteServiceSpy = jasmine.createSpyObj('PacienteService', ['getAll']);
    const solicitudServiceSpy = jasmine.createSpyObj('SolicitudService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [ClinicaComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: LaboratorioService, useValue: laboratorioServiceSpy },
        { provide: PacienteService, useValue: pacienteServiceSpy },
        { provide: SolicitudService, useValue: solicitudServiceSpy }
      ]
    }).compileComponents();

    // Obtener referencias a los servicios mockeados
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    laboratorioService = TestBed.inject(LaboratorioService) as jasmine.SpyObj<LaboratorioService>;
    pacienteService = TestBed.inject(PacienteService) as jasmine.SpyObj<PacienteService>;
    solicitudService = TestBed.inject(SolicitudService) as jasmine.SpyObj<SolicitudService>;

    // Configurar comportamiento por defecto (usuario autenticado)
    authService.isLoggedIn.and.returnValue(true);
    authService.getUsername.and.returnValue('admin.clinica');
    laboratorioService.getAll.and.returnValue(of(mockLaboratorios));
    pacienteService.getAll.and.returnValue(of(mockPacientes));
    solicitudService.getAll.and.returnValue(of(mockSolicitudes));
  });

  it('should create', () => {
    fixture = TestBed.createComponent(ClinicaComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('ngOnInit - Autenticación', () => {
    it('debería redirigir a login si el usuario no está autenticado', () => {
      authService.isLoggedIn.and.returnValue(false);
      
      fixture = TestBed.createComponent(ClinicaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(laboratorioService.getAll).not.toHaveBeenCalled();
      expect(pacienteService.getAll).not.toHaveBeenCalled();
      expect(solicitudService.getAll).not.toHaveBeenCalled();
    });

    it('debería obtener el username cuando el usuario está autenticado', () => {
      fixture = TestBed.createComponent(ClinicaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.username).toBe('admin.clinica');
      expect(authService.getUsername).toHaveBeenCalled();
    });

    it('debería cargar todos los datos cuando el usuario está autenticado', () => {
      fixture = TestBed.createComponent(ClinicaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(laboratorioService.getAll).toHaveBeenCalled();
      expect(pacienteService.getAll).toHaveBeenCalled();
      expect(solicitudService.getAll).toHaveBeenCalled();
    });
  });

  describe('ngOnInit - Carga de datos', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ClinicaComponent);
      component = fixture.componentInstance;
    });

    it('debería cargar laboratorios correctamente y actualizar el total', () => {
      fixture.detectChanges();

      expect(laboratorioService.getAll).toHaveBeenCalled();
      expect(component.laboratorios).toEqual(mockLaboratorios);
      expect(component.laboratorios.length).toBe(2);
      expect(component.totalLaboratorios).toBe(2);
    });

    it('debería cargar pacientes correctamente y actualizar el total', () => {
      fixture.detectChanges();

      expect(pacienteService.getAll).toHaveBeenCalled();
      expect(component.pacientes).toEqual(mockPacientes);
      expect(component.pacientes.length).toBe(3);
      expect(component.totalPacientes).toBe(3);
    });

    it('debería cargar solicitudes correctamente y actualizar el total', () => {
      fixture.detectChanges();

      expect(solicitudService.getAll).toHaveBeenCalled();
      expect(component.solicitudes).toEqual(mockSolicitudes);
      expect(component.solicitudes.length).toBe(2);
      expect(component.totalSolicitudes).toBe(2);
    });

    it('debería cargar solicitudes con relaciones completas (laboratorio, paciente, tipoAnalisis)', () => {
      fixture.detectChanges();

      expect(component.solicitudes[0].laboratorio).toBeDefined();
      expect(component.solicitudes[0].paciente).toBeDefined();
      expect(component.solicitudes[0].tipoAnalisis).toBeDefined();
      expect(component.solicitudes[0].laboratorio.nombre).toBe('Laboratorio Central');
      expect(component.solicitudes[0].paciente.nombres).toBe('Juan Carlos');
    });

    it('debería verificar la estructura completa de un paciente', () => {
      fixture.detectChanges();

      const primerPaciente = component.pacientes[0];
      expect(primerPaciente.email).toBe('juan.perez@email.com');
      expect(primerPaciente.rut).toBe('12345678');
      expect(primerPaciente.dv).toBe('9');
      expect(primerPaciente.nombres).toBe('Juan Carlos');
      expect(primerPaciente.paterno).toBe('Pérez');
      expect(primerPaciente.materno).toBe('González');
      expect(primerPaciente.telefono).toBe('+56911111111');
    });

    it('debería manejar correctamente el RUT con dígito verificador K', () => {
      fixture.detectChanges();

      const pacienteConDvK = component.pacientes.find(p => p.dv === 'K');
      expect(pacienteConDvK).toBeDefined();
      expect(pacienteConDvK?.rut).toBe('34567890');
    });
  });

  describe('Manejo de errores', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ClinicaComponent);
      component = fixture.componentInstance;
      spyOn(console, 'error'); // Silenciar errores en la consola durante tests
    });

    it('debería manejar errores al cargar laboratorios', () => {
      const errorMessage = 'Error de conexión al servidor';
      laboratorioService.getAll.and.returnValue(throwError(() => new Error(errorMessage)));

      fixture.detectChanges();

      expect(component.laboratorios).toEqual([]);
      expect(component.totalLaboratorios).toBe(0);
      expect(console.error).toHaveBeenCalledWith('❌ Error al obtener registros:', jasmine.any(Error));
    });

    it('debería manejar errores al cargar pacientes', () => {
      const errorMessage = 'Timeout en la petición';
      pacienteService.getAll.and.returnValue(throwError(() => new Error(errorMessage)));

      fixture.detectChanges();

      expect(component.pacientes).toEqual([]);
      expect(component.totalPacientes).toBe(0);
      expect(console.error).toHaveBeenCalledWith('❌ Error al obtener registros:', jasmine.any(Error));
    });

    it('debería manejar errores al cargar solicitudes', () => {
      const errorMessage = 'No autorizado';
      solicitudService.getAll.and.returnValue(throwError(() => new Error(errorMessage)));

      fixture.detectChanges();

      expect(component.solicitudes).toEqual([]);
      expect(component.totalSolicitudes).toBe(0);
      expect(console.error).toHaveBeenCalledWith('❌ Error al obtener registros:', jasmine.any(Error));
    });

    it('debería continuar cargando otros datos si uno falla', () => {
      // Simular que solo laboratorios falla
      laboratorioService.getAll.and.returnValue(throwError(() => new Error('Error')));
      
      fixture.detectChanges();

      // Verificar que pacientes y solicitudes se cargaron correctamente
      expect(component.laboratorios).toEqual([]);
      expect(component.pacientes).toEqual(mockPacientes);
      expect(component.solicitudes).toEqual(mockSolicitudes);
    });
  });

  describe('cambiarMenu', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ClinicaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('debería tener menu1 como menú inicial', () => {
      expect(component.menuActivo).toBe('menu1');
    });

    it('debería cambiar el menú activo correctamente', () => {
      component.cambiarMenu('menu2');
      expect(component.menuActivo).toBe('menu2');

      component.cambiarMenu('menu3');
      expect(component.menuActivo).toBe('menu3');
    });

    it('debería mantener el valor del último menú seleccionado', () => {
      component.cambiarMenu('menu4');
      expect(component.menuActivo).toBe('menu4');
      
      component.cambiarMenu('menu1');
      expect(component.menuActivo).toBe('menu1');
    });

    it('debería aceptar cualquier string como identificador de menú', () => {
      component.cambiarMenu('configuracion');
      expect(component.menuActivo).toBe('configuracion');

      component.cambiarMenu('reportes');
      expect(component.menuActivo).toBe('reportes');
    });
  });

  describe('Estado inicial del componente', () => {
    it('debería tener todos los valores iniciales correctos antes de ngOnInit', () => {
      fixture = TestBed.createComponent(ClinicaComponent);
      component = fixture.componentInstance;
      // No llamar a detectChanges() para verificar estado pre-init

      expect(component.menuActivo).toBe('menu1');
      expect(component.username).toBe('');
      expect(component.laboratorios).toEqual([]);
      expect(component.pacientes).toEqual([]);
      expect(component.solicitudes).toEqual([]);
      expect(component.totalLaboratorios).toBe(0);
      expect(component.totalPacientes).toBe(0);
      expect(component.totalSolicitudes).toBe(0);
    });
  });

  describe('Carga de datos vacíos', () => {
    it('debería manejar correctamente cuando no hay laboratorios', () => {
      laboratorioService.getAll.and.returnValue(of([]));
      
      fixture = TestBed.createComponent(ClinicaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.laboratorios).toEqual([]);
      expect(component.totalLaboratorios).toBe(0);
    });

    it('debería manejar correctamente cuando no hay pacientes', () => {
      pacienteService.getAll.and.returnValue(of([]));
      
      fixture = TestBed.createComponent(ClinicaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.pacientes).toEqual([]);
      expect(component.totalPacientes).toBe(0);
    });

    it('debería manejar correctamente cuando no hay solicitudes', () => {
      solicitudService.getAll.and.returnValue(of([]));
      
      fixture = TestBed.createComponent(ClinicaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.solicitudes).toEqual([]);
      expect(component.totalSolicitudes).toBe(0);
    });
  });
});
