// ===================================================================
// Modelo de datos "Tipo de Analisis"
// ===================================================================
//
// Este modelo representa la estructura de datos que viaja entre
// el frontend (Angular) y el backend (Spring Boot).
//
// El patrón de diseño Model-Service-Component nos sugiere:
//   🔹 Model: Define la forma de los datos
//   🔹 Service: Lógica de conexión al backend (laboratorio.service.ts)
//   🔹 Component: Interfaz y manejo visual de los datos
//
// ===================================================================

export interface TipoAnalisis {
   id?: number;            // Identificador único (puede ser opcional al crear uno nuevo)
   codigo: string;  // codigo de tipo de analsisi
   nombre: string;         // descripcion del tipo de analisis
}
