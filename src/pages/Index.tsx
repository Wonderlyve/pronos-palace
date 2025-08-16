import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Post } from '@/components/Post';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, Home, Search, User, Crown } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import VipPronoModal from '@/components/VipPronoModal';
import DebriefingModal from '@/components/channel-chat/DebriefingModal';
import { useDebriefings } from '@/hooks/useDebriefings';
import { usePosts } from '@/hooks/usePosts';
import PostSkeleton from '@/optimization/PostSkeleton';
import StatusSkeleton from '@/components/StatusSkeleton';
import { useCachedPosts } from '@/hooks/useCachedPosts';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, loading, isFromCache } = useCachedPosts();
  
  const [showVipPronoModal, setShowVipPronoModal] = useState(false);
  const [showDebriefingModal, setShowDebriefingModal] = useState(false);
  const { createDebriefing } = useDebriefings('general');
  const { createPost } = usePosts();

  const handleCreateVipProno = () => {
    setShowVipPronoModal(true);
  };

  const handleCreateDebriefing = async (debriefingData: any) => {
    const success = await createDebriefing({ ...debriefingData, channelId: 'general' });
    if (success) {
      setShowDebriefingModal(false);
    }
  };

  const handleCreatePost = async (postData: any) => {
    await createPost(postData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Fil d'actualité</h1>
            {user && (
              <Button onClick={handleCreateVipProno}>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau pronostic
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-secondary border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 flex space-x-4 overflow-x-auto">
          <Button variant="ghost" className="rounded-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Tendances
          </Button>
          <Button variant="ghost" className="rounded-full">
            <Crown className="w-4 h-4 mr-2" />
            VIP
          </Button>
          <Button variant="ghost" className="rounded-full">
            <Home className="w-4 h-4 mr-2" />
            Pour vous
          </Button>
        </div>
      </div>

      <div className="pb-20">
        {loading && !isFromCache ? (
          <div className="p-4">
            <StatusSkeleton />
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* VIP Prono Modal */}
      <VipPronoModal
        isOpen={showVipPronoModal}
        onClose={() => setShowVipPronoModal(false)}
        onCreate={handleCreatePost}
      />

      {/* Debriefing Modal */}
      <DebriefingModal
        isOpen={showDebriefingModal}
        onClose={() => setShowDebriefingModal(false)}
        onCreate={handleCreateDebriefing}
      />

      <BottomNavigation />
    </div>
  );
};

export default Index;
