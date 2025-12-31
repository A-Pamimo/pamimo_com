'use client';

import React from 'react';
import Link from 'next/link';
import { IconArrow } from '../../components/ui/Icons';
import BlogCard from '../../components/blog/BlogCard';

// Blog Data (To be moved to a CMS or MDX later)
const BLOG_POSTS = [
    {
        id: 'grocery-gap',
        title: 'The Grocery Gap',
        description: 'An interactive exploration of why inflation feels higher than the official numbers say.',
        date: '2025-01-05',
        readTime: '8 MIN READ',
        href: '/blog/the-grocery-gap',
        tags: ['DATA VIZ', 'ECONOMICS', 'INTERACTIVE']
    }
];

export default function BlogIndex() {
    return (
        <div className="min-h-screen bg-cream dark:bg-charcoal text-ink dark:text-cream font-mono selection:bg-pop selection:text-white transition-colors duration-500">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-cream/80 dark:bg-charcoal/80 backdrop-blur-md border-b border-ink/10 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xs font-bold tracking-widest opacity-60 hover:opacity-100 hover:text-pop transition-all group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">
                            <IconArrow className="w-4 h-4 rotate-180" />
                        </span>
                        BACK TO INDEX
                    </Link>
                    <div className="text-xs font-bold tracking-widest opacity-30 hidden md:block">
                        ARCHIVE // {new Date().getFullYear()}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 relative">
                        WRITING
                        <span className="text-pop text-2xl absolute -top-4 -right-8 animate-pulse">●</span>
                    </h1>
                    <p className="text-lg md:text-xl font-serif italic opacity-60 max-w-2xl leading-relaxed">
                        Thoughts on technology, design, and the systems that shape our world.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                        <BlogCard
                            key={post.id}
                            title={post.title}
                            description={post.description}
                            date={post.date}
                            readTime={post.readTime}
                            href={post.href}
                            tags={post.tags}
                        />
                    ))}

                    {/* Placeholder for future posts */}
                    <div className="min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-ink/10 dark:border-white/10 rounded-lg opacity-30 hover:opacity-50 transition-opacity">
                        <span className="font-mono text-xs uppercase tracking-widest">More Coming Soon</span>
                    </div>
                </div>
            </main>

            {/* Footer Decor */}
            <div className="fixed bottom-6 right-6 text-[10px] font-mono opacity-20 pointer-events-none">
                SYS.LOG.READ_WRITE
            </div>
        </div>
    );
}
