import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TaEditComponent } from './ta-edit.component';
import { TipoAnalisisService } from '../../../../services/tipo-analisis.service';

describe('TaEditComponent', () => {
  let componente: TaEditComponent;
  let fixture: ComponentFixture<TaEditComponent>;
  let tipoAnalisisSrv: jasmine.SpyObj<TipoAnalisisService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  beforeEach(async () => {
    const serviceMock = jasmine.createSpyObj('TipoAnalisisService', ['getById', 'update']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    await TestBed.configureTestingModule({
      imports: [TaEditComponent],
      providers: [
        { provide: TipoAnalisisService, useValue: serviceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => '1' }
            }
          }
        }
      ]
    }).compileComponents();

    tipoAnalisisSrv = TestBed.inject(TipoAnalisisService) as jasmine.SpyObj<TipoAnalisisService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(TaEditComponent);
    componente = fixture.componentInstance;
  });

  it('debo crear el componente sin problemas', () => {
    // Verifico que el componente existe
    expect(componente).toBeTruthy();
  });

  describe('ngOnInit - Inicializar y cargar datos', () => {
    it('debo cargar el tipo de análisis cuando el ID es válido', (done) => {
      // Simulo que obtengo un tipo de análisis del servidor
      const tipoMock = { id: 1, codigo: 'TA01', nombre: 'Hemograma' };
      tipoAnalisisSrv.getById.and.returnValue(of(tipoMock));

      fixture.detectChanges();

      setTimeout(() => {
        // Debo tener los datos cargados
        expect(componente.tipoAnalisis).toEqual(tipoMock);
        expect(componente.cargando).toBeFalsy();
        done();
      }, 100);
    });

    it('debo asignar el ID desde la URL cuando está disponible', (done) => {
      // Configuro el mock para devolver datos
      const tipoMock = { id: 1, codigo: 'TA01', nombre: 'Hemograma' };
      tipoAnalisisSrv.getById.and.returnValue(of(tipoMock));

      // Detecto cambios para ejecutar ngOnInit
      fixture.detectChanges();

      setTimeout(() => {
        // El tipoAnalisisId debe estar definido (viene del mock que devuelve '1')
        expect(componente.tipoAnalisisId).toBe(1);
        done();
      }, 100);
    });
  });

  describe('cargarTipoAnalisis - Cargar datos del servidor', () => {
    beforeEach(() => {
      componente.tipoAnalisisId = 1;
    });

    it('debo establecer cargando en falso cuando termina de cargar', (done) => {
      // Simulo que obtengo datos
      const tipoMock = { id: 1, codigo: 'TA01', nombre: 'Hemograma' };
      tipoAnalisisSrv.getById.and.returnValue(of(tipoMock));

      componente.cargarTipoAnalisis();

      setTimeout(() => {
        // El indicador de carga debe estar en falso
        expect(componente.cargando).toBeFalsy();
        done();
      }, 100);
    });

    it('debo manejar error cuando falla la carga', (done) => {
      // Simulo un error del servidor
      tipoAnalisisSrv.getById.and.returnValue(
        throwError(() => new Error('Error al cargar'))
      );

      componente.cargarTipoAnalisis();

      setTimeout(() => {
        // El indicador de carga debe estar en falso
        expect(componente.cargando).toBeFalsy();
        done();
      }, 100);
    });
  });

  describe('validar - Validación del formulario', () => {
    it('debo rechazar cuando el código está vacío', () => {
      // Dejo código vacío
      componente.tipoAnalisis.codigo = '';
      componente.tipoAnalisis.nombre = 'Hemograma';

      const resultado = componente.validar();

      // Debe fallar la validación
      expect(resultado).toBeFalsy();
      expect(componente.errores['codigo']).toBeTruthy();
    });

    it('debo rechazar cuando el nombre está vacío', () => {
      // Dejo nombre vacío
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = '';

      const resultado = componente.validar();

      // Debe fallar la validación
      expect(resultado).toBeFalsy();
      expect(componente.errores['nombre']).toBeTruthy();
    });

    it('debo rechazar cuando ambos campos tienen solo espacios', () => {
      // Ambos con espacios en blanco
      componente.tipoAnalisis.codigo = '   ';
      componente.tipoAnalisis.nombre = '   ';

      const resultado = componente.validar();

      // Debe fallar
      expect(resultado).toBeFalsy();
      expect(componente.errores['codigo']).toBeTruthy();
      expect(componente.errores['nombre']).toBeTruthy();
    });

    it('debo aceptar cuando ambos campos tienen valores válidos', () => {
      // Lleno correctamente
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';

      const resultado = componente.validar();

      // Debe pasar
      expect(resultado).toBeTruthy();
      expect(Object.keys(componente.errores).length).toBe(0);
    });
  });

  describe('guardar - Actualizar el registro', () => {
    beforeEach(() => {
      componente.tipoAnalisisId = 1;
    });

    it('debo mostrar error cuando la validación falla', () => {
      // Intento guardar sin código
      componente.tipoAnalisis.codigo = '';
      componente.tipoAnalisis.nombre = 'Hemograma';

      componente.guardar();

      // Swal debe mostrar error de validación
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Errores en el formulario',
          icon: 'error'
        })
      );
      // El servicio no debe ser llamado
      expect(tipoAnalisisSrv.update).not.toHaveBeenCalled();
    });

    it('debo llamar al servicio cuando los datos son válidos', () => {
      // Lleno los datos correctamente
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';

      tipoAnalisisSrv.update.and.returnValue(
        of({ id: 1, codigo: 'TA01', nombre: 'Hemograma' })
      );

      componente.guardar();

      // El servicio debe ser llamado con ID y datos
      expect(tipoAnalisisSrv.update).toHaveBeenCalledWith(1, componente.tipoAnalisis);
    });

    it('debo mostrar mensaje de éxito cuando se actualiza correctamente', fakeAsync(() => {
      // Lleno datos válidos
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma actualizado';

      tipoAnalisisSrv.update.and.returnValue(
        of({ id: 1, codigo: 'TA01', nombre: 'Hemograma actualizado' })
      );

      componente.guardar();

      tick();

      // Swal debe mostrar éxito
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: '¡Actualizado!',
          icon: 'success'
        })
      );
    }));

    it('debo navegar después de actualizar exitosamente', fakeAsync(() => {
      // Lleno datos válidos
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';

      tipoAnalisisSrv.update.and.returnValue(
        of({ id: 1, codigo: 'TA01', nombre: 'Hemograma' })
      );

      componente.guardar();

      tick();

      // Debe navegar al listado
      expect(router.navigate).toHaveBeenCalledWith(['/tipo-analisis']);
    }));

    it('debo manejar error cuando el servicio falla', fakeAsync(() => {
      // Lleno datos válidos
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';

      // El servicio falla
      tipoAnalisisSrv.update.and.returnValue(
        throwError(() => new Error('Error del servidor'))
      );

      componente.guardar();

      tick();

      // Swal debe mostrar error
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Error',
          icon: 'error'
        })
      );
    }));

    it('debo establecer loading en falso después de actualizar', fakeAsync(() => {
      // Lleno datos válidos
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';

      tipoAnalisisSrv.update.and.returnValue(
        of({ id: 1, codigo: 'TA01', nombre: 'Hemograma' })
      );

      componente.guardar();

      tick();

      // Loading debe volver a falso
      expect(componente.loading).toBeFalsy();
    }));

    it('debo establecer loading en falso después de error', fakeAsync(() => {
      // Lleno datos válidos
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';

      // El servicio falla
      tipoAnalisisSrv.update.and.returnValue(
        throwError(() => new Error('Error'))
      );

      componente.guardar();

      tick();

      // Loading debe volver a falso
      expect(componente.loading).toBeFalsy();
    }));
  });

  describe('resetear - Recargar datos originales', () => {
    beforeEach(() => {
      componente.tipoAnalisisId = 1;
    });

    it('debo recargar los datos originales desde el servidor', (done) => {
      // Simulo datos originales
      const tipoMock = { id: 1, codigo: 'TA01', nombre: 'Hemograma' };
      tipoAnalisisSrv.getById.and.returnValue(of(tipoMock));

      // Cambio los datos
      componente.tipoAnalisis.nombre = 'Hemograma modificado';

      // Reseteo
      componente.resetear();

      setTimeout(() => {
        // Los datos deben volver a los originales
        expect(componente.tipoAnalisis).toEqual(tipoMock);
        done();
      }, 100);
    });

    it('debo limpiar los errores cuando reseteo', () => {
      // Tengo errores
      componente.errores['codigo'] = 'Error';

      const tipoMock = { id: 1, codigo: 'TA01', nombre: 'Hemograma' };
      tipoAnalisisSrv.getById.and.returnValue(of(tipoMock));

      // Reseteo
      componente.resetear();

      // Los errores deben estar limpios
      expect(Object.keys(componente.errores).length).toBe(0);
    });
  });

  describe('cancelar - Volver al listado', () => {
    it('debo navegar al listado cuando cancelo', () => {
      // Presiono cancelar
      componente.cancelar();

      // Debe navegar
      expect(router.navigate).toHaveBeenCalledWith(['/tipo-analisis']);
    });
  });

  describe('Estados iniciales', () => {
    it('debo inicializar con campos vacíos', () => {
      // Compruebo estado inicial
      expect(componente.tipoAnalisis.codigo).toBe('');
      expect(componente.tipoAnalisis.nombre).toBe('');
    });

    it('debo inicializar sin errores', () => {
      // El objeto de errores debe estar vacío
      expect(Object.keys(componente.errores).length).toBe(0);
    });

    it('debo inicializar con loading en falso', () => {
      // Loading debe estar en falso
      expect(componente.loading).toBeFalsy();
    });

    it('debo inicializar con cargando en verdadero', () => {
      // El indicador de carga inicial debe estar en verdadero
      expect(componente.cargando).toBeTruthy();
    });
  });
});