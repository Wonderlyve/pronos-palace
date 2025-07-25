import { Crown } from 'lucide-react';
import { ChannelMessage } from '@/hooks/useChannelMessages';
import { useMessageReactions } from '@/hooks/useMessageReactions';
import { EmojiPicker } from './EmojiPicker';
import { ReactionDisplay } from './ReactionDisplay';
import { useState, useRef, useEffect } from 'react';

interface MessageBubbleProps {
  message: ChannelMessage;
  isCreator: boolean;
  creatorId?: string;
}

const MessageBubble = ({ message, isCreator, creatorId }: MessageBubbleProps) => {
  const isFromCreator = message.user_id === creatorId;
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  
  const { groupedReactions, toggleReaction } = useMessageReactions(message.id);
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLongPressStart = () => {
    const timer = setTimeout(() => {
      setIsEmojiPickerOpen(true);
    }, 500); // 500ms pour l'appui long
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    toggleReaction(emoji);
  };

  const handleReactionClick = (emoji: string) => {
    toggleReaction(emoji);
  };

  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  return (
    <div className="flex items-start justify-start">
      <div className="max-w-[75%] text-left">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-sm text-gray-700">
            {message.username}
          </span>
          {isFromCreator && (
            <Crown className="w-3 h-3 text-yellow-500" />
          )}
          <span className="text-xs text-gray-500">
            {formatTime(message.created_at)}
          </span>
        </div>
        
        <EmojiPicker
          isOpen={isEmojiPickerOpen}
          onClose={() => setIsEmojiPickerOpen(false)}
          onEmojiSelect={handleEmojiSelect}
          trigger={
            <div 
              ref={messageRef}
              className="rounded-2xl px-4 py-2 bg-white border border-gray-200 text-gray-900 shadow-sm cursor-pointer select-none"
              onMouseDown={handleLongPressStart}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={handleLongPressStart}
              onTouchEnd={handleLongPressEnd}
            >
              {message.content && (
                <div className="break-words text-sm leading-relaxed">
                  {message.content}
                </div>
              )}
              
              {/* Media content */}
              {message.media_url && (
                <div className={message.content ? "mt-2" : ""}>
                  {message.media_type === 'image' && (
                    <img 
                      src={message.media_url} 
                      alt={message.media_filename || 'Image'} 
                      className="max-w-full h-auto rounded-lg"
                    />
                  )}
                  {message.media_type === 'video' && (
                    <video 
                      src={message.media_url} 
                      controls 
                      className="max-w-full h-auto rounded-lg"
                      preload="metadata"
                    />
                  )}
                  {message.media_type === 'audio' && (
                    <audio 
                      src={message.media_url} 
                      controls 
                      className="w-full"
                      preload="metadata"
                    />
                  )}
                  {message.media_type === 'file' && (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {message.media_filename || 'Fichier'}
                        </p>
                        <a 
                          href={message.media_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Télécharger
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          }
        />
        
        <ReactionDisplay 
          groupedReactions={groupedReactions}
          onReactionClick={handleReactionClick}
        />
      </div>
    </div>
  );
};

export default MessageBubble;