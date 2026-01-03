import { useLocalStorage } from './useLocalStorage';
import { useCallback } from 'react';

/**
 * Hook to track which blog posts have been read by the user.
 * Uses localStorage to persist across sessions.
 * 
 * @returns Object with readPosts array, markAsRead function, hasRead function, and clearAll function
 */
export function useReadingProgress() {
    const [readPosts, setReadPosts] = useLocalStorage<string[]>('read_posts', []);

    const markAsRead = useCallback((postId: string) => {
        setReadPosts((prev) => {
            if (prev.includes(postId)) return prev;
            return [...prev, postId];
        });
    }, [setReadPosts]);

    const hasRead = useCallback((postId: string) => {
        return readPosts.includes(postId);
    }, [readPosts]);

    const clearAll = useCallback(() => {
        setReadPosts([]);
    }, [setReadPosts]);

    return {
        readPosts,
        markAsRead,
        hasRead,
        clearAll
    };
}
