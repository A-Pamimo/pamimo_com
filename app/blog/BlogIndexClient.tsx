'use client';

import React from 'react';
import Navbar from '../../components/layout/Navbar';
import BlogCard from '../../components/blog/BlogCard';

interface BlogPost {
    id: string;
    title: string;
    description: string;
    date: string;
    readTime: string;
    href: string;
    tags: string[];
}

interface BlogIndexClientProps {
    posts: BlogPost[];
}

export default function BlogIndexClient({ posts }: BlogIndexClientProps) {
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

                {/* Blog Grid or Coming Soon */}
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
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
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="font-mono text-xs tracking-widest uppercase opacity-40 mb-6">[ COMING SOON ]</p>
                        <p className="text-lg opacity-50 mb-2">種一棵樹最好的時間是二十年前，其次是現在。</p>
                        <blockquote className="max-w-xl text-2xl md:text-3xl font-serif italic opacity-70 leading-relaxed">
                            &ldquo;The best time to plant a tree was 20 years ago. The second best time is now.&rdquo;
                        </blockquote>
                        <p className="mt-4 font-mono text-xs opacity-40">— Chinese Proverb</p>
                    </div>
                )}
            </main>

            {/* Footer Decor */}
            <div className="fixed bottom-6 right-6 text-[10px] font-mono opacity-20 pointer-events-none">
                SYS.LOG.READ_WRITE
            </div>
        </div>
    );
}
