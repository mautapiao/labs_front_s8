// ======================================================================
// Semana 5 - LaboratoriosService (Angular → Backend)
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
import { Laboratorio } from '../models/laboratorio.model';     // ✅ importar modelo desde /models

// 3) Decorador que registra el servicio a nivel global
@Injectable({
  providedIn: 'root' // Disponible en toda la app sin declararlo en un módulo
})
export class LaboratorioService {

  // 4)  Construimos la URL base usando environment:
  //    - environment.apiBaseUrl = 'http://localhost:8080/api'
  //    - base final para  -> 'http://localhost:8080/api/laboratorios'
  private readonly apiUrl = `${environment.apiBaseUrl}/laboratorios`;

  // 5) Angular nos "inyecta" HttpClient para poder hacer solicitudes HTTP
  constructor(private http: HttpClient) { }

  // ======================================================================
  // MÉTODOS CRUD 
  // ======================================================================

  // [GET] Obtiene todos los registros desde el backend
  // UI → LibrosService.getAll() → GET /api/libros → JSON[] de libros
  getAll(): Observable<Laboratorio[]> {
    // return this.http.get<Laboratorio[]>(this.apiUrl);
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response._embedded?.laboratorioList || [])
    );
  }

  // [GET] Obtiene un registro por su ID
  // UI → LibrosService.getById(7) → GET /api/libros/7 → JSON libro
  getById(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.apiUrl}/${id}`);
  }

  // [POST] Crea un nuevo registro
  // UI → LaboratorioService.create(labortorioSinId) → POST /api/laboratroios → registro creado
  create(data: Omit<Laboratorio, 'id'>): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.apiUrl, data);
  }

  // [PUT] Actualiza un registro
  // UI → LaboratoriosService.update(7, cambiosParciales) → PUT /api/laboratorios/7
  update(id: number, data: Partial<Laboratorio>): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(`${this.apiUrl}/${id}`, data);
  }

  // [DELETE] Elimina un registro
  // UI → LaboratoriosService.delete(7) → DELETE /api/laboratorios/7
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

