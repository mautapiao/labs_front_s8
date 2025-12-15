import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilComponent } from './perfil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';

describe('PerfilComponent', () => {

  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let authServiceMock: any;
  let usuarioServiceMock: any;

  const usuarioMock: Usuario = {
    id: 1,
    email: 'test@test.cl',
    rut: '12345678',
    dv: '9',
    nombreUsuario: 'testuser',
    nombres: 'Juan',
    paterno: 'Pérez',
    materno: 'López',
    activo: true,
    rolModel: { id: 1, nombre: 'ADMIN' }
  };

  beforeEach(async () => {

    authServiceMock = {
      getUserEmail: jasmine.createSpy('getUserEmail')
    };

    usuarioServiceMock = {
      buscarPorEmail: jasmine.createSpy('buscarPorEmail'),
      actualizarPerfil: jasmine.createSpy('actualizarPerfil')
    };

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    await TestBed.configureTestingModule({
      imports: [
        PerfilComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UsuarioService, useValue: usuarioServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    authServiceMock.getUserEmail.and.returnValue('test@test.cl');
    usuarioServiceMock.buscarPorEmail.and.returnValue(of(usuarioMock));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario', () => {
    component.inicializarFormularios();

    expect(component.perfilForm).toBeDefined();
    expect(component.perfilForm.get('nombres')).toBeTruthy();
  });

  it('debería cargar los datos del usuario si existe email', () => {
    authServiceMock.getUserEmail.and.returnValue('test@test.cl');
    usuarioServiceMock.buscarPorEmail.and.returnValue(of(usuarioMock));

    fixture.detectChanges();

    expect(component.usuarioActual).toEqual(usuarioMock);
    expect(component.perfilForm.get('nombres')?.value).toBe('Juan');
  });

  it('debería mostrar error si no hay email', () => {
    authServiceMock.getUserEmail.and.returnValue(null);

    component.cargarDatosUsuario();

    expect(Swal.fire).toHaveBeenCalled();
  });

  it('no debería enviar si el formulario es inválido', () => {
    component.inicializarFormularios();
    component.usuarioActual = usuarioMock;

    component.onSubmitPerfil();

    expect(usuarioServiceMock.actualizarPerfil).not.toHaveBeenCalled();
  });

  it('debería llamar a actualizarPerfil si el formulario es válido', async () => {
    authServiceMock.getUserEmail.and.returnValue('test@test.cl');
    usuarioServiceMock.buscarPorEmail.and.returnValue(of(usuarioMock));
    usuarioServiceMock.actualizarPerfil.and.returnValue(of(usuarioMock));

    fixture.detectChanges();

    component.perfilForm.patchValue({
      nombres: 'Juan Mod',
      paterno: 'Pérez Mod',
      materno: 'López'
    });

    await component.onSubmitPerfil();

    expect(usuarioServiceMock.actualizarPerfil).toHaveBeenCalled();
  });

  it('debería restaurar los datos al cancelar edición', () => {
    component.inicializarFormularios();
    component.usuarioActual = usuarioMock;

    component.perfilForm.patchValue({
      nombres: 'Cambio'
    });

    component.cancelarEdicion();

    expect(component.perfilForm.get('nombres')?.value).toBe('Juan');
  });

});
