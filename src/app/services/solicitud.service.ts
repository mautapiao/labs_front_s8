import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateSolicitudDto, SolicitudModel } from '../models/solicitud.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = `${environment.apiBaseUrl}/solicitudes`;

  constructor(private http: HttpClient) {} // es el servicio que hace peticiones HTTP

 // ======================================================================
  // MÉTODOS CRUD 
  // ======================================================================

  // [GET] Obtiene todos los registros desde el backend
  // UI → TipoAnalisisService.getAll() → GET /api/tipo-analisis → JSON[] 
  getAll(): Observable<SolicitudModel[]> {
    // return this.http.get<SolicitudModel[]>(this.apiUrl);
   return this.http.get<any>(this.apiUrl).pipe(
      map(response => response._embedded?.solicitudList || [])
    );
  }

  // [GET] Obtiene un registro por su ID
  // UI → SolicitudService.getById(7) → GET /api/solicitud/7 → JSON 
  getById(id: number): Observable<SolicitudModel> {
    return this.http.get<SolicitudModel>(`${this.apiUrl}/${id}`);
  }

  // [POST] Crea un nuevo registro
    // UI → PacienteService.create(PacienteSinId) → POST /api/paciente → registro creado
   // create(data: Omit<SolicitudModel, 'id'>): Observable<SolicitudModel> {
   //   return this.http.post<SolicitudModel>(this.apiUrl, data);
   // }

    // CreateSolicitudDto
  create(data: CreateSolicitudDto): Observable<SolicitudModel> {
    return this.http.post<SolicitudModel>(this.apiUrl, data);
  }



    // [PUT] Actualiza un registro
    // UI → SolcitudService.update(7, cambiosParciales) → PUT /api/solicitud/7
    update(id: number, data: any): Observable<SolicitudModel> {
      return this.http.put<SolicitudModel>(`${this.apiUrl}/${id}`, data);
    }
  
    // [DELETE] Elimina un registro
    // UI _> SolicitiudService.delete(7) -> DELETE /api/solicitud/7
    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }



}