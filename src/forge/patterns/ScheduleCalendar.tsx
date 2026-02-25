import { useState } from 'react';
import { Popover } from 'antd';
import { ChevronLeft, ChevronRight, Calendar, List } from 'lucide-react';

import { Button } from '@/forge/primitives/Button';
import { Icon } from '@/forge/primitives/Icon';
import { Tag } from '@/forge/primitives/Tag';
import type { TagProps } from '@/forge/primitives/Tag';
import { Text, Title } from '@/forge/primitives/Typography';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

export type DisplayMode = 'list' | 'calendar';
export type CalendarView = 'day' | 'week' | 'month';
export type EventType =
  | 'assessment'
  | 'interview'
  | 'training'
  | 'review'
  | 'workshop'
  | 'deadline'
  | 'other';

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
  workshop: 'teal',
  deadline: 'error',
  other: 'default',
};

/** Dot color for calendar grid cells — hex values keyed by EventType */
const eventTypeDotColor: Record<EventType, string> = {
  assessment: colors.navy.DEFAULT,
  interview: colors.teal.DEFAULT,
  training: colors.purple.DEFAULT,
  review: colors.warning.DEFAULT,
  workshop: colors.teal[400],
  deadline: colors.error.DEFAULT,
  other: colors.content.tertiary,
};

// ─── List view ────────────────────────────────────────────────────────────────

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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface-primary hover:border-navy-200 cursor-pointer transition-colors"
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
                      <div className="w-px h-3 bg-border" aria-hidden="true" />
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

// ─── Calendar grid view ───────────────────────────────────────────────────────

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

