import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UsuarioService } from './usuario.service';
import { environment } from '../environments/environment';
import { RegistroUsuario } from '../models/usuario.model';

describe('UsuarioService', () => {

  let service: UsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    // aquí preparo el módulo de pruebas
    // uso HttpClientTestingModule para no llamar al backend real
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    // aquí obtengo una instancia real del servicio
    service = TestBed.inject(UsuarioService);

    // aquí obtengo el controlador que me permite interceptar las peticiones HTTP
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // aquí verifico que no queden peticiones HTTP pendientes
    httpMock.verify();
  });

  it('should be created', () => {

    // aquí solo verifico que el servicio exista
    // este test confirma que la inyección funciona
    expect(service).toBeTruthy();
  });

  it('debería registrar un usuario usando POST', () => {

    // aquí preparo un usuario de prueba
    // este objeto simula lo que enviaría el formulario
    const usuarioMock: RegistroUsuario = {
      email: 'test@test.cl',
      rut: '12345678',
      dv: '9',
      nombreUsuario: 'testuser',
      nombres: 'Test',
      paterno: 'Usuario',
      materno: 'mat',
      password: '123456',
      confirmarPassword: '123456',
      rolModel: { id: 1 }
    };

    // aquí preparo la respuesta que simulará el backend
    const respuestaMock = {
      id: 1,
      ...usuarioMock,
      activo: true
    };

    // aquí ejecuto el método real del servicio
    // todavía no pasa nada hasta que yo responda la petición
    service.registrarUsuario(usuarioMock).subscribe(usuario => {

      // aquí valido que la respuesta sea la que espero
      expect(usuario.id).toBe(1);
      expect(usuario.email).toBe('test@test.cl');
    });

    // aquí capturo la petición HTTP que el servicio intentó hacer
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/usuarios`);

    // aquí valido que el método HTTP sea POST
    expect(req.request.method).toBe('POST');

    // aquí simulo la respuesta del backend
    req.flush(respuestaMock);
  });

  it('debería buscar un usuario por email usando GET', () => {

    const email = 'correo@test.cl';

    const usuarioMock = {
      id: 5,
      email,
      nombres: 'Juan'
    };

    service.buscarPorEmail(email).subscribe(usuario => {

      // aquí verifico que el email retornado sea correcto
      expect(usuario.email).toBe(email);
    });

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/usuarios/email/${email}`
    );

    // aquí valido que se use GET
    expect(req.request.method).toBe('GET');

    // aquí respondo con el usuario simulado
    req.flush(usuarioMock);
  });

  it('debería obtener la lista de usuarios usando GET', () => {

    // esta es la estructura típica HAL que viene del backend
    const respuestaMock = {
      _embedded: {
        usuarioModelList: [
          { id: 1, email: 'uno@test.cl' },
          { id: 2, email: 'dos@test.cl' }
        ]
      }
    };

    service.getAll().subscribe(usuarios => {

      // aquí verifico que el map haya funcionado
      expect(usuarios.length).toBe(2);
      expect(usuarios[0].email).toBe('uno@test.cl');
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/usuarios`);

    // aquí confirmo que se hizo un GET
    expect(req.request.method).toBe('GET');

    // aquí envío la respuesta simulada
    req.flush(respuestaMock);
  });

});
