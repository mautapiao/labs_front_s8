import { Laboratorio } from "./laboratorio.model";
import { PacienteModel } from "./paciente.model";
import { TipoAnalisis } from "./tipo-analisis.model";

export interface SolicitudModel {
  id?: number;
  detalleExamen: string;
  fechaSolicitud: string;
  numeroAtencion: string;
  laboratorio: Laboratorio;
  paciente: PacienteModel;
  tipoAnalisis: TipoAnalisis;

}

export interface CreateSolicitudDto {
  numeroAtencion: string;
  fechaSolicitud: string;
  detalleExamen: string;
  tipoAnalisis: { id: number };
  paciente: { id: number };
  laboratorio: { id: number };
  
}