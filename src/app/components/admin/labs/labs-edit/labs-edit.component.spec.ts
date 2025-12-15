import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { fakeAsync, tick } from '@angular/core/testing';

import { LabsEditComponent } from './labs-edit.component';
import { LaboratorioService } from '../../../../services/laboratorio.service';

describe('LabsEditComponent', () => {

  let componente: LabsEditComponent;
  let fixture: ComponentFixture<LabsEditComponent>;
  let laboratorioServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {

    laboratorioServiceMock = {
      getById: jasmine.createSpy('getById').and.returnValue(
        of({ id: 1, nombre: 'Laboratorio Central' })
      ),
      update: jasmine.createSpy('update').and.returnValue(
        of({ id: 1, nombre: 'Laboratorio Actualizado' })
      )
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    await TestBed.configureTestingModule({
      imports: [LabsEditComponent],
      providers: [
        { provide: LaboratorioService, useValue: laboratorioServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LabsEditComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería cargar el laboratorio al inicializar', () => {
    expect(laboratorioServiceMock.getById).toHaveBeenCalledWith(1);
    expect(componente.laboratorio.nombre).toBe('Laboratorio Central');
    expect(componente.cargando).toBeFalse();
  });

  it('debería mostrar Swal y navegar si falla la carga', async () => {
    laboratorioServiceMock.getById.and.returnValue(
      throwError(() => new Error('error'))
    );

    componente.cargarLaboratorio();

    await Promise.resolve();

    expect(Swal.fire).toHaveBeenCalledWith(
      'Error',
      'No se pudo cargar el registro',
      'error'
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/laboratorios']);
  });

 it('debería mostrar Swal si validar retorna false', () => {
  componente.laboratorio.nombre = '';

  componente.guardar();

  expect(Swal.fire).toHaveBeenCalledWith(
    jasmine.objectContaining({
      title: 'Errores en el formulario',
      icon: 'error'
    })
  );
});

it('debería mostrar Swal si falla el update', () => {
  laboratorioServiceMock.update.and.returnValue(
    throwError(() => new Error('error'))
  );

  componente.laboratorio.nombre = 'Editado';
  componente.guardar();

  expect(Swal.fire).toHaveBeenCalledWith(
    jasmine.objectContaining({
      title: 'Error',
      icon: 'error'
    })
  );
});


  it('debería llamar update si el formulario es válido', () => {
    componente.laboratorio.nombre = 'Editado';

    componente.guardar();

    expect(laboratorioServiceMock.update)
      .toHaveBeenCalledWith(1, componente.laboratorio);
  });

  it('debería mostrar Swal si falla el update', () => {
    laboratorioServiceMock.update.and.returnValue(
      throwError(() => new Error('error'))
    );

    componente.laboratorio.nombre = 'Editado';
    componente.guardar();

   expect(Swal.fire).toHaveBeenCalledWith(
  jasmine.objectContaining({
    title: 'Error',
    text: 'No se pudo actualizar el registro. Intenta de nuevo.',
    icon: 'error'
  })
);


  


  });

  it('debería recargar los datos al resetear', () => {
    componente.resetear();

    expect(laboratorioServiceMock.getById).toHaveBeenCalled();
  });

  it('debería navegar al cancelar', () => {
    componente.cancelar();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/laboratorios']);
  });

  it('debería mostrar Swal y redirigir si no viene el id en la ruta', fakeAsync(() => {
  // Reutiliza el spy existente
  const swalSpy = Swal.fire as jasmine.Spy;
  swalSpy.calls.reset();
  swalSpy.and.returnValue(Promise.resolve<any>(true));

  // Fuerza id inválido
  (TestBed.inject(ActivatedRoute) as any).snapshot.paramMap.get = () => null;

  // Ejecuta
  componente.ngOnInit();

  // ⏱️ Resuelve la Promise del Swal.then(...)
  tick();

  expect(swalSpy).toHaveBeenCalledWith(
    'Error',
    'No se especificó un registro para editar',
    'error'
  );

  expect(routerMock.navigate).toHaveBeenCalledWith(['/laboratorios']);
}));



});
