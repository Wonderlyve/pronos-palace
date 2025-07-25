
import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useChannelMessages } from '@/hooks/useChannelMessages';
import { supabase } from '@/integrations/supabase/client';
import ChatHeader from './channel-chat/ChatHeader';
import MessagesList from './channel-chat/MessagesList';
import MediaInput from './channel-chat/MediaInput';

interface ChannelInfo {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  creator_username?: string;
  creator_badge?: string;
  subscriber_count?: number;
}

interface ChannelChatProps {
  channelId: string;
  channelName: string;
  onBack: () => void;
}

const ChannelChat = ({ channelId, channelName, onBack }: ChannelChatProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);

  // Fetch channel info first, then use it to initialize the messages hook
  useEffect(() => {
    const fetchChannelInfo = async () => {
      try {
        const { data: channelData, error: channelError } = await supabase
          .from('channels')
          .select('*')
          .eq('id', channelId)
          .single();

        if (channelError) throw channelError;

        // Get creator profile separately
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, badge')
          .eq('user_id', channelData.creator_id)
          .single();

        const { count } = await supabase
          .from('channel_subscriptions')
          .select('*', { count: 'exact' })
          .eq('channel_id', channelId);

        setChannelInfo({
          ...channelData,
          creator_username: profileData?.username || 'Utilisateur',
          creator_badge: profileData?.badge,
          subscriber_count: count || 0
        });
      } catch (error) {
        console.error('Error fetching channel info:', error);
      }
    };

    fetchChannelInfo();
  }, [channelId]);

  const { 
    messages, 
    loading, 
    isCreator, 
    isSubscribed,
    sendMessage: sendChannelMessage,
    editMessage,
    deleteMessage
  } = useChannelMessages(
    channelId, 
    channelInfo?.creator_id || ''
  );

  const handleSendMessage = async (mediaFiles?: File[]) => {
    if (!newMessage.trim() && (!mediaFiles || mediaFiles.length === 0)) return;
    
    const success = await sendChannelMessage(newMessage, mediaFiles);
    if (success) {
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ChatHeader 
        channelName={channelName}
        channelInfo={channelInfo}
        onBack={onBack}
      />
      
      <MessagesList
        messages={messages}
        loading={loading}
        isCreator={isCreator}
        creatorId={channelInfo?.creator_id}
        onEditMessage={editMessage}
        onDeleteMessage={deleteMessage}
      />
      
      {(isCreator || isSubscribed) ? (
        <MediaInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="text-center py-2">
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Vous devez être abonné pour écrire dans ce canal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelChat;
