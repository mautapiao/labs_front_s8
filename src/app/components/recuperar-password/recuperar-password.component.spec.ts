import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarPasswordComponent } from './recuperar-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('RecuperarPasswordComponent', () => {

  let component: RecuperarPasswordComponent;
  let fixture: ComponentFixture<RecuperarPasswordComponent>;
  let usuarioServiceMock: any;
  let router: Router;

  beforeEach(async () => {

    usuarioServiceMock = {
      buscarPorEmail: jasmine.createSpy('buscarPorEmail')
    };

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({} as any)
    );

    await TestBed.configureTestingModule({
      imports: [
        RecuperarPasswordComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarPasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario', () => {
    expect(component.recuperarForm).toBeDefined();
    expect(component.recuperarForm.get('email')).toBeTruthy();
  });

  it('no debería enviar si el formulario es inválido', () => {
    component.onSubmit();

    expect(usuarioServiceMock.buscarPorEmail).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('debería llamar al servicio si el email es válido', () => {
    usuarioServiceMock.buscarPorEmail.and.returnValue(of({}));

    component.recuperarForm.patchValue({
      email: 'test@test.cl'
    });

    component.onSubmit();

    expect(usuarioServiceMock.buscarPorEmail).toHaveBeenCalledWith('test@test.cl');
  });

  it('debería navegar a login si el email existe', async () => {
    usuarioServiceMock.buscarPorEmail.and.returnValue(of({}));

    component.recuperarForm.patchValue({
      email: 'test@test.cl'
    });

    component.onSubmit();

    await Promise.resolve(); // resolver Swal.then()

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería manejar email no registrado (404)', () => {
    usuarioServiceMock.buscarPorEmail.and.returnValue(
      throwError(() => ({ status: 404 }))
    );

    component.recuperarForm.patchValue({
      email: 'noexiste@test.cl'
    });

    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalled();
  });

  it('debería manejar error de conexión', () => {
    usuarioServiceMock.buscarPorEmail.and.returnValue(
      throwError(() => ({ status: 500 }))
    );

    component.recuperarForm.patchValue({
      email: 'test@test.cl'
    });

    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalled();
  });

});
