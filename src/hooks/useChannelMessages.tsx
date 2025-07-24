import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ChannelMessage {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  created_at: string;
  username?: string;
  avatar_url?: string;
  media_url?: string;
  media_type?: 'image' | 'video' | 'audio' | 'file';
  media_filename?: string;
}

export const useChannelMessages = (channelId: string, creatorId: string) => {
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const isCreator = user?.id === creatorId;

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data: messagesData, error } = await supabase
        .from('channel_messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get profiles for each message separately
      const messagesWithProfile = await Promise.all(
        (messagesData || []).map(async (message) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('user_id', message.user_id)
            .single();

           return {
             ...message,
             username: profile?.username || 'Utilisateur',
             avatar_url: profile?.avatar_url,
             media_type: message.media_type as 'image' | 'video' | 'audio' | 'file' | undefined
           };
        })
      );

      setMessages(messagesWithProfile);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, mediaFiles?: File[]) => {
    if (!user || !isCreator) {
      toast.error('Seul le créateur du canal peut écrire des messages');
      return false;
    }

    if (!content.trim() && (!mediaFiles || mediaFiles.length === 0)) {
      return false;
    }

    try {
      // Handle multiple media files by sending multiple messages
      if (mediaFiles && mediaFiles.length > 0) {
        let allUploadsSuccessful = true;
        
        for (const file of mediaFiles) {
          try {
            const fileExt = file.name.split('.').pop() || 'bin';
            const fileName = `${channelId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            
            // Check if bucket exists, create if not
            const { error: uploadError } = await supabase.storage
              .from('channel-media')
              .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
              });

            if (uploadError) {
              console.error('Upload error:', uploadError);
              
              // If bucket doesn't exist, try to create it
              if (uploadError.message.includes('bucket')) {
                toast.error('Bucket de stockage non configuré. Contactez l\'administrateur.');
                allUploadsSuccessful = false;
                continue;
              }
              throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
              .from('channel-media')
              .getPublicUrl(fileName);

            const mediaType = file.type.startsWith('image/') ? 'image' : 
                             file.type.startsWith('video/') ? 'video' : 
                             file.type.startsWith('audio/') ? 'audio' : 'file';

            // Insert message with media
            const { error: insertError } = await supabase
              .from('channel_messages')
              .insert({
                channel_id: channelId,
                user_id: user.id,
                content: '', // Media-only message
                media_url: publicUrl,
                media_type: mediaType,
                media_filename: file.name
              });

            if (insertError) throw insertError;
            
          } catch (fileError) {
            console.error('Error uploading file:', file.name, fileError);
            toast.error(`Erreur lors de l'envoi de ${file.name}`);
            allUploadsSuccessful = false;
          }
        }

        // Send text message if there's content
        if (content.trim()) {
          const { error: textError } = await supabase
            .from('channel_messages')
            .insert({
              channel_id: channelId,
              user_id: user.id,
              content: content.trim(),
              media_url: null,
              media_type: null,
              media_filename: null
            });

          if (textError) {
            console.error('Error sending text message:', textError);
            toast.error('Erreur lors de l\'envoi du message texte');
            allUploadsSuccessful = false;
          }
        }

        await fetchMessages(); // Refresh messages
        return allUploadsSuccessful;
        
      } else {
        // Text-only message
        const { error } = await supabase
          .from('channel_messages')
          .insert({
            channel_id: channelId,
            user_id: user.id,
            content: content.trim(),
            media_url: null,
            media_type: null,
            media_filename: null
          });

        if (error) throw error;

        await fetchMessages(); // Refresh messages
        return true;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
      return false;
    }
  };

  useEffect(() => {
    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('channel-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'channel_messages',
          filter: `channel_id=eq.${channelId}`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId]);

  return {
    messages,
    loading,
    isCreator,
    sendMessage
  };
};