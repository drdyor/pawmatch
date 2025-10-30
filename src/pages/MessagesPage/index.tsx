import React, { useEffect, useState } from 'react';
import { Conversation } from '../../lib/supabase';
import { ConversationList } from './components/ConversationList';
import { ChatThread } from './components/ChatThread';
import { getConversations } from '../../services/messaging';

export const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock current user ID (replace with real auth later)
  const currentUserId = 'current-user';

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      const data = await getConversations(currentUserId);
      setConversations(data);
      setLoading(false);

      // Auto-select first conversation if any
      if (data.length > 0 && !selectedConversationId) {
        setSelectedConversationId(data[0].id);
      }
    };

    loadConversations();
  }, []);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

  return (
    <div className="h-screen flex bg-white">
      {/* Conversations List */}
      <div className="w-full md:w-96 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-500 mt-1">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          </p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId || undefined}
            onSelect={setSelectedConversationId}
          />
        )}
      </div>

      {/* Chat Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ChatThread conversation={selectedConversation} currentUserId={currentUserId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select a conversation
            </h3>
            <p className="text-sm text-gray-500">
              Choose a conversation from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
