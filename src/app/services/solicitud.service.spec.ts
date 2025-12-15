import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SolicitudService } from './solicitud.service';
import { environment } from '../environments/environment';
import { SolicitudModel } from '../models/solicitud.model';

describe('SolicitudService', () => {

  let service: SolicitudService;
  let httpMock: HttpTestingController;

  // preparo el entorno de pruebas
  // uso un HttpClient falso para no llamar al backend
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(SolicitudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // me aseguro de que no queden llamadas HTTP pendientes
  afterEach(() => {
    httpMock.verify();
  });

  // el servicio existe
  
  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

 // getAll devuelve lista desde _embedded
  
  it('debería obtener todas las solicitudes', () => {

    const mockResponse = {
      _embedded: {
        solicitudList: [
          {
            id: 1,
            detalleExamen: 'Examen de sangre',
            fechaSolicitud: '2025-12-13',
            numeroAtencion: 'AT-001',
            laboratorio: {} as any,
            paciente: {} as any,
            tipoAnalisis: {} as any
          },
          {
            id: 2,
            detalleExamen: 'Examen de orina',
            fechaSolicitud: '2025-12-14',
            numeroAtencion: 'AT-002',
            laboratorio: {} as any,
            paciente: {} as any,
            tipoAnalisis: {} as any
          }
        ]
      }
    };

    service.getAll().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data[0].numeroAtencion).toBe('AT-001');
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/solicitudes`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  // getById usa la URL con id
  
  it('debería obtener una solicitud por id', () => {

    const mockSolicitud: SolicitudModel = {
      id: 1,
      detalleExamen: 'Examen de sangre',
      fechaSolicitud: '2025-12-13',
      numeroAtencion: 'AT-001',
      laboratorio: {} as any,
      paciente: {} as any,
      tipoAnalisis: {} as any
    };

    service.getById(1).subscribe(data => {
      expect(data.id).toBe(1);
      expect(data.detalleExamen).toBe('Examen de sangre');
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/solicitudes/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockSolicitud);
  });

  //create hace POST
  
  it('debería crear una solicitud', () => {

    const createDto = {
      detalleExamen: 'Nuevo examen',
      fechaSolicitud: '2025-12-13',
      numeroAtencion: 'AT-010',
      laboratorio: 1,
      paciente: 1,
      tipoAnalisis: 1
    };

    const mockResponse: SolicitudModel = {
      id: 10,
      detalleExamen: 'Nuevo examen',
      fechaSolicitud: '2025-12-13',
      numeroAtencion: 'AT-010',
      laboratorio: {} as any,
      paciente: {} as any,
      tipoAnalisis: {} as any
    };

    service.create(createDto as any).subscribe(data => {
      expect(data.id).toBe(10);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/solicitudes`);
    expect(req.request.method).toBe('POST');

    req.flush(mockResponse);
  });

  //delete elimina por id
  
it('debería eliminar una solicitud', () => {
  service.delete(5).subscribe(response => {
    expect(response).toBeNull();
  });

  const req = httpMock.expectOne(
    `${environment.apiBaseUrl}/solicitudes/5`
  );
  expect(req.request.method).toBe('DELETE');

  req.flush(null);
});

});
