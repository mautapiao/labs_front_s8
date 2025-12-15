import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { PacienteCreateComponent } from './paciente-create.component';
import { PacienteService } from '../../../../services/paciente.service';

/*
 * Este test se realiza para verificar que el componente de creación de pacientes
 * inicializa correctamente su estado, valida los campos obligatorios y ejecuta
 * las acciones esperadas al crear, limpiar o cancelar el formulario, aislando
 * la lógica del componente mediante el uso de servicios simulados.
 */

describe('PacienteCreateComponent', () => {

  let componente: PacienteCreateComponent;
  let fixture: ComponentFixture<PacienteCreateComponent>;
  let pacienteServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {

    pacienteServiceMock = {
      create: jasmine.createSpy('create').and.returnValue(
        of({ nombres: 'Juan Pérez' })
      )
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [PacienteCreateComponent],
      providers: [
        { provide: PacienteService, useValue: pacienteServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PacienteCreateComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el paciente vacío', () => {
    expect(componente.paciente.rut).toBe('');
    expect(componente.paciente.email).toBe('');
    expect(componente.loading).toBeFalse();
  });

  it('debería fallar la validación si faltan campos obligatorios', () => {
    componente.paciente = {
      rut: '',
      dv: '',
      nombres: '',
      paterno: '',
      materno: '',
      email: '',
      telefono: ''
    };

    const valido = componente.validar();

    expect(valido).toBeFalse();
    expect(Object.keys(componente.errores).length).toBeGreaterThan(0);
  });

  it('debería llamar al servicio create cuando el formulario es válido', () => {
    componente.paciente = {
      rut: '12345678',
      dv: '9',
      nombres: 'Juan',
      paterno: 'Pérez',
      materno: 'Gómez',
      email: 'juan@test.cl',
      telefono: '912345678'
    };

    componente.guardar();

    expect(pacienteServiceMock.create)
      .toHaveBeenCalledWith(componente.paciente);
  });

  it('debería limpiar el formulario', () => {
    componente.paciente.nombres = 'Algo';
    componente.errores = { nombres: 'error' };

    componente.limpiar();

    expect(componente.paciente.nombres).toBe('');
    expect(componente.errores).toEqual({});
  });

  it('debería navegar al cancelar', () => {
    componente.cancelar();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/pacientes']);
  });

});
