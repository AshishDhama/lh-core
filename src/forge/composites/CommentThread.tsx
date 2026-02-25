import { Avatar, Input } from 'antd';
import { Reply } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/forge/primitives';
import { Text } from '@/forge/primitives';
import { cn } from '@/forge/utils';

export interface CommentReply {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: Date | string;
}

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: Date | string;
  replies?: CommentReply[];
}

export interface CommentThreadProps {
  comments: Comment[];
  onReply?: (commentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  placeholder?: string;
  className?: string;
}

function formatTimestamp(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function getSenderInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

interface CommentItemProps {
  comment: Comment | CommentReply;
  isReply?: boolean;
  onReply?: (content: string) => void;
}

function CommentItem({ comment, isReply = false, onReply }: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onReply?.(replyText.trim());
    setReplyText('');
    setShowReplyInput(false);
  };

  return (
    <div className={cn('flex gap-2.5', isReply && 'pl-10')}>
      <Avatar
        src={comment.avatar}
        size={isReply ? 28 : 32}
        style={{ backgroundColor: 'var(--color-navy)', flexShrink: 0 }}
        aria-label={comment.author}
      >
        {!comment.avatar && getSenderInitials(comment.author)}
      </Avatar>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="rounded-xl bg-surface-tertiary px-3 py-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <Text size="sm" weight="semibold" color="primary">
              {comment.author}
            </Text>
            <Text size="xs" color="tertiary">
              {formatTimestamp(comment.timestamp)}
            </Text>
          </div>
          <Text size="sm" color="primary" className="mt-0.5 leading-relaxed">
            {comment.content}
          </Text>
        </div>

        {!isReply && onReply && (
          <button
            type="button"
            className="flex items-center gap-1 self-start px-1 text-xs text-content-tertiary hover:text-content-secondary transition-colors"
            onClick={() => setShowReplyInput((prev) => !prev)}
            aria-expanded={showReplyInput}
          >
            <Reply size={12} aria-hidden="true" />
            Reply
          </button>
        )}

        {showReplyInput && (
          <div className="mt-1 flex gap-2">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              aria-label="Write a reply"
              size="small"
              className="rounded-lg"
              onPressEnter={handleSubmitReply}
              autoFocus
            />
            <Button
              size="sm"
              variant="primary"
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
            >
              Send
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowReplyInput(false);
                setReplyText('');
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentThread({
  comments,
  onReply,
  className,
}: CommentThreadProps) {
  if (comments.length === 0) {
    return (
      <div className={cn('py-6 text-center', className)}>
        <Text size="sm" color="tertiary">
          No comments yet.
        </Text>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {comments.map((comment) => (
        <div key={comment.id} className="flex flex-col gap-2">
          <CommentItem
            comment={comment}
            onReply={onReply ? (content) => onReply(comment.id, content) : undefined}
          />

          {comment.replies && comment.replies.length > 0 && (
            <div className="flex flex-col gap-2 pl-2 border-l-2 border-surface-tertiary ml-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
