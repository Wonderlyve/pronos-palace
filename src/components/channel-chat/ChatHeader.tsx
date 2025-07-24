import { ArrowLeft, Users, Crown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChannelInfo {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  creator_username?: string;
  creator_badge?: string;
  subscriber_count?: number;
}

interface ChatHeaderProps {
  channelName: string;
  channelInfo: ChannelInfo | null;
  onBack: () => void;
}

const ChatHeader = ({ channelName, channelInfo, onBack }: ChatHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Button>
        
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">{channelName}</h1>
          <div className="flex items-center text-sm text-gray-500 space-x-3">
            <div className="flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              Canal VIP
            </div>
            {channelInfo && (
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {channelInfo.subscriber_count} abonnés
              </div>
            )}
          </div>
        </div>
        
        {channelInfo && (
          <div className="flex items-center space-x-2">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${channelInfo.creator_id}`}
              alt="Creator"
              className="w-10 h-10 rounded-full border-2 border-primary/20"
            />
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">{channelInfo.creator_username}</span>
                {channelInfo.creator_badge && (
                  <Crown className="w-3 h-3 text-yellow-500" />
                )}
              </div>
              <span className="text-xs text-gray-500">Créateur</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;