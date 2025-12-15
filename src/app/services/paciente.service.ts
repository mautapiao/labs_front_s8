import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PacienteModel } from '../models/paciente.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
 // 4)  Construimos la URL base usando environment:
  //    - environment.apiBaseUrl = 'http://localhost:8080/api'
  //    - base final para  -> 'http://localhost:8080/api/tipo-analisis'
  private readonly apiUrl = `${environment.apiBaseUrl}/pacientes`;

  // 5) Angular nos "inyecta" HttpClient para poder hacer solicitudes HTTP
  constructor(private http: HttpClient) { }

  // ======================================================================
  // MÉTODOS CRUD 
  // ======================================================================

  // [GET] Obtiene todos los registros desde el backend
  // UI → PacienteService.getAll() → GET /api/tipo-analisis → JSON[] 
  getAll(): Observable<PacienteModel[]> {
    // return this.http.get<Laboratorio[]>(this.apiUrl);
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response._embedded?.pacienteList || [])
    );
  }

  // [GET] Obtiene un registro por su ID
  // UI → PacienteService.getById(7) → GET /api/tipo-analisis/7 → JSON 
  getById(id: number): Observable<PacienteModel> {
    return this.http.get<PacienteModel>(`${this.apiUrl}/${id}`);
  }

  // [POST] Crea un nuevo registro
  // UI → PacienteService.create(PacienteSinId) → POST /api/paciente → registro creado
  create(data: Omit<PacienteModel, 'id'>): Observable<PacienteModel> {
    return this.http.post<PacienteModel>(this.apiUrl, data);
  }

  // [PUT] Actualiza un registro
  // UI → PacienteService.update(7, cambiosParciales) → PUT /api/tipo-analisis/7
  update(id: number, data: Partial<PacienteModel>): Observable<PacienteModel> {
    return this.http.put<PacienteModel>(`${this.apiUrl}/${id}`, data);
  }

  // [DELETE] Elimina un registro
  // UI → PacienteService.delete(7) → DELETE /api/tipo-analisis/7
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
