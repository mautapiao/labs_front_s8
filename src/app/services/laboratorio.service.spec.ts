import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { LaboratorioService } from './laboratorio.service';
import { Laboratorio } from '../models/laboratorio.model';
import { environment } from '../environments/environment';

describe('LaboratorioService', () => {

  let service: LaboratorioService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiBaseUrl}/laboratorios`;

  // mock simple que respeta el modelo real
  const mockLaboratorio: Laboratorio = {
    id: 1,
    nombre: 'Laboratorio Central'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LaboratorioService]
    });

    service = TestBed.inject(LaboratorioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // verifico que no queden llamadas HTTP pendientes
    httpMock.verify();
  });

  // creación del servicio
  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  // getAll
  it('debería obtener la lista de laboratorios', () => {

    // simulo la respuesta del backend
    const mockResponse = {
      _embedded: {
        laboratorioList: [mockLaboratorio]
      }
    };

    service.getAll().subscribe(laboratorios => {
      // espero un arreglo con datos
      expect(laboratorios.length).toBe(1);
      expect(laboratorios[0].nombre).toBe('Laboratorio Central');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    // devuelvo el JSON simulado
    req.flush(mockResponse);
  });

  // getById
  it('debería obtener un laboratorio por id', () => {

    service.getById(1).subscribe(laboratorio => {
      expect(laboratorio).toEqual(mockLaboratorio);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockLaboratorio);
  });

  // create
  it('debería crear un laboratorio', () => {

    const nuevoLaboratorio: Omit<Laboratorio, 'id'> = {
      nombre: 'Laboratorio Clínico Norte'
    };

    service.create(nuevoLaboratorio).subscribe(laboratorio => {
      expect(laboratorio.id).toBe(2);
      expect(laboratorio.nombre).toBe('Laboratorio Clínico Norte');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoLaboratorio);

    req.flush({ ...nuevoLaboratorio, id: 2 });
  });

  // update
  it('debería actualizar un laboratorio', () => {

    const cambios = {
      nombre: 'Laboratorio Actualizado'
    };

    service.update(1, cambios).subscribe(laboratorio => {
      expect(laboratorio.nombre).toBe('Laboratorio Actualizado');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(cambios);

    req.flush({ ...mockLaboratorio, ...cambios });
  });

  // delete
  it('debería eliminar un laboratorio', () => {

    service.delete(1).subscribe(response => {
      // delete<void> siempre devuelve null
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

});
