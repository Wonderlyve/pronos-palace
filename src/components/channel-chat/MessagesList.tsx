import { useState, useEffect, useRef } from 'react';
import { Lock, ArrowDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChannelMessage } from '@/hooks/useChannelMessages';
import { VipProno } from '@/hooks/useVipPronos';
import MessageBubble from './MessageBubble';
import VipPronoCard from './VipPronoCard';

interface MessagesListProps {
  messages: ChannelMessage[];
  pronos: VipProno[];
  loading: boolean;
  isCreator: boolean;
  creatorId?: string;
  onEditMessage?: (messageId: string, newContent: string) => Promise<boolean>;
  onDeleteMessage?: (messageId: string) => Promise<boolean>;
  onReply?: (message: ChannelMessage) => void;
  onReplyToProno?: (prono: VipProno) => void;
}

const MessagesList = ({ messages, pronos, loading, isCreator, creatorId, onEditMessage, onDeleteMessage, onReply, onReplyToProno }: MessagesListProps) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Combiner messages et pronos par ordre chronologique
  const combinedItems = [...messages, ...pronos.map(prono => ({
    ...prono,
    type: 'prono' as const,
    created_at: prono.created_at
  }))].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Auto-scroll au bas à l'ouverture et quand de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current && combinedItems.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [combinedItems.length]);

  // Détecter le scroll pour afficher/masquer le bouton
  const handleScroll = (event: any) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom && combinedItems.length > 0);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  if (combinedItems.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-12 px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun message pour le moment
          </h3>
          <p className="text-sm text-gray-500 max-w-sm">
            {isCreator 
              ? 'Écrivez le premier message pour démarrer la conversation avec vos abonnés !' 
              : 'Attendez que le créateur partage du contenu exclusif'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 relative">
      <ScrollArea 
        ref={scrollAreaRef}
        className="h-full"
        onScrollCapture={handleScroll}
      >
        <div className="px-4 py-6 space-y-6 pb-24">
          {combinedItems.map((item) => (
            'type' in item && item.type === 'prono' ? (
              <VipPronoCard
                key={`prono-${item.id}`}
                totalOdds={item.total_odds}
                imageUrl={item.image_url}
                description={item.description}
                predictionText={item.prediction_text}
                createdAt={item.created_at}
                creatorUsername={item.creator_username}
                onReply={(pronoData) => {
                  onReplyToProno?.(item);
                }}
              />
            ) : (
              <MessageBubble
                key={item.id}
                message={item as ChannelMessage}
                isCreator={('user_id' in item ? item.user_id : item.creator_id) === creatorId}
                creatorId={creatorId}
                onEdit={onEditMessage}
                onDelete={onDeleteMessage}
                onReply={onReply}
              />
            )
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Bouton scroll vers le bas */}
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="sm"
          className="fixed bottom-32 right-4 rounded-full w-12 h-12 p-0 shadow-lg z-10"
          variant="default"
        >
          <ArrowDown className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default MessagesList;