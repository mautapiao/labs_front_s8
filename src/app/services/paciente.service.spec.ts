import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { PacienteService } from './paciente.service';
import { PacienteModel } from '../models/paciente.model';
import { environment } from '../environments/environment';

describe('PacienteService', () => {

  let service: PacienteService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiBaseUrl}/pacientes`;

  // mock que respeta  el modelo
  const mockPaciente: PacienteModel = {
    id: 1,
    email: 'juan.perez@mail.com',
    rut: '12345678',
    dv: '9',
    nombres: 'Juan',
    paterno: 'Pérez',
    materno: 'Gómez',
    telefono: '+56912345678'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PacienteService]
    });

    service = TestBed.inject(PacienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    //  que no queden peticiones pendientes
    httpMock.verify();
  });

  // creación del servicio
  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  // getAll
  it('debería obtener la lista de pacientes', () => {

    // simulo la respuesta del backend
    const mockResponse = {
      _embedded: {
        pacienteList: [mockPaciente]
      }
    };

    service.getAll().subscribe(pacientes => {
      // espero un arreglo
      expect(pacientes.length).toBe(1);

      //  verifico que el mapeo fue correcto
      expect(pacientes[0].email).toBe('juan.perez@mail.com');
      expect(pacientes[0].rut).toBe('12345678');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    // devuelvo el JSON falso
    req.flush(mockResponse);
  });

  // getById
  it('debería obtener un paciente por id', () => {

    service.getById(1).subscribe(paciente => {
      expect(paciente).toEqual(mockPaciente);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockPaciente);
  });

  // create
  it('debería crear un paciente', () => {

    const nuevoPaciente: Omit<PacienteModel, 'id'> = {
      email: 'ana@mail.com',
      rut: '87654321',
      dv: 'K',
      nombres: 'Ana',
      paterno: 'Rojas',
      materno: 'López',
      telefono: '+56999999999'
    };

    service.create(nuevoPaciente).subscribe(paciente => {
      // espero que el backend me devuelva el id
      expect(paciente.id).toBe(2);
      expect(paciente.email).toBe('ana@mail.com');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoPaciente);

    req.flush({ ...nuevoPaciente, id: 2 });
  });

  // update
  it('debería actualizar un paciente', () => {

    const cambios = {
      telefono: '+56900000000'
    };

    service.update(1, cambios).subscribe(paciente => {
      expect(paciente.telefono).toBe('+56900000000');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(cambios);

    req.flush({ ...mockPaciente, ...cambios });
  });

  // delete
  it('debería eliminar un paciente', () => {

    service.delete(1).subscribe(response => {
      // delete<void> devuelve null
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

});
