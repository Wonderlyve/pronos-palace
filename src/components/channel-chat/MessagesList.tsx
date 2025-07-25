import { Lock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChannelMessage } from '@/hooks/useChannelMessages';
import MessageBubble from './MessageBubble';

interface MessagesListProps {
  messages: ChannelMessage[];
  loading: boolean;
  isCreator: boolean;
  creatorId?: string;
  onEditMessage?: (messageId: string, newContent: string) => Promise<boolean>;
  onDeleteMessage?: (messageId: string) => Promise<boolean>;
}

const MessagesList = ({ messages, loading, isCreator, creatorId, onEditMessage, onDeleteMessage }: MessagesListProps) => {
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

  if (messages.length === 0) {
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
    <div className="flex-1 bg-gray-50">
      <ScrollArea className="h-full">
        <div className="px-4 py-6 space-y-6">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCreator={message.user_id === creatorId}
              creatorId={creatorId}
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessagesList;