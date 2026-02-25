import { useEffect, useRef, useState } from 'react';

import { Button } from '@/forge/primitives/Button';
import { Icon } from '@/forge/primitives/Icon';
import { Text, Title } from '@/forge/primitives/Typography';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';
import { useTranslation } from '@/i18n';
import { useThemeStore } from '@/stores/useThemeStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
}

export function ChatFAB() {
  const locale = useThemeStore((s) => s.locale);
  const { t } = useTranslation(locale);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chat.greeting'),
      sender: 'assistant',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate assistant reply
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          text: "Thanks for your message! I'm here to help with your programs and assessments. This is a demo response.",
          sender: 'assistant',
        },
      ]);
    }, 1200);
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl border border-border bg-surface-primary shadow-2xl overflow-hidden max-h-[480px]">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border flex-shrink-0 bg-surface-primary">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-50 dark:bg-navy-900/20">
              <Icon name="Bot" size="sm" style={{ color: colors.navy.DEFAULT }} />
            </div>
            <div className="flex-1 min-w-0">
              <Title level={4} className="!text-sm !font-semibold !mb-0">
                {t('chat.title')}
              </Title>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                <Text size="xs" color="tertiary">{t('header.online')}</Text>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={<Icon name="X" size="sm" />}
              onClick={() => setOpen(false)}
              aria-label={t('actions.close')}
            />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-2',
                  msg.sender === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                {msg.sender === 'assistant' && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-navy-50 dark:bg-navy-900/20 flex items-center justify-center">
                    <Icon name="Bot" size={14} style={{ color: colors.navy.DEFAULT }} />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-3.5 py-2.5',
                    msg.sender === 'user'
                      ? 'bg-navy text-white rounded-br-md'
                      : 'bg-surface-tertiary text-content-primary rounded-bl-md',
                  )}
                >
                  <Text size="sm" className={msg.sender === 'user' ? '!text-white' : undefined}>
                    {msg.text}
                  </Text>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-navy-50 dark:bg-navy-900/20 flex items-center justify-center">
                  <Icon name="Bot" size={14} style={{ color: colors.navy.DEFAULT }} />
                </div>
                <div className="flex gap-1 items-center px-3 py-2">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-content-tertiary animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-border flex-shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t('chat.placeholder')}
              className="flex-1 rounded-lg border border-border bg-surface-primary px-3 py-2 text-sm text-content-primary placeholder:text-content-tertiary focus:outline-none focus:ring-2 focus:ring-navy"
            />
            <Button
              variant="primary"
              size="sm"
              icon={<Icon name="Send" size="sm" style={{ color: colors.content.inverse }} />}
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label={t('actions.send')}
            />
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'flex items-center justify-center w-14 h-14 rounded-full',
          'bg-navy text-white shadow-lg',
          'hover:bg-navy-600 active:scale-95',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2',
        )}
        aria-label={open ? t('actions.close') : t('chat.title')}
      >
        <Icon name={open ? 'X' : 'MessageCircle'} size="md" />
      </button>
    </>
  );
}
