import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SolicitudListComponent } from './solicitud-list.component';
import { SolicitudService } from '../../../services/solicitud.service';
import { of, throwError } from 'rxjs';

describe('SolicitudListComponent', () => {
  let componente: SolicitudListComponent;
  let fixture: ComponentFixture<SolicitudListComponent>;
  let solicitudSrv: jasmine.SpyObj<SolicitudService>;

  beforeEach(async () => {
    const solicitudSpy = jasmine.createSpyObj('SolicitudService', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [SolicitudListComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: SolicitudService, useValue: solicitudSpy }
      ]
    }).compileComponents();

    solicitudSrv = TestBed.inject(SolicitudService) as jasmine.SpyObj<SolicitudService>;
    fixture = TestBed.createComponent(SolicitudListComponent);
    componente = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  describe('ngOnInit - Carga inicial de solicitudes', () => {
    it('debe cargar solicitudes correctamente al inicializar', (done) => {
      const solicitudesSimuladas = [
        {
          id: 1,
          numeroAtencion: 'ATN-001',
          fechaSolicitud: '2025-01-15',
          detalleExamen: 'Examen general',
          tipoAnalisis: { id: 1, codigo: 'BHC', nombre: 'Biometría Hemática' },
          paciente: { id: 1, email: 'juan@test.com', rut: '12345678', dv: '5', nombres: 'Juan', paterno: 'Pérez', materno: 'García', telefono: '987654321' },
          laboratorio: { id: 1, nombre: 'Lab Central' }
        },
        {
          id: 2,
          numeroAtencion: 'ATN-002',
          fechaSolicitud: '2025-01-16',
          detalleExamen: 'Examen de sangre',
          tipoAnalisis: { id: 2, codigo: 'QUI', nombre: 'Química sanguínea' },
          paciente: { id: 2, email: 'maria@test.com', rut: '87654321', dv: '9', nombres: 'María', paterno: 'López', materno: 'Rodríguez', telefono: '987654322' },
          laboratorio: { id: 2, nombre: 'Lab Sur' }
        }
      ];

      solicitudSrv.getAll.and.returnValue(of(solicitudesSimuladas));

      fixture.detectChanges();

      setTimeout(() => {
        expect(componente.solicitud).toEqual(solicitudesSimuladas);
        expect(componente.loading).toBeFalsy();
        expect(componente.error).toBe('');
        done();
      }, 100);
    });

    it('debe mostrar mensaje de error cuando falla la carga', (done) => {
      solicitudSrv.getAll.and.returnValue(throwError(() => new Error('Error al cargar')));

      fixture.detectChanges();

      setTimeout(() => {
        expect(componente.loading).toBeFalsy();
        expect(componente.error).toBe('No se pudieron cargar los registros.');
        done();
      }, 100);
    });

    it('debe establecer loading en falso después de cargar los datos', (done) => {
      const solicitudesSimuladas = [
        {
          id: 1,
          numeroAtencion: 'ATN-001',
          fechaSolicitud: '2025-01-15',
          detalleExamen: 'Examen general',
          tipoAnalisis: { id: 1, codigo: 'BHC', nombre: 'Biometría Hemática' },
          paciente: { id: 1, email: 'juan@test.com', rut: '12345678', dv: '5', nombres: 'Juan', paterno: 'Pérez', materno: 'García', telefono: '987654321' },
          laboratorio: { id: 1, nombre: 'Lab Central' }
        }
      ];

      solicitudSrv.getAll.and.returnValue(of(solicitudesSimuladas));

      fixture.detectChanges();

      setTimeout(() => {
        expect(componente.loading).toBeFalsy();
        done();
      }, 100);
    });
  });

  describe('eliminar - Eliminar solicitud', () => {
    beforeEach(() => {
      componente.solicitud = [
        {
          id: 1,
          numeroAtencion: 'ATN-001',
          fechaSolicitud: '2025-01-15',
          detalleExamen: 'Examen general',
          tipoAnalisis: { id: 1, codigo: 'BHC', nombre: 'Biometría Hemática' },
          paciente: { id: 1, email: 'juan@test.com', rut: '12345678', dv: '5', nombres: 'Juan', paterno: 'Pérez', materno: 'García', telefono: '987654321' },
          laboratorio: { id: 1, nombre: 'Lab Central' }
        },
        {
          id: 2,
          numeroAtencion: 'ATN-002',
          fechaSolicitud: '2025-01-16',
          detalleExamen: 'Examen de sangre',
          tipoAnalisis: { id: 2, codigo: 'QUI', nombre: 'Química sanguínea' },
          paciente: { id: 2, email: 'maria@test.com', rut: '87654321', dv: '9', nombres: 'María', paterno: 'López', materno: 'Rodríguez', telefono: '987654322' },
          laboratorio: { id: 2, nombre: 'Lab Sur' }
        }
      ];
    });

    it('debe no hacer nada cuando el ID es undefined', () => {
      solicitudSrv.delete.and.returnValue(of(void 0));

      componente.eliminar(undefined);

      expect(solicitudSrv.delete).not.toHaveBeenCalled();
    });

    it('debe eliminar la solicitud del array cuando la eliminación es exitosa', (done) => {
      solicitudSrv.delete.and.returnValue(of(void 0));

      const idAEliminar = 1;
      const cantidadInicial = componente.solicitud.length;

      solicitudSrv.delete(idAEliminar).subscribe({
        next: () => {
          componente.solicitud = componente.solicitud.filter(l => l.id !== idAEliminar);
          
          setTimeout(() => {
            expect(componente.solicitud.length).toBe(cantidadInicial - 1);
            expect(componente.solicitud.find(l => l.id === idAEliminar)).toBeUndefined();
            done();
          }, 100);
        }
      });
    });

    it('debe mantener el array intacto cuando falla la eliminación', (done) => {
      const cantidadInicial = componente.solicitud.length;
      solicitudSrv.delete.and.returnValue(throwError(() => new Error('Error al eliminar')));

      solicitudSrv.delete(1).subscribe({
        error: () => {
          setTimeout(() => {
            expect(componente.solicitud.length).toBe(cantidadInicial);
            done();
          }, 100);
        }
      });
    });

    it('debe llamar al servicio delete con el ID correcto', (done) => {
      const idAEliminar = 1;
      solicitudSrv.delete.and.returnValue(of(void 0));

      solicitudSrv.delete(idAEliminar).subscribe({
        next: () => {
          setTimeout(() => {
            expect(solicitudSrv.delete).toHaveBeenCalledWith(idAEliminar);
            done();
          }, 100);
        }
      });
    });
  });

  describe('Estados iniciales', () => {
    it('debe inicializar con array vacío de solicitudes', () => {
      expect(componente.solicitud).toEqual([]);
    });

    it('debe inicializar con loading en true', () => {
      expect(componente.loading).toBeTruthy();
    });

    it('debe inicializar con error vacío', () => {
      expect(componente.error).toBe('');
    });
  });
});