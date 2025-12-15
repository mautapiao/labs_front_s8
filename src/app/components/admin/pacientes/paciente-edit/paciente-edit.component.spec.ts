import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PacienteEditComponent } from './paciente-edit.component';
import { PacienteService } from '../../../../services/paciente.service';
import { PacienteModel } from '../../../../models/paciente.model';

describe('PacienteEditComponent', () => {

  /*
Este test se realiza para verificar el correcto funcionamiento del componente de edición de pacientes. 
Se valida que el componente cargue correctamente los datos del paciente a partir del identificador 
obtenido desde la ruta, que aplique las validaciones definidas para los campos obligatorios y que 
ejecute la actualización del registro mediante el servicio correspondiente.
Asimismo, el test comprueba el comportamiento de las acciones de usuario, como la actualización 
del paciente, el restablecimiento del formulario a su estado original y la navegación al cancelar 
la edición, asegurando que la lógica del componente funcione de manera aislada mediante el uso 
de servicios simulados.
*/

  let componente: PacienteEditComponent;
  let fixture: ComponentFixture<PacienteEditComponent>;
  let pacienteSrv: jasmine.SpyObj<PacienteService>;
  let router: jasmine.SpyObj<Router>;

  const pacienteMock: PacienteModel = {
    id: 1,
    rut: '12345678',
    dv: '9',
    nombres: 'Juan',
    paterno: 'Pérez',
    materno: 'Gómez',
    email: 'juan@test.cl',
    telefono: '912345678'
  };

  beforeEach(async () => {
    const pacienteServiceMock = jasmine.createSpyObj('PacienteService', ['getById', 'update']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    await TestBed.configureTestingModule({
      imports: [PacienteEditComponent],
      providers: [
        { provide: PacienteService, useValue: pacienteServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => '1' }
            }
          }
        },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    pacienteSrv = TestBed.inject(PacienteService) as jasmine.SpyObj<PacienteService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(PacienteEditComponent);
    componente = fixture.componentInstance;
  });

  it('debo crear el componente sin problemas', () => {
    // Verifico que el componente existe
    expect(componente).toBeTruthy();
  });

  describe('ngOnInit - Inicializar y cargar datos', () => {
    it('debo cargar el paciente cuando el ID es válido', (done) => {
      // Simulo que obtengo un paciente del servidor
      pacienteSrv.getById.and.returnValue(of(pacienteMock));

      fixture.detectChanges();

      setTimeout(() => {
        // Debo tener los datos cargados
        expect(pacienteSrv.getById).toHaveBeenCalledWith(1);
        expect(componente.paciente).toEqual(pacienteMock);
        expect(componente.cargando).toBeFalsy();
        done();
      }, 100);
    });

    it('debo asignar el ID desde la URL correctamente', (done) => {
      // Simulo carga de datos
      pacienteSrv.getById.and.returnValue(of(pacienteMock));

      fixture.detectChanges();

      setTimeout(() => {
        // El ID debe estar asignado
        expect(componente.pacienteId).toBe(1);
        done();
      }, 100);
    });
  });

  describe('cargarPaciente - Cargar datos del servidor', () => {
    beforeEach(() => {
      componente.pacienteId = 1;
    });

    it('debo establecer cargando en falso cuando termina de cargar', (done) => {
      // Simulo que obtengo datos
      pacienteSrv.getById.and.returnValue(of(pacienteMock));

      componente.cargarPaciente();

      setTimeout(() => {
        // El indicador de carga debe estar en falso
        expect(componente.cargando).toBeFalsy();
        done();
      }, 100);
    });

    it('debo manejar error cuando falla la carga', (done) => {
      // Simulo un error del servidor
      pacienteSrv.getById.and.returnValue(
        throwError(() => new Error('Error al cargar'))
      );

      componente.cargarPaciente();

      setTimeout(() => {
        // El indicador de carga debe estar en falso
        expect(componente.cargando).toBeFalsy();
        done();
      }, 100);
    });
  });

  describe('validar - Validación del formulario', () => {
    beforeEach(() => {
      // Inicializo con datos válidos
      componente.paciente = { ...pacienteMock };
    });

    it('debo rechazar cuando el RUT está vacío', () => {
      // Dejo RUT vacío
      componente.paciente.rut = '';
      componente.paciente.dv = '9';

      const resultado = componente.validar();

      // Debe fallar la validación
      expect(resultado).toBeFalsy();
      expect(componente.errores['rut']).toBeTruthy();
    });

    it('debo rechazar cuando el DV está vacío', () => {
      // Dejo DV vacío
      componente.paciente.rut = '12345678';
      componente.paciente.dv = '';

      const resultado = componente.validar();

      // Debe fallar la validación
      expect(resultado).toBeFalsy();
      expect(componente.errores['dv']).toBeTruthy();
    });

    it('debo rechazar cuando los nombres están vacíos', () => {
      // Dejo nombres vacío
      componente.paciente.nombres = '';

      const resultado = componente.validar();

      // Debe fallar la validación
      expect(resultado).toBeFalsy();
      expect(componente.errores['nombres']).toBeTruthy();
    });

    it('debo rechazar cuando el apellido paterno está vacío', () => {
      // Dejo paterno vacío
      componente.paciente.paterno = '';

      const resultado = componente.validar();

      // Debe fallar la validación
      expect(resultado).toBeFalsy();
      expect(componente.errores['paterno']).toBeTruthy();
    });

    it('debo rechazar cuando el apellido materno está vacío', () => {
      // Dejo materno vacío
      componente.paciente.materno = '';

      const resultado = componente.validar();

      // Debe fallar la validación
      expect(resultado).toBeFalsy();
      expect(componente.errores['materno']).toBeTruthy();
    });

    it('debo rechazar cuando el email está vacío', () => {
      // Dejo email vacío
      componente.paciente.email = '';

      const resultado = componente.validar();

      // Debe fallar la validación
      expect(resultado).toBeFalsy();
      expect(componente.errores['email']).toBeTruthy();
    });

    it('debo rechazar cuando el teléfono está vacío', () => {
      // Dejo teléfono vacío
      componente.paciente.telefono = '';

      const resultado = componente.validar();

      // Debe fallar la validación
      expect(resultado).toBeFalsy();
      expect(componente.errores['telefono']).toBeTruthy();
    });

    it('debo rechazar cuando hay campos con solo espacios en blanco', () => {
      // Campos con espacios
      componente.paciente.nombres = '   ';
      componente.paciente.email = '   ';

      const resultado = componente.validar();

      // Debe fallar
      expect(resultado).toBeFalsy();
      expect(componente.errores['nombres']).toBeTruthy();
      expect(componente.errores['email']).toBeTruthy();
    });

    it('debo aceptar cuando todos los campos son válidos', () => {
      // Todos los campos están llenos
      const resultado = componente.validar();

      // Debe pasar
      expect(resultado).toBeTruthy();
      expect(Object.keys(componente.errores).length).toBe(0);
    });
  });

  describe('guardar - Actualizar el paciente', () => {
    beforeEach(() => {
      componente.pacienteId = 1;
      componente.paciente = { ...pacienteMock };
    });

    it('debo mostrar error cuando la validación falla', () => {
      // Intento guardar sin nombres
      componente.paciente.nombres = '';

      componente.guardar();

      // Swal debe mostrar error de validación
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Errores en el formulario',
          icon: 'error'
        })
      );
      // El servicio no debe ser llamado
      expect(pacienteSrv.update).not.toHaveBeenCalled();
    });

    it('debo llamar al servicio cuando los datos son válidos', () => {
      // Cambio datos válidos
      componente.paciente.nombres = 'Juan Editado';

      pacienteSrv.update.and.returnValue(
        of({ ...pacienteMock, nombres: 'Juan Editado' })
      );

      componente.guardar();

      // El servicio debe ser llamado con ID y datos
      expect(pacienteSrv.update).toHaveBeenCalledWith(1, componente.paciente);
    });

    it('debo mostrar mensaje de éxito cuando se actualiza correctamente', fakeAsync(() => {
      // Cambio datos válidos
      componente.paciente.nombres = 'Juan Actualizado';

      pacienteSrv.update.and.returnValue(
        of({ ...pacienteMock, nombres: 'Juan Actualizado' })
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
      // Cambio datos válidos
      componente.paciente.nombres = 'Juan Actualizado';

      pacienteSrv.update.and.returnValue(
        of({ ...pacienteMock, nombres: 'Juan Actualizado' })
      );

      componente.guardar();

      tick();

      // Debe navegar al listado
      expect(router.navigate).toHaveBeenCalledWith(['/pacientes']);
    }));

    it('debo manejar error cuando el servicio falla', fakeAsync(() => {
      // Cambio datos válidos
      componente.paciente.nombres = 'Juan Actualizado';

      // El servicio falla
      pacienteSrv.update.and.returnValue(
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
      // Cambio datos válidos
      componente.paciente.nombres = 'Juan Actualizado';

      pacienteSrv.update.and.returnValue(
        of({ ...pacienteMock, nombres: 'Juan Actualizado' })
      );

      componente.guardar();

      tick();

      // Loading debe volver a falso
      expect(componente.loading).toBeFalsy();
    }));

    it('debo establecer loading en falso después de error', fakeAsync(() => {
      // Cambio datos válidos
      componente.paciente.nombres = 'Juan Actualizado';

      // El servicio falla
      pacienteSrv.update.and.returnValue(
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
      componente.pacienteId = 1;
    });

    it('debo recargar los datos originales desde el servidor', (done) => {
      // Simulo datos originales
      pacienteSrv.getById.and.returnValue(of(pacienteMock));

      // Cambio los datos
      componente.paciente.nombres = 'Juan Modificado';

      // Reseteo
      componente.resetear();

      setTimeout(() => {
        // Los datos deben volver a los originales
        expect(componente.paciente).toEqual(pacienteMock);
        done();
      }, 100);
    });

    it('debo limpiar los errores cuando reseteo', () => {
      // Tengo errores
      componente.errores['nombres'] = 'Error';

      pacienteSrv.getById.and.returnValue(of(pacienteMock));

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
      expect(router.navigate).toHaveBeenCalledWith(['/pacientes']);
    });
  });

  describe('Estados iniciales', () => {
    it('debo inicializar con campos vacíos', () => {
      // Compruebo estado inicial
      expect(componente.paciente.rut).toBe('');
      expect(componente.paciente.nombres).toBe('');
      expect(componente.paciente.email).toBe('');
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