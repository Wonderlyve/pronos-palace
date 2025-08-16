
import { useState, useEffect } from 'react';
import { useCache } from './useCache';
import { usePosts } from './usePosts';

export const useCachedPosts = () => {
  const { posts, loading, fetchPosts, ...otherMethods } = usePosts();
  const { cachedData, isFromCache, setCacheData } = useCache<any[]>({
    key: 'posts_list',
    ttl: 5 * 60 * 1000 // 5 minutes cache
  });
  const [finalPosts, setFinalPosts] = useState<any[]>([]);
  const [finalLoading, setFinalLoading] = useState(true);

  useEffect(() => {
    // Si on a des données en cache, les utiliser immédiatement
    if (cachedData && cachedData.length > 0) {
      setFinalPosts(cachedData);
      setFinalLoading(false);
    }
  }, [cachedData]);

  useEffect(() => {
    // Quand les posts sont chargés, les mettre en cache
    if (posts.length > 0 && !loading) {
      setCacheData(posts);
      setFinalPosts(posts);
      setFinalLoading(false);
    }
  }, [posts, loading, setCacheData]);

  useEffect(() => {
    // Si pas de cache, on affiche le loading des posts originaux
    if (!cachedData || cachedData.length === 0) {
      setFinalLoading(loading);
    }
  }, [loading, cachedData]);

  return {
    posts: finalPosts,
    loading: finalLoading,
    isFromCache,
    fetchPosts,
    ...otherMethods
  };
};
