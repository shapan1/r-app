export interface Reservation {
  id: string;
  date: string;
  time_slot: string;
  patient_name: string;
  patient_phone: string | null;
  notes: string | null;
  created_at: string;
}

export interface NewReservation {
  date: string;
  time_slot: string;
  patient_name: string;
  patient_phone?: string;
  notes?: string;
}
