import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import Swal from 'sweetalert2';
import { PacienteListComponent } from './paciente-list.component';
import { PacienteService } from '../../../../services/paciente.service';
import { PacienteModel } from '../../../../models/paciente.model';

describe('PacienteListComponent', () => {
  let componente: PacienteListComponent;
  let fixture: ComponentFixture<PacienteListComponent>;
  let pacienteSrv: jasmine.SpyObj<PacienteService>;

  const pacientesMock: PacienteModel[] = [
    {
      id: 1,
      rut: '12345678',
      dv: '9',
      nombres: 'Juan',
      paterno: 'Pérez',
      materno: 'Gómez',
      email: 'juan@test.cl',
      telefono: '912345678'
    },
    {
      id: 2,
      rut: '87654321',
      dv: '5',
      nombres: 'María',
      paterno: 'López',
      materno: 'Rodríguez',
      email: 'maria@test.cl',
      telefono: '987654321'
    }
  ];

  beforeEach(async () => {
    const pacienteServiceMock = jasmine.createSpyObj('PacienteService', ['getAll', 'delete']);

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    await TestBed.configureTestingModule({
      imports: [
        PacienteListComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: PacienteService, useValue: pacienteServiceMock }
      ]
    }).compileComponents();

    pacienteSrv = TestBed.inject(PacienteService) as jasmine.SpyObj<PacienteService>;

    fixture = TestBed.createComponent(PacienteListComponent);
    componente = fixture.componentInstance;
  });

  it('debo crear el componente sin problemas', () => {
    // Verifico que el componente existe
    expect(componente).toBeTruthy();
  });

  describe('ngOnInit - Carga de datos al iniciar', () => {
    it('debo cargar la lista de pacientes correctamente', (done) => {
      // Simulo que el servicio devuelve pacientes
      pacienteSrv.getAll.and.returnValue(of(pacientesMock));

      fixture.detectChanges();

      setTimeout(() => {
        // Debo tener los pacientes cargados
        expect(pacienteSrv.getAll).toHaveBeenCalled();
        expect(componente.paciente).toEqual(pacientesMock);
        expect(componente.paciente.length).toBe(2);
        // El loading debe estar en falso
        expect(componente.loading).toBeFalsy();
        // No debe haber error
        expect(componente.error).toBe('');
        done();
      }, 100);
    });

    it('debo manejar error cuando falla la carga de pacientes', (done) => {
      // Simulo que el servicio falla
      pacienteSrv.getAll.and.returnValue(
        throwError(() => new Error('Error de carga'))
      );

      fixture.detectChanges();

      setTimeout(() => {
        // Debe mostrar mensaje de error
        expect(componente.error).toBe('No se pudieron cargar los registros.');
        // Loading debe estar en falso
        expect(componente.loading).toBeFalsy();
        // La lista debe estar vacía
        expect(componente.paciente.length).toBe(0);
        done();
      }, 100);
    });

    it('debo establecer loading en falso después de cargar', (done) => {
      // Simulo carga exitosa
      pacienteSrv.getAll.and.returnValue(of(pacientesMock));

      fixture.detectChanges();

      setTimeout(() => {
        // Loading debe estar en falso
        expect(componente.loading).toBeFalsy();
        done();
      }, 100);
    });
  });

  describe('eliminar - Eliminar paciente', () => {
    beforeEach(() => {
      // Simulo que tengo datos cargados
      componente.paciente = pacientesMock;
    });

    it('debo no hacer nada cuando el ID es undefined', fakeAsync(() => {
      // Intento eliminar sin ID
      componente.eliminar(undefined);

      tick();

      // El servicio no debe ser llamado
      expect(pacienteSrv.delete).not.toHaveBeenCalled();
      // La lista debe mantenerse igual
      expect(componente.paciente.length).toBe(2);
    }));

    it('debo mostrar confirmación antes de eliminar', fakeAsync(() => {
      // Simulo que el usuario confirma la eliminación
      pacienteSrv.delete.and.returnValue(of(void 0));

      componente.eliminar(1);

      tick();

      // Swal debe mostrar confirmación
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: '¿Eliminar este registro?',
          icon: 'warning'
        })
      );
    }));

    it('debo eliminar el paciente del array cuando se confirma', fakeAsync(() => {
      // Simulo que el usuario confirma
      pacienteSrv.delete.and.returnValue(of(void 0));

      const idAEliminar = 1;
      const cantidadInicial = componente.paciente.length;

      componente.eliminar(idAEliminar);

      tick();

      // El paciente debe ser eliminado del array
      expect(componente.paciente.length).toBe(cantidadInicial - 1);
      expect(componente.paciente.find(p => p.id === idAEliminar)).toBeUndefined();
    }));

    it('debo llamar al servicio delete con el ID correcto', fakeAsync(() => {
      // Simulo confirmación
      pacienteSrv.delete.and.returnValue(of(void 0));

      const idAEliminar = 1;

      componente.eliminar(idAEliminar);

      tick();

      // El servicio debe ser llamado con el ID correcto
      expect(pacienteSrv.delete).toHaveBeenCalledWith(idAEliminar);
    }));

    it('debo mostrar mensaje de éxito cuando se elimina correctamente', fakeAsync(() => {
      // Simulo eliminación exitosa
      pacienteSrv.delete.and.returnValue(of(void 0));

      componente.eliminar(1);

      tick();

      // Swal debe mostrar éxito
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: '¡Eliminado!',
          icon: 'success'
        })
      );
    }));

    it('debo mostrar error cuando falla la eliminación', fakeAsync(() => {
      // Simulo error en la eliminación
      pacienteSrv.delete.and.returnValue(
        throwError(() => new Error('Error al eliminar'))
      );

      componente.eliminar(1);

      tick();

      // Swal debe mostrar error
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Error',
          icon: 'error'
        })
      );
    }));

    it('debo mantener el array intacto cuando falla la eliminación', fakeAsync(() => {
      // Simulo error
      pacienteSrv.delete.and.returnValue(
        throwError(() => new Error('Error'))
      );

      const cantidadInicial = componente.paciente.length;

      componente.eliminar(1);

      tick();

      // El array debe mantenerse igual
      expect(componente.paciente.length).toBe(cantidadInicial);
    }));

    it('debo mostrar Swal de carga mientras se elimina', fakeAsync(() => {
      // Simulo eliminación
      pacienteSrv.delete.and.returnValue(of(void 0));

      componente.eliminar(1);

      tick();

      // Swal debe haber mostrado indicador de carga
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Eliminando...'
        })
      );
    }));
  });

  describe('Estados iniciales', () => {
    it('debo inicializar con lista de pacientes vacía', () => {
      // La lista debe estar vacía al principio
      expect(componente.paciente).toEqual([]);
    });

    it('debo inicializar con loading en verdadero', () => {
      // Loading debe estar en verdadero al inicio
      expect(componente.loading).toBeTruthy();
    });

    it('debo inicializar sin mensaje de error', () => {
      // El error debe estar vacío
      expect(componente.error).toBe('');
    });
  });
});