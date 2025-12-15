import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { LabsCreateComponent } from './labs-create.component';
import { LaboratorioService } from '../../../../services/laboratorio.service';

describe('LabsCreateComponent', () => {

  let componente: LabsCreateComponent;
  let fixture: ComponentFixture<LabsCreateComponent>;
  let laboratorioServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {

    laboratorioServiceMock = {
      create: jasmine.createSpy('create')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    spyOn(Swal, 'fire').and.returnValue(
  Promise.resolve({ isConfirmed: false } as any)
);


    await TestBed.configureTestingModule({
      imports: [LabsCreateComponent],
      providers: [
        { provide: LaboratorioService, useValue: laboratorioServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LabsCreateComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar valores por defecto', () => {
    expect(componente.loading).toBeFalse();
    expect(componente.laboratorio.nombre).toBe('');
    expect(componente.errores).toEqual({});
  });

  it('debería mostrar alerta si el formulario es inválido al guardar', () => {
    componente.laboratorio.nombre = '';

    componente.guardar();

    expect(Swal.fire).toHaveBeenCalled();
    expect(laboratorioServiceMock.create).not.toHaveBeenCalled();
  });

  it('debería llamar al servicio cuando el formulario es válido', () => {
    laboratorioServiceMock.create.and.returnValue(of({}));

    componente.laboratorio.nombre = 'Laboratorio Central';

    componente.guardar();

    expect(laboratorioServiceMock.create).toHaveBeenCalledWith(componente.laboratorio);
  });

  it('debería manejar error del servicio al crear', () => {
    laboratorioServiceMock.create.and.returnValue(
      throwError(() => new Error('Error backend'))
    );

    componente.laboratorio.nombre = 'Laboratorio Central';

    componente.guardar();

    expect(componente.loading).toBeFalse();
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('debería limpiar el formulario', () => {
    componente.laboratorio.nombre = 'Algo';
    componente.errores = { nombre: 'error' };

    componente.limpiar();

    expect(componente.laboratorio.nombre).toBe('');
    expect(componente.errores).toEqual({});
  });

  it('debería navegar al cancelar', () => {
    componente.cancelar();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/laboratorios']);
  });

});