function DayCell({ date, isCurrentMonth, isToday, events, onEventClick }: DayCellProps) {
  const dayNum = date.getDate();
  const hasEvents = events.length > 0;

  const cell = (
    <div
      className={cn(
        'relative min-h-[72px] p-1.5 border border-border rounded-lg flex flex-col gap-1 transition-colors',
        isCurrentMonth ? 'bg-surface-primary' : 'bg-surface-secondary',
        isToday && 'border-navy-400 bg-navy-50',
        hasEvents && isCurrentMonth && 'hover:border-navy-200 cursor-pointer',
      )}
    >
      {/* Day number */}
      <span
        className={cn(
          'text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full self-end',
          isToday
            ? 'bg-navy text-white'
            : isCurrentMonth
              ? 'text-content-primary'
              : 'text-content-tertiary',
        )}
        style={isToday ? { backgroundColor: colors.navy.DEFAULT } : undefined}
      >
        {dayNum}
      </span>

      {/* Event dots */}
      {hasEvents && (
        <div className="flex flex-wrap gap-0.5 mt-auto">
          {events.slice(0, 5).map((ev) => (
            <span
              key={ev.id}
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: eventTypeDotColor[ev.type] }}
              aria-hidden="true"
            />
          ))}
          {events.length > 5 && (
            <span
              className="text-[9px] leading-none text-content-tertiary self-center ml-0.5"
            >
              +{events.length - 5}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (!hasEvents) return cell;

  const popoverContent = (
    <div className="flex flex-col gap-2 max-w-[260px]">
      <Text size="xs" weight="semibold" color="secondary" className="uppercase tracking-wide">
        {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </Text>
      <div className="flex flex-col gap-1.5">
        {events.map((ev) => {
          const tagColor = eventTypeColorMap[ev.type];
          const startTime = new Date(ev.start).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          });
          return (
            <button
              key={ev.id}
              type="button"
              className="w-full text-left flex items-center gap-2 hover:opacity-80 transition-opacity"
              onClick={() => onEventClick?.(ev)}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: eventTypeDotColor[ev.type] }}
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <Tag color={tagColor} className="w-full truncate text-xs !px-1.5 !py-0.5">
                  {ev.title}
                </Tag>
              </div>
              <Text size="xs" color="tertiary" className="shrink-0">
                {startTime}
              </Text>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      placement="bottom"
      arrow={false}
    >
      {cell}
    </Popover>
  );
}

/** Builds a 6-row x 7-col grid of dates for the given month. */
function buildCalendarGrid(year: number, month: number): Date[] {
  // month is 0-indexed
  const firstDay = new Date(year, month, 1);
  // getDay(): 0=Sun, 1=Mon, ... 6=Sat; we want Mon=0
  const startOffset = (firstDay.getDay() + 6) % 7;
  const start = new Date(firstDay);
  start.setDate(start.getDate() - startOffset);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function CalendarGridView({
  events,
  onEventClick,
  onDateSelect,
}: {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: string) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const gridDays = buildCalendarGrid(viewYear, viewMonth);
  const todayStr = toLocalDateStr(today);

  // Build a map of dateStr -> events for quick lookup
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const dateStr = ev.start.slice(0, 10);
    if (!eventsByDate.has(dateStr)) eventsByDate.set(dateStr, []);
    eventsByDate.get(dateStr)!.push(ev);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-surface-tertiary transition-colors text-content-secondary hover:text-content-primary"
        >
          <ChevronLeft size={16} />
        </button>
        <Text size="sm" weight="semibold" color="primary">
          {monthLabel}
        </Text>
        <button
          type="button"
          aria-label="Next month"
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-surface-tertiary transition-colors text-content-secondary hover:text-content-primary"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center">
            <Text size="xs" color="tertiary" weight="medium" className="uppercase tracking-wide">
              {d}
            </Text>
          </div>
        ))}
      </div>

      {/* Grid cells */}
      <div className="grid grid-cols-7 gap-1">
        {gridDays.map((date) => {
          const dateStr = toLocalDateStr(date);
          const dayEvents = eventsByDate.get(dateStr) ?? [];
          const isCurrentMonth = date.getMonth() === viewMonth;
          const isToday = dateStr === todayStr;

          return (
            <div
              key={dateStr}
              onClick={() => {
                if (dayEvents.length === 0 && isCurrentMonth) {
                  onDateSelect?.(dateStr);
                }
              }}
            >
              <DayCell
                date={date}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                events={dayEvents}
                onEventClick={onEventClick}
              />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {(
          [
            ['assessment', 'Assessment'],
            ['workshop', 'Workshop'],
            ['deadline', 'Deadline'],
            ['interview', 'Interview'],
            ['training', 'Training'],
          ] as [EventType, string][]
        ).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: eventTypeDotColor[type] }}
              aria-hidden="true"
            />
            <Text size="xs" color="tertiary">
              {label}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ScheduleCalendar({
  events,
  onEventClick,
  onDateSelect,
  className,
}: ScheduleCalendarProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('list');

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Title level={3} className="!mb-0">
          Schedule
        </Title>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 bg-surface-tertiary rounded-lg">
          <button
            type="button"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              displayMode === 'list'
                ? 'bg-surface-primary shadow-sm text-content-primary'
                : 'text-content-tertiary hover:text-content-primary',
            )}
            onClick={() => setDisplayMode('list')}
            aria-pressed={displayMode === 'list'}
          >
            <List size={14} aria-hidden="true" />
            List
          </button>
          <button
            type="button"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              displayMode === 'calendar'
                ? 'bg-surface-primary shadow-sm text-content-primary'
                : 'text-content-tertiary hover:text-content-primary',
            )}
            onClick={() => setDisplayMode('calendar')}
            aria-pressed={displayMode === 'calendar'}
          >
            <Calendar size={14} aria-hidden="true" />
            Calendar
          </button>
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
      {displayMode === 'calendar' ? (
        <CalendarGridView events={events} onEventClick={onEventClick} onDateSelect={onDateSelect} />
      ) : (
        <EventListView events={events} onEventClick={onEventClick} />
      )}
    </div>
  );
}
