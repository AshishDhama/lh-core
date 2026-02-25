import { useEffect, useState } from 'react';

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * Returns a live countdown to the given deadline date.
 * Updates every second while the component is mounted.
 */
export function useCountdown(deadline: Date | string | null): CountdownValue {
  const targetMs = deadline ? new Date(deadline).getTime() : 0;

  function calc(): CountdownValue {
    if (!deadline) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    const diff = targetMs - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
      isExpired: false,
    };
  }

  const [value, setValue] = useState(calc);

  useEffect(() => {
    if (!deadline) return;
    const id = setInterval(() => setValue(calc()), 1_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetMs]);

  return value;
}
