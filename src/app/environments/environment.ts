// =========================================================
// Semana 5 – Archivo de entorno de desarrollo
// =========================================================
//
// Aquí declaramos variables globales que Angular usará
// en toda la aplicación.
//
// La más importante: la URL base del microservicio backend.
// =========================================================

export const environment = {
  // Dirección base del backend (Spring Boot)
  apiBaseUrl: 'http://localhost:8080/api',

  // Indica que estamos en entorno de desarrollo
  production: false
};

// =========================================================
// Ejemplo de uso más adelante:
//  this.http.get(`${environment.apiBaseUrl}/libros`);
// Resultado real: GET http://localhost:8080/api/libros
// =========================================================
