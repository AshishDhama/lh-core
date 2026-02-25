import { ChatAssistant } from '@/forge/patterns/ChatAssistant';
import type { ChatAssistantMessage } from '@/forge/patterns/ChatAssistant';
import { PlanEditor } from '@/forge/patterns/PlanEditor';
import type { Goal } from '@/forge/patterns/PlanEditor';
import { cn } from '@/forge/utils';

export interface IdpBuilderProps {
  goals: Goal[];
  messages: ChatAssistantMessage[];
  onSend: (text: string) => void;
  onGoalUpdate?: (goalId: string, updates: Partial<Goal>) => void;
  onAddGoal?: () => void;
  suggestions?: string[];
  isTyping?: boolean;
  className?: string;
}

export function IdpBuilder({
  goals,
  messages,
  onSend,
  onGoalUpdate,
  onAddGoal,
  suggestions,
  isTyping,
  className,
}: IdpBuilderProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-6',
        'min-h-[600px]',
        className,
      )}
    >
      {/* Left panel: AI chat assistant */}
      <div className="flex flex-col min-h-[500px] lg:min-h-0">
        <ChatAssistant
          messages={messages}
          onSend={onSend}
          title="IDP Coach"
          placeholder="Ask me to add goals, suggest skills, or review your plan…"
          suggestions={suggestions}
          isTyping={isTyping}
          className="h-full"
        />
      </div>

      {/* Right panel: Plan editor */}
      <div className="overflow-y-auto">
        <PlanEditor
          goals={goals}
          onGoalUpdate={onGoalUpdate}
          onAddGoal={onAddGoal}
        />
      </div>
    </div>
  );
}
