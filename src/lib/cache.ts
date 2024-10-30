// src/lib/cache.ts

interface CacheItem<T> {
    data: T;
    timestamp: number;
  }
  
  interface CacheConfig {
    ttl: number; // Time to live in milliseconds
  }
  
  export class RecipeCache {
    private static instance: RecipeCache;
    private cache: Map<string, CacheItem<any>>;
    private config: CacheConfig;
  
    private constructor() {
      this.cache = new Map();
      this.config = {
        ttl: 1000 * 60 * 60 * 24 // 24 hours
      };
    }
  
    static getInstance(): RecipeCache {
      if (!RecipeCache.instance) {
        RecipeCache.instance = new RecipeCache();
      }
      return RecipeCache.instance;
    }
  
    set<T>(key: string, data: T): void {
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      });
  
      // Also store in localStorage for persistence
      try {
        localStorage.setItem(
          `recipe_cache_${key}`,
          JSON.stringify({
            data,
            timestamp: Date.now()
          })
        );
      } catch (error) {
        console.warn('Failed to store in localStorage:', error);
      }
    }
  
    get<T>(key: string): T | null {
      // Try memory cache first
      const memoryCache = this.cache.get(key);
      if (memoryCache && !this.isExpired(memoryCache.timestamp)) {
        return memoryCache.data;
      }
  
      // Try localStorage
      try {
        const stored = localStorage.getItem(`recipe_cache_${key}`);
        if (stored) {
          const parsed = JSON.parse(stored) as CacheItem<T>;
          if (!this.isExpired(parsed.timestamp)) {
            // Restore to memory cache
            this.cache.set(key, parsed);
            return parsed.data;
          }
        }
      } catch (error) {
        console.warn('Failed to retrieve from localStorage:', error);
      }
  
      return null;
    }
  
    private isExpired(timestamp: number): boolean {
      return Date.now() - timestamp > this.config.ttl;
    }
  
    clear(): void {
      this.cache.clear();
      // Clear localStorage cache
      Object.keys(localStorage)
        .filter(key => key.startsWith('recipe_cache_'))
        .forEach(key => localStorage.removeItem(key));
    }
  }
  
  export const recipeCache = RecipeCache.getInstance();