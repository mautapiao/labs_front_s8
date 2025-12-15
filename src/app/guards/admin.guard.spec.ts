import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'esAdmin']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('permite acceso cuando está logueado y es admin', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.esAdmin.and.returnValue(true);

    expect(guard.canActivate()).toBeTrue();
  });

  it('bloquea acceso y redirige si no es admin', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.esAdmin.and.returnValue(false);

    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/clinica']);
  });
});
