'use client';

import type { Reservation } from '@/lib/types';

interface PatientChipProps {
  reservation: Reservation;
  onClick: () => void;
}

export function PatientChip({ reservation, onClick }: PatientChipProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
    >
      {reservation.patient_name}
    </button>
  );
}
