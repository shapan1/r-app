'use client';

import { useState } from 'react';
import type { Reservation } from '@/lib/types';
import { formatTimeSlot } from '@/lib/slots';

interface PatientDetailsProps {
  reservation: Reservation;
  onDelete: () => Promise<boolean>;
  onClose: () => void;
}

export function PatientDetails({ reservation, onDelete, onClose }: PatientDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const success = await onDelete();
    setLoading(false);
    if (success) {
      onClose();
    }
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Remove Patient?
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Remove {reservation.patient_name} from {formatTimeSlot(reservation.time_slot)}?
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="flex-1 rounded-lg border border-zinc-300 py-2.5 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 rounded-lg bg-red-600 py-2.5 text-base font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {reservation.patient_name}
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {formatTimeSlot(reservation.time_slot)} on{' '}
          {new Date(reservation.date).toLocaleDateString()}
        </p>

        <div className="mt-4 space-y-3">
          {reservation.patient_phone && (
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Phone
              </p>
              <p className="text-zinc-900 dark:text-zinc-100">
                {reservation.patient_phone}
              </p>
            </div>
          )}
          {reservation.notes && (
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Notes
              </p>
              <p className="text-zinc-900 dark:text-zinc-100">
                {reservation.notes}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-zinc-300 py-2.5 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Close
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex-1 rounded-lg bg-red-600 py-2.5 text-base font-medium text-white transition-colors hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
