import { createLazyFileRoute } from '@tanstack/react-router';
import { Calendar, CheckCircle, Clock, MapPin, Users } from 'lucide-react';

import { Button, Text, Title } from '@/forge';
import type { SidebarItem } from '@/forge';
import { DashboardLayout } from '@/forge/layouts';
import { colors } from '@/forge/tokens';
import { useScheduleStore } from '@/stores/useScheduleStore';
import type { ScheduleSlot } from '@/types/schedule';

// ─── Shared constants ─────────────────────────────────────────────────────────

const SIDEBAR_ITEMS: SidebarItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { key: 'programs', label: 'Programs', icon: 'BookOpen', path: '/programs' },
  { key: 'development', label: 'Development', icon: 'Target', path: '/development' },
  { key: 'scheduling', label: 'Scheduling', icon: 'CalendarDays', path: '/scheduling' },
  { key: 'insights', label: 'Insights', icon: 'ChartBar', path: '/insights' },
];

const MOCK_USER = {
  name: 'Priya Sharma',
  role: 'Senior Manager',
};

// ─── Slot row ──────────────────────────────────────────────────────────────────

interface SlotRowProps {
  slot: ScheduleSlot;
  isBooked: boolean;
  accentColor: string;
  onBook: () => void;
  onCancel: () => void;
}

function SlotRow({ slot, isBooked, accentColor, onBook, onCancel }: SlotRowProps) {
  const isFull = slot.remaining === 0;
  const isUrgent = slot.remaining > 0 && slot.remaining <= 2;

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[#e2e8f0] bg-white px-4 py-3">
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
          {isFull ? 'Full' : `${slot.remaining}/${slot.total} spots`}
        </Text>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Booked badge / CTA */}
      {isBooked ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-[#dcfce7] px-3 py-1">
            <CheckCircle size={13} style={{ color: colors.success.DEFAULT }} />
            <Text size="xs" weight="semibold" color="success">Booked</Text>
          </div>
          {slot.cancellation && (
            <Button size="sm" variant="secondary" onClick={onCancel}>
              Cancel
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
          {isFull ? 'Full' : 'Book'}
        </Button>
      )}
    </div>
  );
}

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createLazyFileRoute('/scheduling')({
  component: SchedulingPage,
});

// ─── Page ──────────────────────────────────────────────────────────────────────

function SchedulingPage() {
  const events = useScheduleStore((s) => s.events);
  const bookedSlots = useScheduleStore((s) => s.bookedSlots);
  const bookSlot = useScheduleStore((s) => s.bookSlot);
  const cancelSlot = useScheduleStore((s) => s.cancelSlot);
  const getMyBookings = useScheduleStore((s) => s.getMyBookings);

  const myBookings = getMyBookings();

  return (
    <DashboardLayout
      sidebarItems={SIDEBAR_ITEMS}
      user={MOCK_USER}
      title="Lighthouse"
      activeKey="scheduling"
    >
      <div className="p-6 space-y-8 max-w-5xl mx-auto">

        {/* Header */}
        <div>
          <Title level={3} weight="bold" color="primary">Scheduling</Title>
          <Text color="secondary" size="sm" className="mt-1">
            Book assessment sessions for your programs
          </Text>
        </div>

        {/* My bookings */}
        {myBookings.length > 0 && (
          <section>
            <Title level={4} weight="semibold" color="primary" className="mb-3">
              My Bookings
            </Title>
            <div className="space-y-2">
              {myBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-[#e2e8f0] bg-[#f0fdf4] px-4 py-3"
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
