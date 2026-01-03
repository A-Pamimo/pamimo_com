import React from 'react';
import { getSortedPostsData } from '../../lib/blog';
import BlogIndexClient from './BlogIndexClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Blog | Pamimo Akinjide',
    description: 'Writing on AI, Economics, and Product Strategy.',
    openGraph: {
        title: 'The Blog | Pamimo Akinjide',
        description: 'Writing on AI, Economics, and Product Strategy.',
    }
};

// Server Component - fetches MDX data at build time
export default function BlogIndex() {
    const posts = getSortedPostsData();

    // Transform posts for the client component
    const blogPosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        description: post.excerpt || '',
        date: post.date,
        readTime: post.readTime || '5 MIN READ',
        // Special handling for interactive posts
        href: post.isInteractive && post.href ? post.href : `/blog/${post.id}`,
        tags: post.tags || []
    }));

    // Add the Grocery Gap interactive post if not in MDX
    const hasGroceryGap = blogPosts.some(p => p.id === 'grocery-gap' || p.id === 'the-grocery-gap');
    if (!hasGroceryGap) {
        blogPosts.unshift({
            id: 'grocery-gap',
            title: 'The Grocery Gap',
            description: 'An interactive exploration of why inflation feels higher than the official numbers say.',
            date: '2025-01-05',
            readTime: '8 MIN READ',
            href: '/blog/the-grocery-gap',
            tags: ['DATA VIZ', 'ECONOMICS', 'INTERACTIVE']
        });
    }

    return <BlogIndexClient posts={blogPosts} />;
}

