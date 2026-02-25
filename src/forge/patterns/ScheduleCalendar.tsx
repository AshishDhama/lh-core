import { useState } from 'react';
import { Calendar } from 'antd';
import type { Dayjs } from 'dayjs';

import { Button } from '@/forge/primitives/Button';
import { Icon } from '@/forge/primitives/Icon';
import { Tag } from '@/forge/primitives/Tag';
import type { TagProps } from '@/forge/primitives/Tag';
import { Text, Title } from '@/forge/primitives/Typography';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

export type CalendarView = 'day' | 'week' | 'month';
export type EventType = 'assessment' | 'interview' | 'training' | 'review' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO date string
  end: string;   // ISO date string
  type: EventType;
  color?: string;
}

export interface ScheduleCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: string) => void;
  view?: CalendarView;
  currentDate?: string;
  className?: string;
}

const eventTypeColorMap: Record<EventType, TagProps['color']> = {
  assessment: 'navy',
  interview: 'teal',
  training: 'purple',
  review: 'warning',
  other: 'default',
};

function EventChip({
  event,
  onClick,
}: {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
}) {
  const tagColor = eventTypeColorMap[event.type];

  return (
    <button
      type="button"
      className="w-full text-left"
      onClick={() => onClick?.(event)}
    >
      <Tag color={tagColor} className="w-full truncate text-xs !px-1.5 !py-0.5">
        {event.title}
      </Tag>
    </button>
  );
}

/** List view: shows events grouped by date */
function EventListView({
  events,
  onEventClick,
}: {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}) {
  const grouped = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const day = ev.start.slice(0, 10);
    if (!grouped.has(day)) grouped.set(day, []);
    grouped.get(day)!.push(ev);
  }

  const sortedDays = Array.from(grouped.keys()).sort();

  if (sortedDays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <Icon name="CalendarOff" size="lg" style={{ color: colors.content.tertiary }} />
        <Text size="sm" color="tertiary">
          No events scheduled
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sortedDays.map((day) => {
        const dayEvents = grouped.get(day)!;
        const date = new Date(day);
        const dayLabel = date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });

        return (
          <div key={day} className="flex flex-col gap-2">
            <Text size="sm" weight="semibold" color="secondary" className="uppercase tracking-wide text-xs">
              {dayLabel}
            </Text>
            <div className="flex flex-col gap-1.5">
              {dayEvents.map((ev) => {
                const startTime = new Date(ev.start).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                });
                const endTime = new Date(ev.end).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                });
                const tagColor = eventTypeColorMap[ev.type];

                return (
                  <div
                    key={ev.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#e2e8f0] bg-surface-primary hover:border-[#A3C5E5] cursor-pointer transition-colors"
                    onClick={() => onEventClick?.(ev)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onEventClick?.(ev);
                      }
                    }}
                  >
                    <div className="flex flex-col items-center gap-0.5 min-w-[52px]">
                      <Text size="xs" color="tertiary">
                        {startTime}
                      </Text>
                      <div className="w-px h-3 bg-[#e2e8f0]" aria-hidden="true" />
                      <Text size="xs" color="tertiary">
                        {endTime}
                      </Text>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Text size="sm" weight="medium" color="primary" className="truncate">
                        {ev.title}
                      </Text>
                    </div>
                    <Tag color={tagColor} className="flex-shrink-0 capitalize text-xs">
                      {ev.type}
                    </Tag>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Month view: wraps antd Calendar */
function MonthView({
  events,
  onEventClick,
  onDateSelect,
}: {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: string) => void;
}) {
  function getEventsForDate(date: Dayjs): CalendarEvent[] {
    const dateStr = date.format('YYYY-MM-DD');
    return events.filter((ev) => ev.start.slice(0, 10) === dateStr);
  }

  function cellRender(date: Dayjs) {
    const dayEvents = getEventsForDate(date);
    return (
      <ul className="list-none p-0 m-0 space-y-0.5">
        {dayEvents.slice(0, 3).map((ev) => (
          <li key={ev.id}>
            <EventChip event={ev} onClick={onEventClick} />
          </li>
        ))}
        {dayEvents.length > 3 && (
          <li>
            <Text size="xs" color="tertiary">
              +{dayEvents.length - 3} more
            </Text>
          </li>
        )}
      </ul>
    );
  }

  function handleSelect(date: Dayjs) {
    onDateSelect?.(date.format('YYYY-MM-DD'));
  }

  return (
    <Calendar
      cellRender={cellRender}
      onSelect={handleSelect}
      className="rounded-xl border border-[#e2e8f0]"
    />
  );
}

export function ScheduleCalendar({
  events,
  onEventClick,
  onDateSelect,
  view: initialView = 'month',
  className,
}: ScheduleCalendarProps) {
  const [view, setView] = useState<CalendarView>(initialView);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <Title level={3} className="!mb-0">
          Schedule
        </Title>
        <div className="flex items-center gap-1 p-1 bg-[#f1f5f9] rounded-lg">
          {(['month', 'week', 'day'] as CalendarView[]).map((v) => (
            <button
              key={v}
              type="button"
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize',
                view === v
                  ? 'bg-surface-primary text-[#002C77] shadow-sm'
                  : 'text-[#64748b] hover:text-[#0f172a]',
              )}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<Icon name="Plus" size="sm" />}
          onClick={() => onDateSelect?.(new Date().toISOString().slice(0, 10))}
        >
          Book Slot
        </Button>
      </div>

      {/* Content */}
      {view === 'month' ? (
        <MonthView events={events} onEventClick={onEventClick} onDateSelect={onDateSelect} />
      ) : (
        <EventListView events={events} onEventClick={onEventClick} />
      )}
    </div>
  );
}
