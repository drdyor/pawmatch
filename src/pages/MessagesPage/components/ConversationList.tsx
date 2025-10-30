import React from 'react';
import { Conversation } from '../../../lib/supabase';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
}) => {
  const formatLastMessage = (message: string) => {
    return message.length > 50 ? message.substring(0, 50) + '...' : message;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
        <p className="text-sm text-gray-500">
          Start swiping and matching to begin conversations!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelect(conversation.id)}
          className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition text-left ${
            selectedId === conversation.id ? 'bg-amber-50 hover:bg-amber-50' : ''
          }`}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={conversation.other_user?.avatar || '/placeholder-avatar.png'}
              alt={conversation.other_user?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {(conversation.unread_count || 0) > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {conversation.unread_count}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-1">
              <h4 className="font-semibold text-gray-900 truncate">
                {conversation.other_user?.name || 'Unknown'}
              </h4>
              {conversation.last_message && (
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {formatTime(conversation.last_message.created_at)}
                </span>
              )}
            </div>
            {conversation.last_message && (
              <p
                className={`text-sm truncate ${
                  conversation.unread_count && conversation.unread_count > 0
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-500'
                }`}
              >
                {conversation.last_message.sender_id === 'current-user' && 'You: '}
                {formatLastMessage(conversation.last_message.content)}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
