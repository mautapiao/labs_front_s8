import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { LabsListComponent } from './labs-list.component';
import { LaboratorioService } from '../../../../services/laboratorio.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('LabsListComponent', () => {

  let componente: LabsListComponent;
  let fixture: ComponentFixture<LabsListComponent>;
  let laboratorioServiceMock: any;
  let swalSpy: jasmine.Spy;

  beforeEach(async () => {

    laboratorioServiceMock = {
      getAll: jasmine.createSpy('getAll').and.returnValue(
        of([
          { id: 1, nombre: 'Lab A' },
          { id: 2, nombre: 'Lab B' }
        ])
      ),
      delete: jasmine.createSpy('delete').and.returnValue(of({}))
    };

    swalSpy = spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    await TestBed.configureTestingModule({
      imports: [
        LabsListComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: LaboratorioService, useValue: laboratorioServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LabsListComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit
  });

  // Inicialización
  
  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería cargar la lista de laboratorios al iniciar', () => {
    expect(laboratorioServiceMock.getAll).toHaveBeenCalled();
    expect(componente.laboratorios.length).toBe(2);
    expect(componente.loading).toBeFalse();
  });

  it('debería manejar error al cargar laboratorios', () => {
    laboratorioServiceMock.getAll.and.returnValue(
      throwError(() => new Error('Error backend'))
    );

    componente.ngOnInit();

    expect(componente.error).toBe('No se pudieron cargar los registros.');
    expect(componente.loading).toBeFalse();
  });

  // Eliminar
  
  it('no debería hacer nada si eliminar recibe id undefined', () => {
    componente.eliminar(undefined);

    expect(swalSpy).not.toHaveBeenCalled();
    expect(laboratorioServiceMock.delete).not.toHaveBeenCalled();
  });

  it('debería eliminar el laboratorio si el usuario confirma', fakeAsync(() => {
    componente.eliminar(1);
    tick(); // resuelve Swal.then

    expect(laboratorioServiceMock.delete).toHaveBeenCalledWith(1);
    expect(componente.laboratorios.length).toBe(1);
    expect(componente.laboratorios[0].id).toBe(2);

    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: '¡Eliminado!',
        icon: 'success'
      })
    );
  }));

  it('debería mostrar Swal de error si falla el delete', fakeAsync(() => {
    laboratorioServiceMock.delete.and.returnValue(
      throwError(() => new Error('Error delete'))
    );

    componente.eliminar(1);
    tick();

    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Error',
        text: 'No se pudo eliminar el registro. Intenta de nuevo.',
        icon: 'error'
      })
    );
  }));

  it('debería mostrar Swal de loading al confirmar eliminación', fakeAsync(() => {
  // espía showLoading
  const showLoadingSpy = spyOn(Swal, 'showLoading');

  componente.eliminar(1);

  // resuelve el primer Swal (confirmación)
  tick();

  // verifica que se muestre el Swal de loading
  expect(Swal.fire).toHaveBeenCalledWith(
    jasmine.objectContaining({
      title: 'Eliminando...',
      allowOutsideClick: false,
      allowEscapeKey: false
    })
  );

  // ejecuta manualmente didOpen para cubrir showLoading
  const llamada = (Swal.fire as jasmine.Spy).calls.all()
    .find(c => c.args[0]?.title === 'Eliminando...');

  llamada?.args[0].didOpen();

  expect(showLoadingSpy).toHaveBeenCalled();
}));


});
