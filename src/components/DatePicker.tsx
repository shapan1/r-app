'use client';

import { formatDisplayDate } from '@/lib/slots';

interface DatePickerProps {
  date: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export function DatePicker({ date, onPrevDay, onNextDay, onToday }: DatePickerProps) {
  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <button
        onClick={onPrevDay}
        className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="text-center">
        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
          {formatDisplayDate(date)}
        </p>
        {!isToday && (
          <button
            onClick={onToday}
            className="mt-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            Go to Today
          </button>
        )}
      </div>

      <button
        onClick={onNextDay}
        className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
