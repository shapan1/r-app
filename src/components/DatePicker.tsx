'use client';

import { formatDisplayDate } from '@/lib/slots';

interface DatePickerProps {
  date: Date;
}

export function DatePicker({ date }: DatePickerProps) {
  return (
    <div className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
        {formatDisplayDate(date)}
      </p>
    </div>
  );
}
