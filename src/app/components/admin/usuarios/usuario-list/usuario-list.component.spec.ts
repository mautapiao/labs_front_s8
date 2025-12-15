import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { RouterTestingModule } from '@angular/router/testing';

import { UsuarioListComponent } from './usuario-list.component';
import { UsuarioService } from '../../../../services/usuario.service';
import { Usuario } from '../../../../models/usuario.model';

describe('UsuarioListComponent', () => {

  let component: UsuarioListComponent;
  let fixture: ComponentFixture<UsuarioListComponent>;
  let usuarioServiceMock: any;

  const USUARIOS_MOCK: Usuario[] = [
    {
      id: 1,
      email: 'test@demo.cl',
      rut: '12345678',
      dv: '9',
      nombreUsuario: 'admin',
      nombres: 'Admin',
      paterno: 'Sistema',
      activo: true,
      rolModel: { id: 1, nombre: 'ADMIN' } as any
    }
  ];

  beforeEach(async () => {

    usuarioServiceMock = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of(USUARIOS_MOCK)),
      delete: jasmine.createSpy('delete').and.returnValue(of(null))
    };

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    await TestBed.configureTestingModule({
      imports: [
        UsuarioListComponent,
        RouterTestingModule   // ✅ CLAVE
      ],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar la lista de usuarios al iniciar', () => {
    expect(usuarioServiceMock.getAll).toHaveBeenCalled();
    expect(component.usuarios.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('debería manejar error al cargar usuarios', () => {
    usuarioServiceMock.getAll.and.returnValue(
      throwError(() => new Error('Error backend'))
    );

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('No se pudieron cargar los registros.');
  });

  it('debería eliminar el usuario del arreglo al confirmar', fakeAsync(() => {

    component.usuarios = [...USUARIOS_MOCK];

    component.eliminar(1);
    tick(); // resuelve SweetAlert

    expect(usuarioServiceMock.delete).toHaveBeenCalledWith(1);
    expect(component.usuarios.length).toBe(0);
  }));

});
