/** User-related type definitions. */

export type UserRole = 'participant' | 'manager' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  manager?: string;
}

export type MessageFrom = 'user' | 'manager' | 'bot';

export interface Comment {
  from: MessageFrom;
  name: string;
  text: string;
  ts: string;
}

export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}
