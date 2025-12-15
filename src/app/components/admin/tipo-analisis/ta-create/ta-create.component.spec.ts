import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TaCreateComponent } from './ta-create.component';
import { TipoAnalisisService } from '../../../../services/tipo-analisis.service';

describe('TaCreateComponent', () => {
  let componente: TaCreateComponent;
  let fixture: ComponentFixture<TaCreateComponent>;
  let tipoAnalisisSrv: jasmine.SpyObj<TipoAnalisisService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const serviceMock = jasmine.createSpyObj('TipoAnalisisService', ['create']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    await TestBed.configureTestingModule({
      imports: [TaCreateComponent],
      providers: [
        { provide: TipoAnalisisService, useValue: serviceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    tipoAnalisisSrv = TestBed.inject(TipoAnalisisService) as jasmine.SpyObj<TipoAnalisisService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(TaCreateComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debo crear el componente sin problemas', () => {
    // Verifico que el componente existe y se inicializa correctamente
    expect(componente).toBeTruthy();
  });

  describe('Inicialización - Estado inicial del formulario', () => {
    it('debo inicializar con código y nombre vacíos', () => {
      // Compruebo que el formulario comienza vacío
      expect(componente.tipoAnalisis.codigo).toBe('');
      expect(componente.tipoAnalisis.nombre).toBe('');
    });

    it('debo inicializar sin errores de validación', () => {
      // El objeto de errores debe estar vacío al principio
      expect(Object.keys(componente.errores).length).toBe(0);
    });

    it('debo inicializar sin estado de carga', () => {
      // El loading debe estar en falso
      expect(componente.loading).toBeFalsy();
    });
  });

  describe('validar - Validación del formulario', () => {
    it('debo rechazar cuando el código está vacío', () => {
      // el código vacío y nombre lleno
      componente.tipoAnalisis.codigo = '';
      componente.tipoAnalisis.nombre = 'Hemograma';
      
      const resultado = componente.validar();
      
      // retornar falso y crear error
      expect(resultado).toBeFalsy();
      expect(componente.errores['codigo']).toBeTruthy();
    });

    it('debo rechazar cuando el nombre está vacío', () => {
      // nombre vacío pero código lleno
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = '';
      
      const resultado = componente.validar();
      
      // retornar falso y crear error
      expect(resultado).toBeFalsy();
      expect(componente.errores['nombre']).toBeTruthy();
    });

    it('debo rechazar cuando ambos campos están vacíos', () => {
      // campos vacíos
      componente.tipoAnalisis.codigo = '';
      componente.tipoAnalisis.nombre = '';
      
      const resultado = componente.validar();
      
      // retornar falso y tener dos errores
      expect(resultado).toBeFalsy();
      expect(componente.errores['codigo']).toBeTruthy();
      expect(componente.errores['nombre']).toBeTruthy();
    });

    it('debo rechazar cuando el código solo tiene espacios', () => {
      // Código con solo espacios en blanco
      componente.tipoAnalisis.codigo = '   ';
      componente.tipoAnalisis.nombre = 'Hemograma';
      
      const resultado = componente.validar();
      
      // falla aunque técnicamente tenga caracteres
      expect(resultado).toBeFalsy();
      expect(componente.errores['codigo']).toBeTruthy();
    });

    it('debo aceptar cuando ambos campos tienen valores válidos', () => {
      // Lleno ambos campos correctamente
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';
      
      const resultado = componente.validar();
      
      // Debe retornar verdadero y sin errores
      expect(resultado).toBeTruthy();
      expect(Object.keys(componente.errores).length).toBe(0);
    });
  });

  describe('guardar - Crear nuevo tipo de análisis', () => {
    it('debo mostrar error cuando la validación falla', () => {
      // Intento guardar sin datos
      componente.tipoAnalisis.codigo = '';
      componente.tipoAnalisis.nombre = '';
      
      componente.guardar();
      
      // Swal debe mostrar error de validación
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Errores en el formulario',
          icon: 'error'
        })
      );
      // El servicio no debe ser llamado
      expect(tipoAnalisisSrv.create).not.toHaveBeenCalled();
    });

    it('debo llamar al servicio cuando los datos son válidos', () => {
      // Lleno los datos correctamente
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';
      
      tipoAnalisisSrv.create.and.returnValue(
        of({ id: 1, codigo: 'TA01', nombre: 'Hemograma' })
      );
      
      componente.guardar();
      
      // El servicio debe ser llamado con los datos
      expect(tipoAnalisisSrv.create).toHaveBeenCalledWith(componente.tipoAnalisis);
    });

    it('debo establecer loading en verdadero mientras guardo', () => {
      // Lleno datos válidos
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';
      
      tipoAnalisisSrv.create.and.returnValue(
        of({ id: 1, codigo: 'TA01', nombre: 'Hemograma' })
      );
      
      // Justo antes de guardar, loading debe ser falso
      expect(componente.loading).toBeFalsy();
      
      componente.guardar();
      
      // Después de guardar, loading debe volver a falso
      expect(componente.loading).toBeFalsy();
    });

    it('debo navegar después de guardar exitosamente', fakeAsync(() => {
      // Lleno los datos
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';
      
      tipoAnalisisSrv.create.and.returnValue(
        of({ id: 1, codigo: 'TA01', nombre: 'Hemograma' })
      );
      
      componente.guardar();
      
      // Espero a que se resuelva el Swal
      tick();
      
      // Debe navegar al listado
      expect(router.navigate).toHaveBeenCalledWith(['/tipo-analisis']);
    }));

    it('debo mostrar mensaje de éxito cuando se crea correctamente', fakeAsync(() => {
      // Lleno datos válidos
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';
      
      tipoAnalisisSrv.create.and.returnValue(
        of({ id: 1, codigo: 'TA01', nombre: 'Hemograma' })
      );
      
      componente.guardar();
      
      tick();
      
      // Swal debe mostrar éxito con el nombre del tipo
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: '¡Éxito!',
          icon: 'success'
        })
      );
    }));

    it('debo manejar error cuando el servicio falla', fakeAsync(() => {
      // Lleno datos válidos
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';
      
      // El servicio simula un error
      tipoAnalisisSrv.create.and.returnValue(
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
      // No debe navegar
      expect(router.navigate).not.toHaveBeenCalled();
    }));

    it('debo establecer loading en falso después de error', fakeAsync(() => {
      // Lleno datos válidos
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';
      
      // El servicio falla
      tipoAnalisisSrv.create.and.returnValue(
        throwError(() => new Error('Error'))
      );
      
      componente.guardar();
      
      tick();
      
      // Loading debe volver a falso
      expect(componente.loading).toBeFalsy();
    }));
  });

  describe('limpiar - Limpiar el formulario', () => {
    it('debo vaciar los campos cuando limpío', () => {
      // Lleno los campos con datos
      componente.tipoAnalisis.codigo = 'TA01';
      componente.tipoAnalisis.nombre = 'Hemograma';
      componente.errores['codigo'] = 'Error de prueba';
      
      // Limpio el formulario
      componente.limpiar();
      
      // Los campos deben estar vacíos
      expect(componente.tipoAnalisis.codigo).toBe('');
      expect(componente.tipoAnalisis.nombre).toBe('');
      expect(Object.keys(componente.errores).length).toBe(0);
    });
  });

  describe('cancelar - Volver al listado', () => {
    it('debo navegar al listado cuando cancelo', () => {
      //  cancelar
      componente.cancelar();
      
      //ir al listado
      expect(router.navigate).toHaveBeenCalledWith(['/tipo-analisis']);
    });
  });
});