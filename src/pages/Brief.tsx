import { useState } from 'react';
import { Play, Plus, Eye, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BottomNavigation from '@/components/BottomNavigation';
import DebriefingModal from '@/components/channel-chat/DebriefingModal';
import { useDebriefings } from '@/hooks/useDebriefings';

const Brief = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { debriefings, createDebriefing } = useDebriefings('general');
  
  // Mock data supplémentaires pour la demo
  const mockBriefs = [
    {
      id: '1',
      title: 'Analyse du match PSG vs Real Madrid',
      description: 'Débriefing complet de la rencontre avec analyse tactique.',
      creator_username: 'PronoExpert',
      creator_avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face',
      likes: 124,
      views: 2340,
      thumbnail: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=225&fit=crop',
      created_at: '2024-01-28T10:30:00Z',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      id: '2',
      title: 'Bilan de la journée de Ligue 1',
      description: 'Retour sur tous les matchs du week-end avec les surprises.',
      creator_username: 'FootballAnalyst',
      creator_avatar: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=100&fit=crop&crop=face',
      likes: 89,
      views: 1567,
      thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=225&fit=crop',
      created_at: '2024-01-27T15:45:00Z',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
      id: '3',
      title: 'Prédictions Premier League',
      description: 'Mes pronos pour la prochaine journée avec explications.',
      creator_username: 'BetMaster',
      creator_avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop&crop=face',
      likes: 67,
      views: 983,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop',
      created_at: '2024-01-26T09:15:00Z',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    {
      id: '4',
      title: 'Stratégies de trading sportif',
      description: 'Comment optimiser ses gains avec le trading sportif.',
      creator_username: 'TradeExpert',
      creator_avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face',
      likes: 156,
      views: 2890,
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
      created_at: '2024-01-25T14:20:00Z',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
  ];

  const openBrief = (briefId: string) => {
    navigate(`/brief/${briefId}`);
  };

  const handleCreateBrief = async (briefData: any) => {
    const success = await createDebriefing({
      ...briefData,
      channelId: 'general'
    });
    
    if (success) {
      setShowCreateModal(false);
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Brief</h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{mockBriefs.length} vidéos</span>
          </div>
        </div>
      </div>

      {/* Briefs Grid */}
      <div className="p-4">
        <div className="space-y-4">
          {mockBriefs.map((brief) => (
            <Card key={brief.id} className="overflow-hidden border-0 shadow-sm">
              <div 
                className="cursor-pointer"
                onClick={() => openBrief(brief.id)}
              >
                {/* Thumbnail en format paysage */}
                <div className="relative aspect-video bg-gray-200">
                  <img
                    src={brief.thumbnail}
                    alt={brief.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  {/* Stats overlay */}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{formatViews(brief.views)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{brief.likes}</span>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <img
                      src={brief.creator_avatar}
                      alt={brief.creator_username}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                        {brief.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{brief.creator_username}</span>
                        <span>•</span>
                        <span>{formatViews(brief.views)} vues</span>
                        <span>•</span>
                        <span>{new Date(brief.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>


      {/* Create Brief Modal */}
      <DebriefingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBrief}
      />

      <BottomNavigation />
    </div>
  );
};

export default Brief;