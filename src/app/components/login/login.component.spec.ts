import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import Swal from 'sweetalert2';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;

  beforeEach(async () => {

    authServiceMock = {
      login: jasmine.createSpy('login')
    };

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        RouterTestingModule   // RouterLink
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar error si los campos están vacíos', () => {
    component.username = '';
    component.password = '';

    component.onLogin();

    expect(component.errorMessage).toBe('Por favor completa todos los campos');
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('debería llamar al servicio si las credenciales son correctas', () => {
    authServiceMock.login.and.returnValue(true);

    component.username = 'admin';
    component.password = '1234';

    component.onLogin();

    expect(authServiceMock.login).toHaveBeenCalledWith('admin', '1234');
    expect(component.errorMessage).toBe('');
  });

  it('debería mostrar error si las credenciales son incorrectas', () => {
    authServiceMock.login.and.returnValue(false);

    component.username = 'admin';
    component.password = 'wrong';

    component.onLogin();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Usuario o contraseña incorrectos');
  });

});
