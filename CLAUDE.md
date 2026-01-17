# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

A real-time patient reservation system with an Excel-like grid interface. Multiple users can view and edit simultaneously with instant WebSocket sync.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Supabase (PostgreSQL + Real-time)
- Tailwind CSS

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check
```

## Key Features

- 32 time slots (12pm - 8pm, every 15 minutes)
- Max 4 patients per slot
- Real-time sync across all connected clients
- Date navigation (prev/next day)
- No authentication required (open access)

## Architecture

### Real-time Sync
Uses Supabase's real-time subscriptions via WebSocket:
- `useReservations` hook subscribes to postgres_changes
- INSERT/UPDATE/DELETE events trigger state updates
- All clients see changes instantly

### Key Files
- `src/hooks/useReservations.ts` - Real-time subscription and CRUD
- `src/components/ReservationGrid.tsx` - Main grid component
- `src/components/TimeSlotRow.tsx` - Single time slot row
- `src/lib/supabase.ts` - Supabase client
- `src/lib/slots.ts` - Time slot utilities

## Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Run `schema.sql` in SQL Editor to create the table
3. Enable real-time for the `reservations` table:
   - Database > Replication > Enable `reservations`
4. Copy project URL and anon key to `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

## Local Development

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

## Deployment

1. Deploy to Vercel
2. Add environment variables in Vercel project settings
3. Done - real-time works automatically
