import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { SolicitudEditComponent } from './solicitud-edit.component';
import { SolicitudService } from '../../../services/solicitud.service';
import { LaboratorioService } from '../../../services/laboratorio.service';
import { PacienteService } from '../../../services/paciente.service';
import { TipoAnalisisService } from '../../../services/tipo-analisis.service';
import { of, throwError } from 'rxjs';

describe('SolicitudEditComponent', () => {
  let componente: SolicitudEditComponent;
  let fixture: ComponentFixture<SolicitudEditComponent>;
  let solicitudSrv: jasmine.SpyObj<SolicitudService>;
  let laboratorioSrv: jasmine.SpyObj<LaboratorioService>;
  let pacienteSrv: jasmine.SpyObj<PacienteService>;
  let tipoAnalisisSrv: jasmine.SpyObj<TipoAnalisisService>;

  beforeEach(async () => {
    const solicitudSpy = jasmine.createSpyObj('SolicitudService', ['getById', 'update']);
    const laboratorioSpy = jasmine.createSpyObj('LaboratorioService', ['getAll']);
    const pacienteSpy = jasmine.createSpyObj('PacienteService', ['getAll']);
    const tipoAnalisisSpy = jasmine.createSpyObj('TipoAnalisisService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [SolicitudEditComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: SolicitudService, useValue: solicitudSpy },
        { provide: LaboratorioService, useValue: laboratorioSpy },
        { provide: PacienteService, useValue: pacienteSpy },
        { provide: TipoAnalisisService, useValue: tipoAnalisisSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        }
      ]
    }).compileComponents();

    solicitudSrv = TestBed.inject(SolicitudService) as jasmine.SpyObj<SolicitudService>;
    laboratorioSrv = TestBed.inject(LaboratorioService) as jasmine.SpyObj<LaboratorioService>;
    pacienteSrv = TestBed.inject(PacienteService) as jasmine.SpyObj<PacienteService>;
    tipoAnalisisSrv = TestBed.inject(TipoAnalisisService) as jasmine.SpyObj<TipoAnalisisService>;

    fixture = TestBed.createComponent(SolicitudEditComponent);
    componente = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  describe('ngOnInit - Inicialización', () => {
    it('debe cargar datos cuando el ID es válido', (done) => {
      const labsSimulados = [{ id: 1, nombre: 'Lab Central' }];
      const pacientesSimulados = [{ id: 1, email: 'juan@test.com', rut: '12345678', dv: '5', nombres: 'Juan', paterno: 'Pérez', materno: 'García', telefono: '987654321' }];
      const tiposSimulados = [{ id: 1, codigo: 'BHC', nombre: 'Biometría Hemática' }];
      const solicitudSimulada = {
        id: 1,
        numeroAtencion: 'ATN-001',
        fechaSolicitud: '2025-01-15',
        detalleExamen: 'Examen general',
        tipoAnalisis: { id: 1, codigo: 'BHC', nombre: 'Biometría Hemática' },
        paciente: { id: 1, email: 'juan@test.com', rut: '12345678', dv: '5', nombres: 'Juan', paterno: 'Pérez', materno: 'García', telefono: '987654321' },
        laboratorio: { id: 1, nombre: 'Lab Central' }
      };

      laboratorioSrv.getAll.and.returnValue(of(labsSimulados));
      pacienteSrv.getAll.and.returnValue(of(pacientesSimulados));
      tipoAnalisisSrv.getAll.and.returnValue(of(tiposSimulados));
      solicitudSrv.getById.and.returnValue(of(solicitudSimulada));

      fixture.detectChanges();

      setTimeout(() => {
        expect(componente.solicitudId).toBe(1);
        expect(componente.laboratorios).toEqual(labsSimulados);
        expect(componente.pacientes).toEqual(pacientesSimulados);
        expect(componente.tiposAnalisis).toEqual(tiposSimulados);
        expect(componente.solicitud).toEqual(solicitudSimulada);
        expect(componente.loadingData).toBeFalsy();
        done();
      }, 100);
    });

    it('debe mostrar error cuando el ID no es válido', (done) => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [SolicitudEditComponent, HttpClientTestingModule, RouterTestingModule],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({ id: '' })
            }
          }
        ]
      });

      fixture = TestBed.createComponent(SolicitudEditComponent);
      componente = fixture.componentInstance;
      fixture.detectChanges();

      setTimeout(() => {
        expect(componente.solicitudId).toBeFalsy();
        done();
      }, 100);
    });
  });

  describe('cargarDatos - Carga de datos', () => {
    beforeEach(() => {
      componente.solicitudId = 1;
    });

    it('debe cargar todos los datos correctamente', (done) => {
      const labsSimulados = [{ id: 1, nombre: 'Lab Central' }];
      const pacientesSimulados = [{ id: 1, email: 'juan@test.com', rut: '12345678', dv: '5', nombres: 'Juan', paterno: 'Pérez', materno: 'García', telefono: '987654321' }];
      const tiposSimulados = [{ id: 1, codigo: 'BHC', nombre: 'Biometría Hemática' }];
      const solicitudSimulada = {
        id: 1,
        numeroAtencion: 'ATN-001',
        fechaSolicitud: '2025-01-15',
        detalleExamen: 'Examen general',
        tipoAnalisis: { id: 1, codigo: 'BHC', nombre: 'Biometría Hemática' },
        paciente: { id: 1, email: 'juan@test.com', rut: '12345678', dv: '5', nombres: 'Juan', paterno: 'Pérez', materno: 'García', telefono: '987654321' },
        laboratorio: { id: 1, nombre: 'Lab Central' }
      };

      laboratorioSrv.getAll.and.returnValue(of(labsSimulados));
      pacienteSrv.getAll.and.returnValue(of(pacientesSimulados));
      tipoAnalisisSrv.getAll.and.returnValue(of(tiposSimulados));
      solicitudSrv.getById.and.returnValue(of(solicitudSimulada));

      componente.cargarDatos();

      setTimeout(() => {
        expect(componente.loadingData).toBeFalsy();
        expect(componente.loadingSolicitud).toBeFalsy();
        done();
      }, 100);
    });

    it('debe manejar error cuando falla la carga de datos', (done) => {
      laboratorioSrv.getAll.and.returnValue(of([]));
      pacienteSrv.getAll.and.returnValue(of([]));
      tipoAnalisisSrv.getAll.and.returnValue(of([]));
      solicitudSrv.getById.and.returnValue(throwError(() => new Error('Error al cargar')));

      componente.cargarDatos();

      setTimeout(() => {
        expect(componente.loadingData).toBeFalsy();
        expect(componente.loadingSolicitud).toBeFalsy();
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

  describe('actualizar - Actualizar solicitud', () => {
    beforeEach(() => {
      componente.solicitudId = 1;
      componente.solicitud = {
        id: 1,
        numeroAtencion: 'ATN-001',
        fechaSolicitud: '2025-01-15',
        detalleExamen: 'Examen general',
        tipoAnalisis: { id: 1, codigo: 'BHC', nombre: 'Biometría Hemática' },
        paciente: { id: 1, email: 'juan@test.com', rut: '12345678', dv: '5', nombres: 'Juan', paterno: 'Pérez', materno: 'García', telefono: '987654321' },
        laboratorio: { id: 1, nombre: 'Lab Central' }
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
      solicitudSrv.update.and.returnValue(of(respuestaMock));

      componente.actualizar();

      expect(solicitudSrv.update).toHaveBeenCalled();
      expect(componente.loading).toBeFalsy();
    });

    it('no debe actualizar cuando la validación falla', () => {
      componente.solicitud.numeroAtencion = '';
      componente.actualizar();
      expect(solicitudSrv.update).not.toHaveBeenCalled();
    });

    it('debe manejar error cuando falla la actualización', () => {
      solicitudSrv.update.and.returnValue(throwError(() => new Error('Error al actualizar')));

      componente.actualizar();

      expect(componente.loading).toBeFalsy();
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

  describe('recargar - Recargar datos', () => {
    it('debe llamar a cargarDatos cuando se ejecuta recargar', (done) => {
      const solicitudMock = {
        id: 1,
        numeroAtencion: 'ATN-001',
        fechaSolicitud: '2025-01-15',
        detalleExamen: 'Examen general',
        tipoAnalisis: { id: 1, codigo: 'BHC', nombre: 'Biometría Hemática' },
        paciente: { id: 1, email: 'juan@test.com', rut: '12345678', dv: '5', nombres: 'Juan', paterno: 'Pérez', materno: 'García', telefono: '987654321' },
        laboratorio: { id: 1, nombre: 'Lab Central' }
      };

      componente.solicitudId = 1;
      spyOn(componente, 'cargarDatos');

      laboratorioSrv.getAll.and.returnValue(of([]));
      pacienteSrv.getAll.and.returnValue(of([]));
      tipoAnalisisSrv.getAll.and.returnValue(of([]));
      solicitudSrv.getById.and.returnValue(of(solicitudMock));

      componente.recargar();

      setTimeout(() => {
        expect(componente.cargarDatos).toHaveBeenCalled();
        done();
      }, 100);
    });
  });
});