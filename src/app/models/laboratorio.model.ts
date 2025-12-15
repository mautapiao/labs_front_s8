// ===================================================================
// Modelo de datos "Laboratorio"
// ===================================================================
//
// Este modelo representa la estructura de datos que viaja entre
// el frontend (Angular) y el backend (Spring Boot).
//
// El patrón de diseño Model-Service-Component nos sugiere:
//   Model: Define la forma de los datos
//  Service: Lógica de conexión al backend (laboratorio.service.ts)
//   Component: Interfaz y manejo visual de los datos
//
// ===================================================================

export interface Laboratorio {
  id?: number;            // Identificador único del lab (puede ser opcional al crear uno nuevo)
  nombre: string;         // descripcion del laboratorio
}
