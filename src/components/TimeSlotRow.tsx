'use client';

import type { Reservation } from '@/lib/types';
import { formatTimeSlot, MAX_PATIENTS_PER_SLOT } from '@/lib/slots';

interface TimeSlotRowProps {
  timeSlot: string;
  reservations: Reservation[];
  isFull: boolean;
  onAddClick: () => void;
  onPatientClick: (reservation: Reservation) => void;
}

export function TimeSlotRow({
  timeSlot,
  reservations,
  isFull,
  onAddClick,
  onPatientClick,
}: TimeSlotRowProps) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center border-b border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {formatTimeSlot(timeSlot)}
        </span>
        <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500">
          ({reservations.length}/{MAX_PATIENTS_PER_SLOT})
        </span>
        {isFull ? (
          <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
            FULL
          </span>
        ) : (
          <button
            onClick={onAddClick}
            className="ml-auto rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
          >
            + Add Patient
          </button>
        )}
      </div>
      {reservations.length > 0 && (
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-25 text-left text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="px-3 py-2 font-medium w-24 text-center">Time</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Phone</th>
              <th className="px-3 py-2 font-medium">Notes</th>
              <th className="px-3 py-2 font-medium w-20"></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr
                key={reservation.id}
                className="border-b border-zinc-50 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50"
              >
                <td className="px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 text-center">
                  {index === 0 ? formatTimeSlot(timeSlot) : ''}
                </td>
                <td className="px-3 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {reservation.patient_name}
                </td>
                <td className="px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {reservation.patient_phone || '—'}
                </td>
                <td className="px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {reservation.notes || '—'}
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => onPatientClick(reservation)}
                    className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
