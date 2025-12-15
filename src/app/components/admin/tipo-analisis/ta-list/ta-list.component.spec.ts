import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { TaListComponent } from './ta-list.component';
import { TipoAnalisisService } from '../../../../services/tipo-analisis.service';

describe('TaListComponent', () => {
  let componente: TaListComponent;
  let fixture: ComponentFixture<TaListComponent>;
  let tipoAnalisisSrv: jasmine.SpyObj<TipoAnalisisService>;

  const tiposSimulados = [
    { id: 1, codigo: 'TA01', nombre: 'Hemograma' },
    { id: 2, codigo: 'TA02', nombre: 'Perfil Lipídico' }
  ];

  beforeEach(async () => {
    const serviceMock = jasmine.createSpyObj('TipoAnalisisService', ['getAll', 'delete']);

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    /*
    beforeEach crea mocks del TipoAnalisisService
    con métodos espías, espía Swal.fire
    para devolver confirmación, configura TestBed
    con el componente TaListComponent y proporciona
    los servicios mock, preparando el ambiente de prueba aislado
    */

    await TestBed.configureTestingModule({
      imports: [TaListComponent],
      providers: [
        { provide: TipoAnalisisService, useValue: serviceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => null }
            }
          }
        }
      ]
    }).compileComponents();

    tipoAnalisisSrv = TestBed.inject(TipoAnalisisService) as jasmine.SpyObj<TipoAnalisisService>;

    fixture = TestBed.createComponent(TaListComponent);
    componente = fixture.componentInstance;
  });

  it('debo crear el componente sin problemas', () => {
    // Verifico que el componente existe
    expect(componente).toBeTruthy();
  });

  describe('ngOnInit - Carga de datos al iniciar', () => {
    it('debo cargar la lista correctamente cuando el servicio responde', (done) => {
      // Simulo que el servicio devuelve tipos de análisis
      tipoAnalisisSrv.getAll.and.returnValue(of(tiposSimulados));

      fixture.detectChanges();

      setTimeout(() => {
        // Debo tener los datos cargados
        expect(componente.tipoAnalisis).toEqual(tiposSimulados);
        expect(componente.tipoAnalisis.length).toBe(2);
        // El loading debe estar en falso
        expect(componente.loading).toBeFalsy();
        // No debe haber error
        expect(componente.error).toBe('');
        done();
      }, 100);
    });

    it('debo mostrar mensaje de error cuando falla la carga', (done) => {
      // Simulo que el servicio falla
      tipoAnalisisSrv.getAll.and.returnValue(
        throwError(() => new Error('Error backend'))
      );

      fixture.detectChanges();

      setTimeout(() => {
        // Debe mostrar mensaje de error
        expect(componente.error).toBe('No se pudieron cargar los registros.');
        // Loading debe estar en falso
        expect(componente.loading).toBeFalsy();
        // La lista debe estar vacía
        expect(componente.tipoAnalisis.length).toBe(0);
        done();
      }, 100);
    });

    it('debo establecer loading en falso cuando termina de cargar', (done) => {
      // Simulo datos
      tipoAnalisisSrv.getAll.and.returnValue(of(tiposSimulados));

      fixture.detectChanges();

      setTimeout(() => {
        // Loading debe estar en falso
        expect(componente.loading).toBeFalsy();
        done();
      }, 100);
    });
  });

  describe('eliminar - Eliminar registro', () => {
    beforeEach(() => {
      // Simulo que tengo datos cargados
      componente.tipoAnalisis = tiposSimulados;
    });

    it('debo no hacer nada cuando el ID es undefined', fakeAsync(() => {
      // Intento eliminar sin ID
      componente.eliminar(undefined);

      tick();

      // El servicio no debe ser llamado
      expect(tipoAnalisisSrv.delete).not.toHaveBeenCalled();
      // La lista debe mantenerse igual
      expect(componente.tipoAnalisis.length).toBe(2);
    }));

    it('debo mostrar confirmación antes de eliminar', fakeAsync(() => {
      // Simulo que el usuario confirma la eliminación
      tipoAnalisisSrv.delete.and.returnValue(of(void 0));

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

    it('debo eliminar el registro del array cuando se confirma', fakeAsync(() => {
      // Simulo que el usuario confirma
      tipoAnalisisSrv.delete.and.returnValue(of(void 0));

      const idAEliminar = 1;
      const cantidadInicial = componente.tipoAnalisis.length;

      componente.eliminar(idAEliminar);

      tick();

      // El registro debe ser eliminado del array
      expect(componente.tipoAnalisis.length).toBe(cantidadInicial - 1);
      expect(componente.tipoAnalisis.find(t => t.id === idAEliminar)).toBeUndefined();
    }));

    it('debo llamar al servicio delete cuando se confirma', fakeAsync(() => {
      // Simulo confirmación
      tipoAnalisisSrv.delete.and.returnValue(of(void 0));

      const idAEliminar = 1;

      componente.eliminar(idAEliminar);

      tick();

      // El servicio debe ser llamado con el ID correcto
      expect(tipoAnalisisSrv.delete).toHaveBeenCalledWith(idAEliminar);
    }));

    it('debo mostrar mensaje de éxito cuando se elimina correctamente', fakeAsync(() => {
      // Simulo eliminación exitosa
      tipoAnalisisSrv.delete.and.returnValue(of(void 0));

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
      tipoAnalisisSrv.delete.and.returnValue(
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
      tipoAnalisisSrv.delete.and.returnValue(
        throwError(() => new Error('Error'))
      );

      const cantidadInicial = componente.tipoAnalisis.length;

      componente.eliminar(1);

      tick();

      // El array debe mantenerse igual
      expect(componente.tipoAnalisis.length).toBe(cantidadInicial);
    }));

    it('debo mostrar Swal de carga mientras se elimina', fakeAsync(() => {
      // Simulo eliminación
      tipoAnalisisSrv.delete.and.returnValue(of(void 0));

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
    it('debo inicializar con lista vacía', () => {
      // La lista debe estar vacía al principio
      expect(componente.tipoAnalisis).toEqual([]);
    });

    it('debo inicializar con loading en verdadero', () => {
      // Loading debe estar en verdadero al inicio
      expect(componente.loading).toBeTruthy();
    });

    it('debo inicializar sin error', () => {
      // El error debe estar vacío
      expect(componente.error).toBe('');
    });
  });
});