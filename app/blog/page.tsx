'use client';

import React from 'react';
import Navbar from '../../components/layout/Navbar';
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
        <div className="min-h-screen bg-cream dark:bg-charcoal text-theme-text font-mono selection:bg-pop selection:text-white transition-colors duration-500">
            <Navbar />

            {/* Spacer for fixed navbar */}
            <div className="h-28" />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 relative text-theme-text">
                        WRITING
                        <span className="text-pop text-2xl absolute -top-4 -right-8 animate-pulse">●</span>
                    </h1>
                    <p className="text-lg md:text-xl font-serif italic opacity-60 max-w-2xl leading-relaxed text-theme-text">
                        Thoughts on economics, algorithms, and the future of work.
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
                </div>
            </main>

            {/* Footer Decor */}
            <div className="fixed bottom-6 right-6 text-[10px] font-mono opacity-20 pointer-events-none">
                SYS.LOG.READ_WRITE
            </div>
        </div>
    );
}
