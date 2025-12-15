import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import Swal from 'sweetalert2';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';

describe('NavbarComponent', () => {

  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: any;
  let router: Router;

  beforeEach(async () => {

    authServiceMock = {
      isLoggedIn: jasmine.createSpy('isLoggedIn'),
      getUsername: jasmine.createSpy('getUsername'),
      logout: jasmine.createSpy('logout'),
      esAdmin: jasmine.createSpy('esAdmin').and.returnValue(true)
    };

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);
    authServiceMock.getUsername.and.returnValue('admin');

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('debería redirigir a /login si no está autenticado', () => {
    authServiceMock.isLoggedIn.and.returnValue(false);

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería cargar el username si está autenticado', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);
    authServiceMock.getUsername.and.returnValue('admin');

    fixture.detectChanges();

    expect(component.username).toBe('admin');
  });

  it('debería cambiar el menú activo', () => {
    component.cambiarMenu('menu2');
    expect(component.menuActivo).toBe('menu2');
  });

  it('debería cerrar sesión al confirmar', async () => {
    authServiceMock.isLoggedIn.and.returnValue(true);
    authServiceMock.getUsername.and.returnValue('admin');

    fixture.detectChanges();

    await component.cerrarSesion();

    expect(authServiceMock.logout).toHaveBeenCalled();
  });

});
