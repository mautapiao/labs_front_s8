import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('RegistroComponent', () => {

  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let usuarioServiceMock: any;
  let router: Router;

  beforeEach(async () => {

    usuarioServiceMock = {
      registrarUsuario: jasmine.createSpy('registrarUsuario')
    };

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({} as any)
    );

    await TestBed.configureTestingModule({
      imports: [
        RegistroComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario', () => {
    expect(component.registroForm).toBeDefined();
    expect(component.f['email']).toBeTruthy();
    expect(component.f['password']).toBeTruthy();
  });

  it('no debería enviar si el formulario es inválido', () => {
    component.onSubmit();

    expect(usuarioServiceMock.registrarUsuario).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('debería marcar error si las contraseñas no coinciden', () => {
    component.registroForm.patchValue({
      email: 'test@test.cl',
      rut: '12345678',
      dv: '9',
      nombreUsuario: 'usuario',
      nombres: 'Juan',
      paterno: 'Perez',
      password: '123456',
      confirmarPassword: '654321',
      aceptarTerminos: true
    });

    expect(component.registroForm.invalid).toBeTrue();
    expect(component.registroForm.hasError('passwordMismatch')).toBeTrue();
  });

  it('debería llamar al servicio si el formulario es válido', () => {
    usuarioServiceMock.registrarUsuario.and.returnValue(of({}));

    component.registroForm.patchValue({
      email: 'test@test.cl',
      rut: '12345678',
      dv: '9',
      nombreUsuario: 'usuario',
      nombres: 'Juan',
      paterno: 'Perez',
      materno: 'Diaz',
      password: '123456',
      confirmarPassword: '123456',
      aceptarTerminos: true
    });

    component.onSubmit();

    expect(usuarioServiceMock.registrarUsuario).toHaveBeenCalled();
  });

  it('debería navegar a login si el registro es exitoso', async () => {
    usuarioServiceMock.registrarUsuario.and.returnValue(of({}));

    component.registroForm.patchValue({
      email: 'test@test.cl',
      rut: '12345678',
      dv: '9',
      nombreUsuario: 'usuario',
      nombres: 'Juan',
      paterno: 'Perez',
      password: '123456',
      confirmarPassword: '123456',
      aceptarTerminos: true
    });

    component.onSubmit();

    await Promise.resolve(); // resolver Swal.then()

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería manejar error 409 (usuario duplicado)', () => {
    usuarioServiceMock.registrarUsuario.and.returnValue(
      throwError(() => ({ status: 409 }))
    );

    component.registroForm.patchValue({
      email: 'test@test.cl',
      rut: '12345678',
      dv: '9',
      nombreUsuario: 'usuario',
      nombres: 'Juan',
      paterno: 'Perez',
      password: '123456',
      confirmarPassword: '123456',
      aceptarTerminos: true
    });

    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalled();
  });

  it('debería manejar error genérico', () => {
    usuarioServiceMock.registrarUsuario.and.returnValue(
      throwError(() => ({ status: 500 }))
    );

    component.registroForm.patchValue({
      email: 'test@test.cl',
      rut: '12345678',
      dv: '9',
      nombreUsuario: 'usuario',
      nombres: 'Juan',
      paterno: 'Perez',
      password: '123456',
      confirmarPassword: '123456',
      aceptarTerminos: true
    });

    component.onSubmit();

    expect(Swal.fire)// espera/verifica la función
    .toHaveBeenCalled(); // que haya sido llamada al menos una vez
  });

});


/*
toHaveBeenCalled()              // fue llamada al menos 1 vez
toHaveBeenCalledTimes(2)        // fue llamada exactamente 2 veces
toHaveBeenCalledWith({...})     // fue llamada con estos argumentos
*/