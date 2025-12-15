// ======================================================================
// Semana 5 - TipoAnalisisService (Angular → Backend)
// ======================================================================
// Este servicio es el "puente" entre la UI (componentes) y la API.
// Aquí usamos HttpClient para llamar a la URL del backend que
// definimos en environment.ts (http://localhost:8080/api).
// ======================================================================

// 1) Importaciones esenciales
import { Injectable } from '@angular/core';                   // Para declarar un servicio inyectable
import { HttpClient } from '@angular/common/http';            // Cliente HTTP nativo de Angular
import { map, Observable } from 'rxjs';                            // Mecanismo reactivo para respuestas asíncronas
import { environment } from '../environments/environment'; // Donde está la URL base del backend
import { TipoAnalisis } from '../models/tipo-analisis.model';

// 3) Decorador que registra el servicio a nivel global

@Injectable({
  providedIn: 'root'
})
export class TipoAnalisisService {
 // 4)  Construimos la URL base usando environment:
  //    - environment.apiBaseUrl = 'http://localhost:8080/api'
  //    - base final para  -> 'http://localhost:8080/api/tipo-analisis'
  private readonly apiUrl = `${environment.apiBaseUrl}/tipo-analisis`;

  // 5) Angular nos "inyecta" HttpClient para poder hacer solicitudes HTTP
  constructor(private http: HttpClient) { }

  // ======================================================================
  // MÉTODOS CRUD 
  // ======================================================================

  // [GET] Obtiene todos los registros desde el backend
  // UI → TipoAnalisisService.getAll() → GET /api/tipo-analisis → JSON[] 
  getAll(): Observable<TipoAnalisis[]> {
    // return this.http.get<Laboratorio[]>(this.apiUrl);
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response._embedded?.tipoAnalisisList || [])
    );
  }

  // [GET] Obtiene un registro por su ID
  // UI → TipoAnalisisService.getById(7) → GET /api/tipo-analisis/7 → JSON 
  getById(id: number): Observable<TipoAnalisis> {
    return this.http.get<TipoAnalisis>(`${this.apiUrl}/${id}`);
  }

  // [POST] Crea un nuevo registro
  // UI → TipoAnalisisService.create(tipoanalisisSinId) → POST /api/tipo-analisis → registro creado
  create(data: Omit<TipoAnalisis, 'id'>): Observable<TipoAnalisis> {
    return this.http.post<TipoAnalisis>(this.apiUrl, data);
  }

  // [PUT] Actualiza un registro
  // UI → TipoAnalisisService.update(7, cambiosParciales) → PUT /api/tipo-analisis/7
  update(id: number, data: Partial<TipoAnalisis>): Observable<TipoAnalisis> {
    return this.http.put<TipoAnalisis>(`${this.apiUrl}/${id}`, data);
  }

  // [DELETE] Elimina un registro
  // UI → TipoAnalisisService.delete(7) → DELETE /api/tipo-analisis/7
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
// ======================================================================
// FIN del servicio.
// Próximo paso: probarlo con un "smoke test" simple desde AppComponent
// y luego crear componentes (listar/crear/editar/detalle) con rutas.
// ======================================================================
