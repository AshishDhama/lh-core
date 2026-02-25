/** Scheduling type definitions. */

export interface ScheduleSlot {
  id: string;
  date: string;
  day: string;
  time: string;
  tz: string;
  total: number;
  remaining: number;
  cancellation: boolean;
  cancelBefore?: string;
}

export interface ScheduleCenter {
  id: string;
  name: string;
  desc: string;
  location: string;
  duration: string;
  icon: string;
  color: string;
  slots: ScheduleSlot[];
}

export interface SchedulingProgram {
  programId: string;
  programName: string;
  accent: string;
  centers: ScheduleCenter[];
}

export interface MyBooking extends ScheduleSlot {
  centerId: string;
  centerName: string;
  programName: string;
  location: string;
}
