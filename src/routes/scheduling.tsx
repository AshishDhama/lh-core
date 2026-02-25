import { createFileRoute } from '@tanstack/react-router';
import { Calendar, CheckCircle, Clock, MapPin, Users } from 'lucide-react';

import { Button, Text, Title } from '@/forge';
import { ScheduleCalendar } from '@/forge/patterns/ScheduleCalendar';
import type { CalendarEvent } from '@/forge/patterns/ScheduleCalendar';
import { DashboardLayout } from '@/forge/layouts';
import { colors } from '@/forge/tokens';
import { useScheduleStore } from '@/stores/useScheduleStore';
import type { ScheduleSlot, SchedulingProgram } from '@/types/schedule';
import { useTranslation } from '@/i18n';
import { useThemeStore } from '@/stores/useThemeStore';
import { useSidebarItems } from '@/hooks';

// ─── Shared constants ─────────────────────────────────────────────────────────

const MOCK_USER = {
  name: 'Priya Sharma',
  role: 'Senior Manager',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts SchedulingProgram[] (slot-based format) into CalendarEvent[] for
 * the ScheduleCalendar component. Each slot produces one CalendarEvent.
 */
function programsToCalendarEvents(programs: SchedulingProgram[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const prog of programs) {
    for (const center of prog.centers) {
      for (const slot of center.slots) {
        // Attempt to parse the human-readable date string (e.g. "Mar 10, 2026")
        const dateObj = new Date(slot.date);
        // Fall back to today if parsing fails
        const dateStr = isNaN(dateObj.getTime())
          ? new Date().toISOString().slice(0, 10)
          : dateObj.toISOString().slice(0, 10);

        // Parse start time from slot.time (e.g. "9:00 AM – 10:30 AM")
        const timeParts = slot.time.split('–').map((s) => s.trim());
        const startTimeStr = timeParts[0] ?? '9:00 AM';
        const endTimeStr = timeParts[1] ?? startTimeStr;

        const startDate = new Date(`${dateStr} ${startTimeStr}`);
        const endDate = new Date(`${dateStr} ${endTimeStr}`);

        // Use valid dates or fall back to midnight on dateStr
        const startISO = isNaN(startDate.getTime())
          ? `${dateStr}T09:00:00`
          : startDate.toISOString();
        const endISO = isNaN(endDate.getTime())
          ? `${dateStr}T10:00:00`
          : endDate.toISOString();

        events.push({
          id: slot.id,
          title: `${prog.programName} — ${center.name}`,
          start: startISO,
          end: endISO,
          type: 'assessment',
          color: center.color,
        });
      }
    }
  }

  return events;
}

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute('/scheduling')({
  component: SchedulingPage,
});

// ─── Slot row ──────────────────────────────────────────────────────────────────

interface SlotRowProps {
  slot: ScheduleSlot;
  isBooked: boolean;
  accentColor: string;
  onBook: () => void;
  onCancel: () => void;
}

function SlotRow({ slot, isBooked, accentColor, onBook, onCancel }: SlotRowProps) {
  const locale = useThemeStore((s) => s.locale);
  const { t } = useTranslation(locale);
  const isFull = slot.remaining === 0;
  const isUrgent = slot.remaining > 0 && slot.remaining <= 2;

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface-primary px-4 py-3">
      {/* Date / time */}
      <div className="flex items-start gap-2 min-w-[160px]">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          <Calendar size={15} />
        </div>
        <div>
          <Text size="sm" weight="semibold" color="primary">{slot.date}</Text>
          <Text size="xs" color="tertiary">{slot.day} · {slot.time}</Text>
        </div>
      </div>

      {/* Timezone */}
      <div className="flex items-center gap-1.5">
        <Clock size={13} style={{ color: colors.content.tertiary }} />
        <Text size="xs" color="tertiary">{slot.tz}</Text>
      </div>

      {/* Capacity */}
      <div className="flex items-center gap-1.5">
        <Users size={13} style={{
          color: isUrgent ? colors.warning.DEFAULT : colors.content.tertiary,
        }} />
        <Text
          size="xs"
          color={isUrgent ? 'warning' : 'tertiary'}
          weight={isUrgent ? 'semibold' : 'normal'}
        >
          {isFull ? t('status.full') : `${slot.remaining}/${slot.total} spots`}
        </Text>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Booked badge / CTA */}
      {isBooked ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-success-light/40 px-3 py-1">
            <CheckCircle size={13} style={{ color: colors.success.DEFAULT }} />
            <Text size="xs" weight="semibold" color="success">{t('status.booked')}</Text>
          </div>
          {slot.cancellation && (
            <Button size="sm" variant="secondary" onClick={onCancel}>
              {t('actions.cancel')}
            </Button>
          )}
        </div>
      ) : (
        <Button
          size="sm"
          variant="primary"
          disabled={isFull}
          onClick={onBook}
        >
          {isFull ? t('status.full') : t('actions.book')}
        </Button>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

function SchedulingPage() {
  const locale = useThemeStore((s) => s.locale);
  const { t } = useTranslation(locale);
  const sidebarItems = useSidebarItems();

  const events = useScheduleStore((s) => s.events);
  const bookedSlots = useScheduleStore((s) => s.bookedSlots);
  const bookSlot = useScheduleStore((s) => s.bookSlot);
  const cancelSlot = useScheduleStore((s) => s.cancelSlot);
  const getMyBookings = useScheduleStore((s) => s.getMyBookings);

  const myBookings = getMyBookings();

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      user={MOCK_USER}
      title="Lighthouse"
      activeKey="scheduling"
    >
      <div className="p-6 space-y-8 max-w-5xl mx-auto">

        {/* Header */}
        <div>
          <Title level={3} weight="bold" color="primary">{t('pages.scheduling')}</Title>
          <Text color="secondary" size="sm" className="mt-1">
            {t('schedule.subtitle')}
          </Text>
        </div>

        {/* Calendar view — all slots as CalendarEvents */}
        <ScheduleCalendar
          events={programsToCalendarEvents(events)}
          onDateSelect={(date) => {
            // Selecting an empty date navigates to today's date in the URL or store
            void date;
          }}
        />

        {/* My bookings */}
        {myBookings.length > 0 && (
          <section>
            <Title level={4} weight="semibold" color="primary" className="mb-3">
              {t('schedule.myBookings')}
            </Title>
            <div className="space-y-2">
              {myBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-success-light/20 px-4 py-3"
                >
                  <CheckCircle size={16} style={{ color: colors.success.DEFAULT }} />
                  <div>
                    <Text size="sm" weight="semibold" color="primary">{booking.programName}</Text>
                    <Text size="xs" color="secondary">{booking.centerName}</Text>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} style={{ color: colors.content.tertiary }} />
                    <Text size="xs" color="tertiary">{booking.date} · {booking.time}</Text>
                  </div>
                  {booking.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} style={{ color: colors.content.tertiary }} />
                      <Text size="xs" color="tertiary">{booking.location}</Text>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Available slots — grouped by program + center */}
        {events.map((program) => (
          <section key={program.programId}>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: program.accent }}
              />
              <Title level={4} weight="semibold" color="primary">
                {program.programName}
              </Title>
            </div>

            <div className="space-y-5">
              {program.centers.map((center) => (
                <div key={center.id}>
                  {/* Center header */}
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <Text size="sm" weight="semibold" color="secondary">{center.name}</Text>
                    <Text size="xs" color="tertiary">· {center.duration}</Text>
                    {center.location && (
                      <>
                        <Text size="xs" color="tertiary">·</Text>
                        <div className="flex items-center gap-1">
                          <MapPin size={11} style={{ color: colors.content.tertiary }} />
                          <Text size="xs" color="tertiary">{center.location}</Text>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Slots */}
                  <div className="space-y-2">
                    {center.slots.map((slot) => (
                      <SlotRow
                        key={slot.id}
                        slot={slot}
                        isBooked={!!bookedSlots[slot.id]}
                        accentColor={center.color}
                        onBook={() => bookSlot(slot.id)}
                        onCancel={() => cancelSlot(slot.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="h-8" aria-hidden="true" />
      </div>
    </DashboardLayout>
  );
}
