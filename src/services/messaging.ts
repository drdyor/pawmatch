import { supabase, isDemoMode, Message, Conversation } from '../lib/supabase';

// Demo data for when Supabase isn't configured
const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    match_id: 'match-1',
    created_at: new Date().toISOString(),
    other_user: {
      id: 'user-max',
      name: 'Max (Border Collie)',
      avatar: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=100&h=100&fit=crop',
    },
    last_message: {
      id: 'msg-1',
      conversation_id: '1',
      sender_id: 'user-max',
      content: 'Hi! Luna looks amazing! Would love to arrange a meetup.',
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    },
    unread_count: 1,
  },
  {
    id: '2',
    match_id: 'match-2',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    other_user: {
      id: 'user-odin',
      name: 'Odin (Australian Shepherd)',
      avatar: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=100&h=100&fit=crop',
    },
    last_message: {
      id: 'msg-2',
      conversation_id: '2',
      sender_id: 'current-user',
      content: 'Thanks! Let me check the heat tracker first.',
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    unread_count: 0,
  },
];

const DEMO_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'msg-1-1',
      conversation_id: '1',
      sender_id: 'user-max',
      content: 'Hi! Luna looks amazing!',
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: 'msg-1-2',
      conversation_id: '1',
      sender_id: 'user-max',
      content: 'Would love to arrange a meetup. Is she available for breeding next month?',
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  ],
  '2': [
    {
      id: 'msg-2-1',
      conversation_id: '2',
      sender_id: 'user-odin',
      content: 'Hey! Saw your profile, Odin would be a great match!',
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'msg-2-2',
      conversation_id: '2',
      sender_id: 'current-user',
      content: 'Thanks! Let me check the heat tracker first.',
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'msg-2-3',
      conversation_id: '2',
      sender_id: 'user-odin',
      content: 'No problem! Just let me know when the fertile window is.',
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ],
};

// In-memory storage for demo mode
let demoMessages = { ...DEMO_MESSAGES };
let demoConversations = [...DEMO_CONVERSATIONS];

/**
 * Get all conversations for the current user
 */
export async function getConversations(userId: string): Promise<Conversation[]> {
  if (isDemoMode) {
    // Demo mode: return mock conversations
    return demoConversations;
  }

  // Real Supabase query
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      messages:messages(*, sender:profiles!sender_id(*)),
      other_user:profiles!other_user_id(id, name, avatar)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  return data || [];
}

/**
 * Get messages for a specific conversation
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  if (isDemoMode) {
    // Demo mode: return mock messages
    return demoMessages[conversationId] || [];
  }

  // Real Supabase query
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data || [];
}

/**
 * Send a message
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<Message | null> {
  if (isDemoMode) {
    // Demo mode: add to mock data
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      read: false,
      created_at: new Date().toISOString(),
    };

    if (!demoMessages[conversationId]) {
      demoMessages[conversationId] = [];
    }
    demoMessages[conversationId].push(newMessage);

    // Update conversation's last message
    const convIndex = demoConversations.findIndex((c) => c.id === conversationId);
    if (convIndex !== -1) {
      demoConversations[convIndex].last_message = newMessage;
    }

    return newMessage;
  }

  // Real Supabase insert
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      read: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    return null;
  }

  return data;
}

/**
 * Mark messages as read
 */
export async function markAsRead(conversationId: string, userId: string): Promise<void> {
  if (isDemoMode) {
    // Demo mode: mark mock messages as read
    if (demoMessages[conversationId]) {
      demoMessages[conversationId] = demoMessages[conversationId].map((msg) => ({
        ...msg,
        read: msg.sender_id !== userId ? true : msg.read,
      }));
    }

    // Update unread count in conversation
    const convIndex = demoConversations.findIndex((c) => c.id === conversationId);
    if (convIndex !== -1) {
      demoConversations[convIndex].unread_count = 0;
    }
    return;
  }

  // Real Supabase update
  await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId);
}

/**
 * Subscribe to real-time messages for a conversation
 */
export function subscribeToMessages(
  conversationId: string,
  onMessage: (message: Message) => void
) {
  if (isDemoMode) {
    // Demo mode: no real-time, just return cleanup function
    return () => {};
  }

  // Real Supabase subscription
  const channel = supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onMessage(payload.new as Message);
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    channel.unsubscribe();
  };
}

/**
 * Get unread message count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  if (isDemoMode) {
    // Demo mode: count unread from mock data
    return demoConversations.reduce((total, conv) => total + (conv.unread_count || 0), 0);
  }

  // Real Supabase query
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .neq('sender_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }

  return count || 0;
}
