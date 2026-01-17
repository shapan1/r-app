'use client';

import { useState } from 'react';
import { useReservations } from '@/hooks/useReservations';
import { TIME_SLOTS, formatDate, formatTimeSlot, MAX_PATIENTS_PER_SLOT } from '@/lib/slots';
import type { Reservation } from '@/lib/types';
import { DatePicker } from './DatePicker';
import { AddPatientModal } from './AddPatientModal';
import { PatientDetails } from './PatientDetails';

export function ReservationGrid() {
  const today = new Date();
  const dateString = formatDate(today);

  const {
    loading,
    error,
    addReservation,
    deleteReservation,
    clearAllReservations,
    getSlotReservations,
    isSlotFull,
    clearError,
  } = useReservations(dateString);

  const [addingSlot, setAddingSlot] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Reservation | null>(null);
  const [clearing, setClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  async function handleAddPatient(patient: {
    patient_name: string;
    patient_phone?: string;
    notes?: string;
  }) {
    if (!addingSlot) return false;

    return addReservation({
      date: dateString,
      time_slot: addingSlot,
      ...patient,
    });
  }

  async function handleDeletePatient() {
    if (!selectedPatient) return false;
    return deleteReservation(selectedPatient.id);
  }

  async function handleClearAll() {
    setClearing(true);
    await clearAllReservations();
    setClearing(false);
    setShowClearConfirm(false);
  }

  // Build rows for the unified table
  function renderTableRows() {
    const rows: React.ReactNode[] = [];

    TIME_SLOTS.forEach((slot) => {
      const reservations = getSlotReservations(slot);
      const slotFull = isSlotFull(slot);

      if (reservations.length === 0) {
        // Empty slot - show time and add button
        rows.push(
          <tr key={slot} className="border-b border-zinc-100 dark:border-zinc-800">
            <td className="px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 text-center bg-zinc-50 dark:bg-zinc-900/50">
              {formatTimeSlot(slot)}
            </td>
            <td colSpan={4} className="px-4 py-3">
              <button
                onClick={() => setAddingSlot(slot)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                + Add patient
              </button>
            </td>
          </tr>
        );
      } else {
        // Slot with patients
        reservations.forEach((reservation, index) => {
          rows.push(
            <tr
              key={reservation.id}
              className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <td className="px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 text-center bg-zinc-50 dark:bg-zinc-900/50">
                {index === 0 ? formatTimeSlot(slot) : ''}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {reservation.patient_name}
              </td>
              <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                {reservation.patient_phone || '—'}
              </td>
              <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                {reservation.notes || '—'}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => setSelectedPatient(reservation)}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove
                </button>
              </td>
            </tr>
          );
        });

        // Add "Add patient" row if slot not full
        if (!slotFull) {
          rows.push(
            <tr key={`${slot}-add`} className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50"></td>
              <td colSpan={4} className="px-4 py-2">
                <button
                  onClick={() => setAddingSlot(slot)}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  + Add patient ({reservations.length}/{MAX_PATIENTS_PER_SLOT})
                </button>
              </td>
            </tr>
          );
        } else {
          // Full indicator
          rows.push(
            <tr key={`${slot}-full`} className="border-b border-zinc-200 dark:border-zinc-700">
              <td className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50"></td>
              <td colSpan={4} className="px-4 py-2">
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  Slot full ({MAX_PATIENTS_PER_SLOT}/{MAX_PATIENTS_PER_SLOT})
                </span>
              </td>
            </tr>
          );
        }
      }
    });

    return rows;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <DatePicker date={today} />

      {error && (
        <div className="mx-4 mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
          <button
            onClick={clearError}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
          </div>
        ) : (
          <div className="mx-4 my-4 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                  <th className="w-28 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Notes
                  </th>
                  <th className="w-24 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderTableRows()}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <button
          onClick={() => setShowClearConfirm(true)}
          disabled={clearing}
          className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {clearing ? 'Exiting...' : 'Exit'}
        </button>
      </div>

      {addingSlot && (
        <AddPatientModal
          timeSlot={addingSlot}
          date={dateString}
          onSave={handleAddPatient}
          onClose={() => setAddingSlot(null)}
        />
      )}

      {selectedPatient && (
        <PatientDetails
          reservation={selectedPatient}
          onDelete={handleDeletePatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xs rounded-xl bg-white p-5 shadow-xl dark:bg-zinc-900">
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                disabled={clearing}
                className="flex-1 rounded-lg border border-zinc-300 py-2.5 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-base font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {clearing ? 'Exiting...' : 'Exit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
