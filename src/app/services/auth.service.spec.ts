import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

describe('AuthService', () => {

  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {

    // creo un spy del Router, solo me interesa navigate
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    // limpio el localStorage antes de cada test
    localStorage.clear();

    service = TestBed.inject(AuthService);
  });

  // creación del servicio
  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  // login exitoso ADMIN
  it('debería hacer login correctamente como ADMIN', () => {

    const resultado = service.login('admin', '1234');

    // espero que el login sea exitoso
    expect(resultado).toBeTrue();

    // usuario queda logueado
    expect(service.isLoggedIn()).toBeTrue();

    // verifico rol
    expect(service.esAdmin()).toBeTrue();
    expect(service.esUsuario()).toBeFalse();

    // verifico navegación
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/clinica']);

    // verifico localStorage
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
  });

  // login fallido
  it('debería fallar el login con credenciales incorrectas', () => {

    const resultado = service.login('admin', 'xxxx');

    expect(resultado).toBeFalse();
    expect(service.isLoggedIn()).toBeFalse();

    // no debe navegar
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // logout
  it('debería cerrar sesión correctamente', () => {

    // primero hago login
    service.login('usuario', '5678');

    // luego hago logout
    service.logout();

    expect(service.isLoggedIn()).toBeFalse();

    // localStorage limpio
    expect(localStorage.getItem('usuarioActual')).toBeNull();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();

    // navegación a login
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  // getters de usuario
  it('debería retornar datos del usuario logueado', () => {

    service.login('usuario', '5678');

    expect(service.getUsername()).toBe('usuario');
    expect(service.getRol()).toBe('USUARIO');
    expect(service.getUserEmail()).toBe('usuario@duocuc.cl');
  });

  // roles
  it('debería identificar correctamente rol USUARIO', () => {

    service.login('usuario', '5678');

    expect(service.esUsuario()).toBeTrue();
    expect(service.esAdmin()).toBeFalse();
  });

});
