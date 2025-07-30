import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { DebriefingData } from '@/components/channel-chat/DebriefingModal';

export interface Debriefing {
  id: string;
  title: string;
  description: string;
  video_url: string;
  creator_id: string;
  creator_username: string;
  likes: number;
  isLiked: boolean;
  created_at: string;
  channel_id: string;
}

// Données de simulation
const mockDebriefings: Debriefing[] = [
  {
    id: '1',
    title: 'Analyse du match PSG vs Real Madrid',
    description: 'Débriefing complet de la rencontre avec analyse tactique et moments clés.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    creator_id: 'creator1',
    creator_username: 'PronoExpert',
    likes: 124,
    isLiked: false,
    created_at: '2024-01-28T10:30:00Z',
    channel_id: 'channel1'
  },
  {
    id: '2',
    title: 'Bilan de la journée de Ligue 1',
    description: 'Retour sur tous les matchs du week-end avec les surprises et performances.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    creator_id: 'creator1',
    creator_username: 'PronoExpert',
    likes: 89,
    isLiked: true,
    created_at: '2024-01-27T15:45:00Z',
    channel_id: 'channel1'
  },
  {
    id: '3',
    title: 'Prédictions Premier League',
    description: 'Mes pronos pour la prochaine journée de Premier League avec explications détaillées.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    creator_id: 'creator1',
    creator_username: 'PronoExpert',
    likes: 67,
    isLiked: false,
    created_at: '2024-01-26T09:15:00Z',
    channel_id: 'channel1'
  }
];

export const useDebriefings = (channelId: string) => {
  const { user } = useAuth();
  const [debriefings, setDebriefings] = useState<Debriefing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDebriefings = async () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter debriefings by channel (for simulation)
      const channelDebriefings = mockDebriefings.filter(d => d.channel_id === channelId);
      
      // Sort by creation date (newest first)
      const sortedDebriefings = channelDebriefings.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setDebriefings(sortedDebriefings);
      setLoading(false);
    }, 500);
  };

  const createDebriefing = async (debriefingData: DebriefingData & { channelId: string }) => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer un débriefing');
      return false;
    }

    try {
      // Simulate video upload and processing
      let videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      
      if (debriefingData.video) {
        // In a real app, this would upload the video to storage
        videoUrl = URL.createObjectURL(debriefingData.video);
      }

      const newDebriefing: Debriefing = {
        id: Date.now().toString(),
        title: debriefingData.title,
        description: debriefingData.description,
        video_url: videoUrl,
        creator_id: user.id,
        creator_username: 'Vous', // In real app, get from profile
        likes: 0,
        isLiked: false,
        created_at: new Date().toISOString(),
        channel_id: debriefingData.channelId
      };

      // Add to the beginning of the list (newest first)
      setDebriefings(prev => [newDebriefing, ...prev]);
      
      toast.success('Débriefing créé avec succès !');
      return true;
    } catch (error) {
      console.error('Error creating debriefing:', error);
      toast.error('Erreur lors de la création du débriefing');
      return false;
    }
  };

  const likeDebriefing = async (debriefingId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour liker');
      return false;
    }

    try {
      setDebriefings(prev => prev.map(debriefing => {
        if (debriefing.id === debriefingId) {
          return {
            ...debriefing,
            isLiked: !debriefing.isLiked,
            likes: debriefing.isLiked ? debriefing.likes - 1 : debriefing.likes + 1
          };
        }
        return debriefing;
      }));
      
      return true;
    } catch (error) {
      console.error('Error liking debriefing:', error);
      toast.error('Erreur lors du like');
      return false;
    }
  };

  const deleteDebriefing = async (debriefingId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour supprimer');
      return false;
    }

    try {
      setDebriefings(prev => prev.filter(d => d.id !== debriefingId));
      return true;
    } catch (error) {
      console.error('Error deleting debriefing:', error);
      toast.error('Erreur lors de la suppression');
      return false;
    }
  };

  useEffect(() => {
    fetchDebriefings();
  }, [channelId]);

  return {
    debriefings,
    loading,
    createDebriefing,
    likeDebriefing,
    deleteDebriefing,
    refetch: fetchDebriefings
  };
};