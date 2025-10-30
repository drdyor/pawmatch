import React from 'react';
import { Message } from '../../../lib/supabase';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3 animate-fadeIn`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isOwn
            ? 'bg-amber-500 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <div className="flex items-center justify-end mt-1 gap-1">
          <span className={`text-xs ${isOwn ? 'text-amber-100' : 'text-gray-500'}`}>
            {formatTime(message.created_at)}
          </span>
          {isOwn && message.read && (
            <span className="text-xs text-amber-100" title="Read">
              ✓✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
