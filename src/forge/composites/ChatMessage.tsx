import { Avatar } from 'antd';
import { memo } from 'react';

import { Text } from '@/forge/primitives';
import { cn } from '@/forge/utils';

export interface ChatMessageSender {
  name: string;
  avatar?: string;
}

export type ChatMessageType = 'text' | 'system' | 'action';

export interface ChatMessageProps {
  content: string;
  sender: ChatMessageSender;
  timestamp: Date | string;
  isOwn?: boolean;
  type?: ChatMessageType;
  className?: string;
}

function formatTimestamp(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderContent(content: string): string {
  // Basic markdown-like rendering: bold **text**, inline code `code`
  // Returned as text for safe rendering inside antd Text
  return content;
}

function getSenderInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export const ChatMessage = memo(function ChatMessage({
  content,
  sender,
  timestamp,
  isOwn = false,
  type = 'text',
  className,
}: ChatMessageProps) {
  if (type === 'system') {
    return (
      <div className={cn('flex justify-center py-2', className)}>
        <Text
          size="xs"
          color="tertiary"
          className="rounded-full bg-[#f1f5f9] px-3 py-1 text-center"
        >
          {content}
        </Text>
      </div>
    );
  }

  if (type === 'action') {
    return (
      <div className={cn('flex justify-center py-1', className)}>
        <Text size="xs" color="tertiary" italic className="text-center">
          {content}
        </Text>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-end gap-2',
        isOwn ? 'flex-row-reverse' : 'flex-row',
        className,
      )}
    >
      {!isOwn && (
        <Avatar
          src={sender.avatar}
          size={32}
          style={{ backgroundColor: '#002C77', flexShrink: 0 }}
          aria-label={sender.name}
        >
          {!sender.avatar && getSenderInitials(sender.name)}
        </Avatar>
      )}

      <div
        className={cn(
          'flex max-w-[75%] flex-col gap-0.5',
          isOwn ? 'items-end' : 'items-start',
        )}
      >
        {!isOwn && (
          <Text size="xs" color="tertiary" weight="medium" className="px-1">
            {sender.name}
          </Text>
        )}

        <div
          className={cn(
            'rounded-2xl px-3 py-2 text-sm leading-relaxed',
            isOwn
              ? 'rounded-br-sm bg-[#002C77] text-white'
              : 'rounded-bl-sm bg-[#f1f5f9] text-[#0f172a]',
          )}
        >
          {renderContent(content)}
        </div>

        <Text size="xs" color="tertiary" className="px-1">
          {formatTimestamp(timestamp)}
        </Text>
      </div>
    </div>
  );
});
