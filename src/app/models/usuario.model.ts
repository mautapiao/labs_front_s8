// Modelos relacionados con Usuario, Registro y Autenticación

import { RolModel } from "./rol.model";

/**
 * Usuario completo (como viene del backend)
 * Usado en: respuestas del servidor, perfil de usuario
 */
export interface Usuario {
  id?: number;
  email: string;
  rut: string;
  dv: string;
  nombreUsuario: string;
  nombres: string;
  paterno: string;
  materno?: string;
  activo: boolean;
  rolModel: RolModel;
  fechaCreacion?: string;
}

/**
 * Datos para registrar un nuevo usuario
 * Usado en: formulario de registro por defecto se graba con perfil 2 
 * se debe parametrizar ya que es una fk
 */
export interface RegistroUsuario {
  email: string;
  rut: string;
  dv: string;
  nombreUsuario: string;
  nombres: string;
  paterno: string;
  materno?: string;
  password: string;
  confirmarPassword: string; // Solo frontend (validación)
  rolModel: {
    id: number;
  };
}

/**
 * Datos para ACTUALIZAR perfil sin campos únicos
 */
export interface ActualizarPerfil {
  nombres: string;
  paterno: string;
  materno?: string;
  //email?: string; // Solo si permites cambiar email
  //password?: string; // Solo si el usuario quiere cambiar contraseña
}



