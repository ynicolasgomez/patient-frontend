import { Patient } from "./patient.model";

export interface Order {
  id: number;
  patientId: number;
  fechaOrden: string; // Puede ser tipo `Date` si haces transformación
  patient?: Patient; // Solo si se incluye en las respuestas
}
