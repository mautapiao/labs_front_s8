import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Usuario, RegistroUsuario, ActualizarPerfil } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiBaseUrl}/usuarios`;

  constructor(private http: HttpClient) {} // es el servicio que hace peticiones HTTP

  registrarUsuario(usuario: RegistroUsuario): Observable<Usuario> {
    // Preparar el objeto para enviar al backend 
    const usuarioData = {
      email: usuario.email,
      rut: usuario.rut,
      dv: usuario.dv,
      nombreUsuario: usuario.nombreUsuario,
      nombres: usuario.nombres,
      paterno: usuario.paterno,
      materno: usuario.materno || null,
      password: usuario.password,
      activo: true, // Por defecto activo
      rolModel: {
        id: usuario.rolModel.id
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Usuario>(this.apiUrl, usuarioData, { headers });
  }

  // buscar usuario por email en backend
  buscarPorEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/email/${email}`);
  }

  // ACTUALIZAR PERFIL (PATCH - Solo nombres, paterno, materno)
  actualizarPerfil(id: number, datos: ActualizarPerfil): Observable<Usuario> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Uso PATCH en el endpoint /perfil
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/perfil`, datos, { headers });
  }

 // ======================================================================
  // MÉTODOS CRUD 
  // ======================================================================

  // [GET] Obtiene todos los registros desde el backend
  // UI → TipoAnalisisService.getAll() → GET /api/tipo-analisis → JSON[] 
  getAll(): Observable<Usuario[]> {
    // return this.http.get<Usuario[]>(this.apiUrl);
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response._embedded?.usuarioModelList || [])
    );
  }

  // [GET] Obtiene un registro por su ID
  // UI → UsuarioService.getById(7) → GET /api/usuarios/7 → JSON 
  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

    // [PUT] Actualiza un registro
    // UI → UsuarioService.update(7, cambiosParciales) → PUT /api/usuarios/7
    update(id: number, data: Partial<Usuario>): Observable<Usuario> {
      return this.http.put<Usuario>(`${this.apiUrl}/${id}`, data);
    }
  
    // [DELETE] Elimina un registro
    // UI → UsuarioService.delete(7) → DELETE /api/usuarios/7
    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }



}