import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SolicitudCreateComponent } from './solicitud-create.component';
import { SolicitudService } from '../../../services/solicitud.service';
import { LaboratorioService } from '../../../services/laboratorio.service';
import { PacienteService } from '../../../services/paciente.service';
import { TipoAnalisisService } from '../../../services/tipo-analisis.service';
import { of, throwError } from 'rxjs';

describe('SolicitudCreateComponent', () => {
  let componente: SolicitudCreateComponent;
  let fixture: ComponentFixture<SolicitudCreateComponent>;
  let solicitudSrv: jasmine.SpyObj<SolicitudService>;
  let laboratorioSrv: jasmine.SpyObj<LaboratorioService>;
  let pacienteSrv: jasmine.SpyObj<PacienteService>;
  let tipoAnalisisSrv: jasmine.SpyObj<TipoAnalisisService>;

  beforeEach(async () => {
    const solicitudSpy = jasmine.createSpyObj('SolicitudService', ['create']);
    const laboratorioSpy = jasmine.createSpyObj('LaboratorioService', ['getAll']);
    const pacienteSpy = jasmine.createSpyObj('PacienteService', ['getAll']);
    const tipoAnalisisSpy = jasmine.createSpyObj('TipoAnalisisService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [SolicitudCreateComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: SolicitudService, useValue: solicitudSpy },
        { provide: LaboratorioService, useValue: laboratorioSpy },
        { provide: PacienteService, useValue: pacienteSpy },
        { provide: TipoAnalisisService, useValue: tipoAnalisisSpy }
      ]
    }).compileComponents();

    solicitudSrv = TestBed.inject(SolicitudService) as jasmine.SpyObj<SolicitudService>;
    laboratorioSrv = TestBed.inject(LaboratorioService) as jasmine.SpyObj<LaboratorioService>;
    pacienteSrv = TestBed.inject(PacienteService) as jasmine.SpyObj<PacienteService>;
    tipoAnalisisSrv = TestBed.inject(TipoAnalisisService) as jasmine.SpyObj<TipoAnalisisService>;

    fixture = TestBed.createComponent(SolicitudCreateComponent);
    componente = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  describe('ngOnInit - Carga de datos iniciales', () => {
    it('debe cargar laboratorios, pacientes y tipos de análisis al inicializar', (done) => {
      const labsSimulados = [{ id: 1, nombre: 'Lab Central' }];
      const pacientesSimulados = [{ id: 1, email: 'juan@test.com', rut: '12345678', dv: '5', nombres: 'Juan', paterno: 'Pérez', materno: 'García', telefono: '987654321' }];
      const tiposSimulados = [{ id: 1, codigo: 'BHC', nombre: 'Biometría Hemática' }];

      laboratorioSrv.getAll.and.returnValue(of(labsSimulados));
      pacienteSrv.getAll.and.returnValue(of(pacientesSimulados));
      tipoAnalisisSrv.getAll.and.returnValue(of(tiposSimulados));

      fixture.detectChanges();

      setTimeout(() => {
        expect(componente.laboratorios).toEqual(labsSimulados);
        expect(componente.pacientes).toEqual(pacientesSimulados);
        expect(componente.tiposAnalisis).toEqual(tiposSimulados);
        expect(componente.loadingData).toBeFalsy();
        done();
      }, 100);
    });

    it('debe manejar error cuando falla la carga de datos', (done) => {
      laboratorioSrv.getAll.and.returnValue(of([]));
      pacienteSrv.getAll.and.returnValue(of([]));
      tipoAnalisisSrv.getAll.and.returnValue(throwError(() => new Error('Error al cargar')));

      fixture.detectChanges();

      setTimeout(() => {
        expect(componente.loadingData).toBeFalsy();
        done();
      }, 100);
    });
  });

  describe('validar - Validación de campos', () => {
    it('debe retornar falso cuando el número de atención está vacío', () => {
      componente.solicitud.numeroAtencion = '';
      const resultado = componente.validar();
      expect(resultado).toBeFalsy();
      expect(componente.errores['numeroAtencion']).toBeTruthy();
    });

    it('debe retornar falso cuando el detalle del examen está vacío', () => {
      componente.solicitud.numeroAtencion = 'ATN-001';
      componente.solicitud.detalleExamen = '';
      const resultado = componente.validar();
      expect(resultado).toBeFalsy();
      expect(componente.errores['detalleExamen']).toBeTruthy();
    });

    it('debe retornar falso cuando la fecha está vacía', () => {
      componente.solicitud.numeroAtencion = 'ATN-001';
      componente.solicitud.detalleExamen = 'Examen general';
      componente.solicitud.fechaSolicitud = '';
      const resultado = componente.validar();
      expect(resultado).toBeFalsy();
      expect(componente.errores['fechaSolicitud']).toBeTruthy();
    });

    it('debe retornar falso cuando no se selecciona laboratorio', () => {
      componente.solicitud.numeroAtencion = 'ATN-001';
      componente.solicitud.detalleExamen = 'Examen general';
      componente.solicitud.fechaSolicitud = '2025-01-15';
      componente.solicitud.laboratorio.id = 0;
      const resultado = componente.validar();
      expect(resultado).toBeFalsy();
      expect(componente.errores['laboratorio']).toBeTruthy();
    });

    it('debe retornar falso cuando no se selecciona paciente', () => {
      componente.solicitud.numeroAtencion = 'ATN-001';
      componente.solicitud.detalleExamen = 'Examen general';
      componente.solicitud.fechaSolicitud = '2025-01-15';
      componente.solicitud.laboratorio.id = 1;
      componente.solicitud.paciente.id = 0;
      const resultado = componente.validar();
      expect(resultado).toBeFalsy();
      expect(componente.errores['paciente']).toBeTruthy();
    });

    it('debe retornar falso cuando no se selecciona tipo de análisis', () => {
      componente.solicitud.numeroAtencion = 'ATN-001';
      componente.solicitud.detalleExamen = 'Examen general';
      componente.solicitud.fechaSolicitud = '2025-01-15';
      componente.solicitud.laboratorio.id = 1;
      componente.solicitud.paciente.id = 1;
      componente.solicitud.tipoAnalisis.id = 0;
      const resultado = componente.validar();
      expect(resultado).toBeFalsy();
      expect(componente.errores['tipoAnalisis']).toBeTruthy();
    });

    it('debe retornar verdadero cuando todos los campos son válidos', () => {
      componente.solicitud.numeroAtencion = 'ATN-001';
      componente.solicitud.detalleExamen = 'Examen general';
      componente.solicitud.fechaSolicitud = '2025-01-15';
      componente.solicitud.laboratorio.id = 1;
      componente.solicitud.paciente.id = 1;
      componente.solicitud.tipoAnalisis.id = 1;
      const resultado = componente.validar();
      expect(resultado).toBeTruthy();
      expect(Object.keys(componente.errores).length).toBe(0);
    });
  });

  describe('guardar - Guardar solicitud', () => {
    beforeEach(() => {
      componente.solicitud = {
        numeroAtencion: 'ATN-001',
        fechaSolicitud: '2025-01-15',
        detalleExamen: 'Examen general',
        tipoAnalisis: { id: 1 },
        paciente: { id: 1 },
        laboratorio: { id: 1 }
      };
    });

    it('debe llamar al servicio cuando el formulario es válido', () => {
      const respuestaMock = {
        id: 1,
        numeroAtencion: 'ATN-001',
        fechaSolicitud: '2025-01-15',
        detalleExamen: 'Examen general',
        tipoAnalisis: { id: 1, codigo: 'BHC', nombre: 'Biometría Hemática' },
        paciente: { id: 1, email: 'juan@test.com', rut: '12345678', dv: '5', nombres: 'Juan', paterno: 'Pérez', materno: 'García', telefono: '987654321' },
        laboratorio: { id: 1, nombre: 'Lab Central' }
      };
      solicitudSrv.create.and.returnValue(of(respuestaMock));

      componente.guardar();

      expect(solicitudSrv.create).toHaveBeenCalledWith(componente.solicitud);
    });

    it('no debe guardar cuando la validación falla', () => {
      componente.solicitud.numeroAtencion = '';
      componente.guardar();
      expect(solicitudSrv.create).not.toHaveBeenCalled();
    });

    it('debe establecer loading en falso cuando se crea la solicitud', () => {
      const respuestaMock = {
        id: 1,
        numeroAtencion: 'ATN-001',
        fechaSolicitud: '2025-01-15',
        detalleExamen: 'Examen general',
        tipoAnalisis: { id: 1, codigo: 'BHC', nombre: 'Biometría Hemática' },
        paciente: { id: 1, email: 'juan@test.com', rut: '12345678', dv: '5', nombres: 'Juan', paterno: 'Pérez', materno: 'García', telefono: '987654321' },
        laboratorio: { id: 1, nombre: 'Lab Central' }
      };
      solicitudSrv.create.and.returnValue(of(respuestaMock));

      componente.guardar();

      expect(componente.loading).toBeFalsy();
    });
  });

  describe('limpiar - Limpiar formulario', () => {
    it('debe resetear el formulario a su estado inicial', () => {
      componente.solicitud.numeroAtencion = 'ATN-001';
      componente.solicitud.detalleExamen = 'Examen';
      componente.errores['numeroAtencion'] = 'Error';

      componente.limpiar();

      expect(componente.solicitud.numeroAtencion).toBe('');
      expect(componente.solicitud.detalleExamen).toBe('');
      expect(componente.solicitud.laboratorio.id).toBe(0);
      expect(componente.solicitud.paciente.id).toBe(0);
      expect(componente.solicitud.tipoAnalisis.id).toBe(0);
      expect(Object.keys(componente.errores).length).toBe(0);
    });
  });

  describe('getNombreCompletoPaciente - Nombre del paciente', () => {
    it('debe retornar el nombre completo con RUT y dígito verificador', () => {
      const paciente = {
        id: 1,
        email: 'test@test.com',
        rut: '12345678',
        dv: '5',
        nombres: 'Juan',
        paterno: 'Pérez',
        materno: 'García',
        telefono: '987654321'
      };
      const resultado = componente.getNombreCompletoPaciente(paciente);
      expect(resultado).toBe('Juan Pérez García (12345678-5)');
    });
  });

  describe('getTipoAnalisisDisplay - Mostrar tipo de análisis', () => {
    it('debe retornar el código y nombre del tipo de análisis formateado', () => {
      const tipo = { id: 1, codigo: 'BHC', nombre: 'Biometría Hemática' };
      const resultado = componente.getTipoAnalisisDisplay(tipo);
      expect(resultado).toBe('BHC - Biometría Hemática');
    });
  });
});