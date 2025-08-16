import { ArrowLeft, Users, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ChannelInfo {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  is_private: boolean;
  price: number;
  currency: string;
  creator_username?: string;
  creator_badge?: string;
  subscriber_count?: number;
}

interface ChatHeaderProps {
  channelName: string;
  channelInfo: ChannelInfo;
  onBack: () => void;
  onCreateVipProno: () => void;
  onCreateDebriefing: () => void;
  onDeleteChannel: () => void;
  className?: string;
}

const ChatHeader = ({ 
  channelName, 
  channelInfo, 
  onBack, 
  onCreateVipProno, 
  onCreateDebriefing, 
  onDeleteChannel,
  className 
}: ChatHeaderProps) => {
  return (
    <div className={`bg-card border-b flex items-center justify-between p-3 ${className}`}>
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">{channelName}</h1>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{channelInfo?.subscriber_count || 0} membres</span>
            {channelInfo?.creator_badge && (
              <Badge variant="secondary">{channelInfo.creator_badge}</Badge>
            )}
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <Settings className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onCreateVipProno}>
            Créer un VIP prono
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCreateDebriefing}>
            Créer un débriefing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDeleteChannel} className="text-red-500">
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer le canal
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHeader;
