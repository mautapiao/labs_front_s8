import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TipoAnalisisService } from './tipo-analisis.service';
import { environment } from '../environments/environment';
import { TipoAnalisis } from '../models/tipo-analisis.model';

describe('TipoAnalisisService', () => {

  let service: TipoAnalisisService;
  let httpMock: HttpTestingController;

  // acá preparo el entorno de pruebas
  // le digo a Angular que use el HttpClient falso
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    // obtengo una instancia real del servicio
    service = TestBed.inject(TipoAnalisisService);

    // este objeto me permite interceptar llamadas HTTP
    httpMock = TestBed.inject(HttpTestingController);
  });

  // me aseguro de que no queden llamadas HTTP abiertas
  afterEach(() => {
    httpMock.verify();
  });

  // ===================================================
  // TEST 1 el servicio existe
  // ===================================================
  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  // ===================================================
  // TEST 2 getAll devuelve la lista desde _embedded
  // ===================================================
  it('debería obtener la lista de tipos de análisis', () => {

    // simulo la respuesta del backend
    // copio exactamente la estructura que llega desde la API
    const mockResponse = {
      _embedded: {
        tipoAnalisisList: [
          { id: 1, nombre: 'Sangre' },
          { id: 2, nombre: 'Orina' }
        ]
      }
    };

    // llamo al método real del servicio
    service.getAll().subscribe(data => {

      // acá valido el resultado final que recibe la UI
      expect(data.length).toBe(2);
      expect(data[0].nombre).toBe('Sangre');
    });

    // capturo la petición HTTP que el servicio intentó hacer
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/tipo-analisis`);

    // verifico que sea un GET
    expect(req.request.method).toBe('GET');

    // respondo con los datos falsos
    req.flush(mockResponse);
  });

  // ===================================================
  // TEST 3 getById hace GET con el id correcto
  // ===================================================
  it('debería obtener un tipo de análisis por id', () => {

    const mockTipo: TipoAnalisis = {
      id: 1,
      codigo:'1010',
      nombre: 'Sangre'
    };

    service.getById(1).subscribe(data => {
      expect(data.id).toBe(1);
      expect(data.codigo).toBe('1010');
      expect(data.nombre).toBe('Sangre');
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/tipo-analisis/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTipo);
  });

});
