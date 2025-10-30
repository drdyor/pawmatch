import React, { useEffect, useRef, useState } from 'react';
import { Message, Conversation } from '../../../lib/supabase';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { getMessages, sendMessage, markAsRead, subscribeToMessages } from '../../../services/messaging';

interface ChatThreadProps {
  conversation: Conversation;
  currentUserId: string;
}

export const ChatThread: React.FC<ChatThreadProps> = ({ conversation, currentUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      const data = await getMessages(conversation.id);
      setMessages(data);
      setLoading(false);
      
      // Mark as read
      await markAsRead(conversation.id, currentUserId);
    };

    loadMessages();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToMessages(conversation.id, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      // Mark as read if it's from the other user
      if (newMessage.sender_id !== currentUserId) {
        markAsRead(conversation.id, currentUserId);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [conversation.id, currentUserId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string) => {
    setSending(true);
    const newMessage = await sendMessage(conversation.id, currentUserId, content);
    if (newMessage) {
      setMessages((prev) => [...prev, newMessage]);
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
        <img
          src={conversation.other_user?.avatar || '/placeholder-avatar.png'}
          alt={conversation.other_user?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{conversation.other_user?.name || 'Unknown'}</h3>
          <p className="text-xs text-gray-500">Matched on PawMatch</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3">👋</div>
            <p className="text-sm text-gray-500">
              Say hello to {conversation.other_user?.name}!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={sending} />
    </div>
  );
};
