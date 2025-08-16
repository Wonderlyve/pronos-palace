
import { useState, useEffect, useCallback } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key: string;
}

interface CacheData<T> {
  data: T;
  timestamp: number;
}

export const useCache = <T,>(options: CacheOptions) => {
  const { ttl = 5 * 60 * 1000, key } = options; // Default 5 minutes TTL
  const [cachedData, setCachedData] = useState<T | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const getCachedData = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const parsedCache: CacheData<T> = JSON.parse(cached);
      const now = Date.now();

      if (now - parsedCache.timestamp > ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return parsedCache.data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }, [key, ttl]);

  const setCacheData = useCallback((data: T) => {
    try {
      const cacheData: CacheData<T> = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
      setCachedData(data);
      setIsFromCache(false);
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }, [key]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(`cache_${key}`);
    setCachedData(null);
    setIsFromCache(false);
  }, [key]);

  useEffect(() => {
    const cached = getCachedData();
    if (cached) {
      setCachedData(cached);
      setIsFromCache(true);
    }
  }, [getCachedData]);

  return {
    cachedData,
    isFromCache,
    setCacheData,
    clearCache
  };
};
