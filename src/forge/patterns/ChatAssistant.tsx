import { useEffect, useRef, useState } from 'react';

import { Button } from '@/forge/primitives/Button';
import { Icon } from '@/forge/primitives/Icon';
import { Input } from '@/forge/primitives/Input';
import { Tag } from '@/forge/primitives/Tag';
import { Text, Title } from '@/forge/primitives/Typography';
import { ChatMessage } from '@/forge/composites/ChatMessage';
import type { ChatMessageProps } from '@/forge/composites/ChatMessage';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

export type ChatAssistantMessage = Omit<ChatMessageProps, 'className'> & {
  id: string;
};

export interface ChatAssistantProps {
  messages: ChatAssistantMessage[];
  onSend: (text: string) => void;
  placeholder?: string;
  isTyping?: boolean;
  suggestions?: string[];
  title?: string;
  className?: string;
}

export function ChatAssistant({
  messages,
  onSend,
  placeholder = 'Type a message…',
  isTyping = false,
  suggestions = [],
  title = 'AI Assistant',
  className,
}: ChatAssistantProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleSend() {
    const text = inputValue.trim();
    if (!text) return;
    onSend(text);
    setInputValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSuggestion(suggestion: string) {
    onSend(suggestion);
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full min-h-0',
        'bg-surface-primary rounded-2xl border border-border',
        'overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border flex-shrink-0">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-50 dark:bg-navy-900/20"
          aria-hidden="true"
        >
          <Icon name="Bot" size="sm" style={{ color: colors.navy.DEFAULT }} />
        </div>
        <Title level={4} className="!text-sm !font-semibold !mb-0">
          {title}
        </Title>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success" aria-hidden="true" />
          <Text size="xs" color="tertiary">
            Online
          </Text>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-0">
        {messages.map(({ id, ...msgProps }) => (
          <ChatMessage key={id} {...msgProps} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 px-3 py-2">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-full bg-navy-50 dark:bg-navy-900/20"
              aria-hidden="true"
            >
              <Icon name="Bot" size={14} style={{ color: colors.navy.DEFAULT }} />
            </div>
            <div className="flex gap-1 items-center" aria-label="Assistant is typing">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-content-tertiary animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 py-2 border-t border-surface-tertiary">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="cursor-pointer"
              onClick={() => handleSuggestion(s)}
            >
              <Tag className="hover:bg-navy-50 dark:bg-navy-900/20 hover:border-navy-200">{s}</Tag>
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border flex-shrink-0">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
          aria-label="Message input"
        />
        <Button
          variant="primary"
          size="sm"
          icon={<Icon name="Send" size="sm" style={{ color: colors.content.inverse }} />}
          onClick={handleSend}
          disabled={!inputValue.trim()}
          aria-label="Send message"
        />
      </div>
    </div>
  );
}
