import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface VipPronoReaction {
  id: string;
  prono_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export const useVipPronoReactions = (pronoId: string) => {
  const [reactions, setReactions] = useState<VipPronoReaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchReactions = async () => {
    try {
      const { data, error } = await supabase
        .from('vip_prono_reactions')
        .select('*')
        .eq('prono_id', pronoId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReactions(data || []);
    } catch (error) {
      console.error('Error fetching VIP prono reactions:', error);
    }
  };

  const addReaction = async (emoji: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour réagir');
      return false;
    }

    try {
      const { error } = await supabase
        .from('vip_prono_reactions')
        .insert({
          prono_id: pronoId,
          user_id: user.id,
          emoji
        });

      if (error) throw error;
      await fetchReactions();
      return true;
    } catch (error) {
      console.error('Error adding VIP prono reaction:', error);
      toast.error('Erreur lors de l\'ajout de la réaction');
      return false;
    }
  };

  const removeReaction = async (emoji: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('vip_prono_reactions')
        .delete()
        .eq('prono_id', pronoId)
        .eq('user_id', user.id)
        .eq('emoji', emoji);

      if (error) throw error;
      await fetchReactions();
      return true;
    } catch (error) {
      console.error('Error removing VIP prono reaction:', error);
      toast.error('Erreur lors de la suppression de la réaction');
      return false;
    }
  };

  const toggleReaction = async (emoji: string) => {
    if (!user) return;

    const existingReaction = reactions.find(
      r => r.user_id === user.id && r.emoji === emoji
    );

    if (existingReaction) {
      await removeReaction(emoji);
    } else {
      await addReaction(emoji);
    }
  };

  useEffect(() => {
    fetchReactions();

    // Set up real-time subscription
    const channel = supabase
      .channel('vip-prono-reactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vip_prono_reactions',
          filter: `prono_id=eq.${pronoId}`
        },
        () => {
          fetchReactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pronoId]);

  // Group reactions by emoji with counts
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = {
        emoji: reaction.emoji,
        count: 0,
        users: [],
        hasUserReacted: false
      };
    }
    acc[reaction.emoji].count++;
    acc[reaction.emoji].users.push(reaction.user_id);
    if (user && reaction.user_id === user.id) {
      acc[reaction.emoji].hasUserReacted = true;
    }
    return acc;
  }, {} as Record<string, { emoji: string; count: number; users: string[]; hasUserReacted: boolean }>);

  return {
    reactions,
    groupedReactions,
    loading,
    addReaction,
    removeReaction,
    toggleReaction
  };
};