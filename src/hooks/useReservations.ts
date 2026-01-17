'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Reservation, NewReservation } from '@/lib/types';
import { MAX_PATIENTS_PER_SLOT } from '@/lib/slots';

export function useReservations(date: string) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete old reservations (from previous days)
  const deleteOldReservations = useCallback(async () => {
    await supabase
      .from('reservations')
      .delete()
      .lt('date', date);
  }, [date]);

  // Fetch reservations for the given date
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Clean up old data first
    await deleteOldReservations();

    const { data, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('date', date)
      .order('time_slot', { ascending: true })
      .order('created_at', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setReservations(data || []);
    }
    setLoading(false);
  }, [date, deleteOldReservations]);

  // Subscribe to real-time changes
  useEffect(() => {
    fetchReservations();

    const channel = supabase
      .channel(`reservations-${date}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations',
          filter: `date=eq.${date}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReservations((prev) => [...prev, payload.new as Reservation]);
          } else if (payload.eventType === 'DELETE') {
            setReservations((prev) =>
              prev.filter((r) => r.id !== payload.old.id)
            );
          } else if (payload.eventType === 'UPDATE') {
            setReservations((prev) =>
              prev.map((r) =>
                r.id === payload.new.id ? (payload.new as Reservation) : r
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [date, fetchReservations]);

  // Add a reservation
  const addReservation = async (reservation: NewReservation): Promise<boolean> => {
    // Check slot count first
    const slotCount = reservations.filter(
      (r) => r.time_slot === reservation.time_slot
    ).length;

    if (slotCount >= MAX_PATIENTS_PER_SLOT) {
      setError('This time slot is full (max 4 patients)');
      return false;
    }

    const { error: insertError } = await supabase
      .from('reservations')
      .insert([reservation]);

    if (insertError) {
      setError(insertError.message);
      return false;
    }

    return true;
  };

  // Delete a reservation
  const deleteReservation = async (id: string): Promise<boolean> => {
    // Optimistic update - remove from UI immediately
    setReservations((prev) => prev.filter((r) => r.id !== id));

    const { error: deleteError } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (deleteError) {
      // Revert on error - refetch to restore
      fetchReservations();
      setError(deleteError.message);
      return false;
    }

    return true;
  };

  // Get reservations for a specific time slot
  const getSlotReservations = useCallback(
    (timeSlot: string) => {
      return reservations.filter((r) => r.time_slot === timeSlot);
    },
    [reservations]
  );

  // Check if a slot is full
  const isSlotFull = useCallback(
    (timeSlot: string) => {
      return getSlotReservations(timeSlot).length >= MAX_PATIENTS_PER_SLOT;
    },
    [getSlotReservations]
  );

  // Clear all reservations (wipe entire table)
  const clearAllReservations = async (): Promise<boolean> => {
    setReservations([]);

    const { error: deleteError } = await supabase
      .from('reservations')
      .delete()
      .gte('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (deleteError) {
      fetchReservations();
      setError(deleteError.message);
      return false;
    }

    return true;
  };

  return {
    reservations,
    loading,
    error,
    addReservation,
    deleteReservation,
    clearAllReservations,
    getSlotReservations,
    isSlotFull,
    clearError: () => setError(null),
  };
}
