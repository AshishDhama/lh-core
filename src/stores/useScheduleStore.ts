/** Zustand store for scheduling state. */

import { create } from 'zustand';

import type { SchedulingProgram, ScheduleSlot, MyBooking } from '@/types/schedule';
import { schedulingData } from '@/data/scheduling';

export type CalendarView = 'day' | 'week' | 'month';

interface ScheduleState {
  /** All scheduling programs with their centers and available slots. */
  events: SchedulingProgram[];
  /** Current calendar view mode. */
  view: CalendarView;
  /** Currently displayed date (ISO string, e.g. "2026-03-10"). */
  currentDate: string;
  /** Booked slot IDs — key: slotId, value: true. */
  bookedSlots: Record<string, boolean>;
}

interface ScheduleActions {
  /** Add a new scheduling program. */
  addEvent: (program: SchedulingProgram) => void;
  /** Update an existing program by programId. */
  updateEvent: (programId: string, updates: Partial<SchedulingProgram>) => void;
  /** Remove a scheduling program by programId. */
  deleteEvent: (programId: string) => void;
  /** Switch calendar view. */
  setView: (view: CalendarView) => void;
  /** Navigate to a specific date. */
  setDate: (date: string) => void;
  /** Book a slot by slotId. Decrements remaining count. */
  bookSlot: (slotId: string) => void;
  /** Cancel a booked slot by slotId. Restores remaining count. */
  cancelSlot: (slotId: string) => void;
  /** Derive bookings for the current user from bookedSlots. */
  getMyBookings: () => MyBooking[];
}

type ScheduleStore = ScheduleState & ScheduleActions;

function updateSlotInPrograms(
  programs: SchedulingProgram[],
  slotId: string,
  updater: (slot: ScheduleSlot) => ScheduleSlot,
): SchedulingProgram[] {
  return programs.map((prog) => ({
    ...prog,
    centers: prog.centers.map((center) => ({
      ...center,
      slots: center.slots.map((slot) =>
        slot.id === slotId ? updater(slot) : slot,
      ),
    })),
  }));
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  events: schedulingData,
  view: 'month',
  currentDate: new Date().toISOString().split('T')[0],
  bookedSlots: {},

  addEvent: (program) =>
    set((state) => ({ events: [...state.events, program] })),

  updateEvent: (programId, updates) =>
    set((state) => ({
      events: state.events.map((p) =>
        p.programId === programId ? { ...p, ...updates } : p,
      ),
    })),

  deleteEvent: (programId) =>
    set((state) => ({
      events: state.events.filter((p) => p.programId !== programId),
    })),

  setView: (view) => set({ view }),

  setDate: (date) => set({ currentDate: date }),

  bookSlot: (slotId) =>
    set((state) => ({
      bookedSlots: { ...state.bookedSlots, [slotId]: true },
      events: updateSlotInPrograms(state.events, slotId, (slot) => ({
        ...slot,
        remaining: Math.max(0, slot.remaining - 1),
      })),
    })),

  cancelSlot: (slotId) =>
    set((state) => {
      const updatedBookedSlots = { ...state.bookedSlots };
      delete updatedBookedSlots[slotId];
      return {
        bookedSlots: updatedBookedSlots,
        events: updateSlotInPrograms(state.events, slotId, (slot) => ({
          ...slot,
          remaining: slot.remaining + 1,
        })),
      };
    }),

  getMyBookings: () => {
    const { events, bookedSlots } = get();
    const bookings: MyBooking[] = [];
    events.forEach((prog) => {
      prog.centers.forEach((center) => {
        center.slots.forEach((slot) => {
          if (bookedSlots[slot.id]) {
            bookings.push({
              ...slot,
              centerId: center.id,
              centerName: center.name,
              programName: prog.programName,
              location: center.location,
            });
          }
        });
      });
    });
    return bookings;
  },
}));
