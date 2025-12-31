import Link from 'next/link';
import { IconArrow } from '../ui/Icons';

interface BlogCardProps {
    title: string;
    description: string;
    date: string;
    readTime: string;
    href: string;
    tags?: string[];
}

export default function BlogCard({ title, description, date, readTime, href, tags }: BlogCardProps) {
    return (
        <Link href={href} className="group block h-full">
            <article className="relative h-full flex flex-col justify-between p-6 border-2 border-ink/10 dark:border-white/10 bg-white/50 dark:bg-black/20 hover:border-pop dark:hover:border-pop transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--pop)]">

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs text-pop font-bold tracking-widest uppercase">
                            {tags?.[0] || 'ARTICLE'}
                        </span>
                        <span className="font-mono text-[10px] opacity-50 uppercase tracking-wide">
                            {date} • {readTime}
                        </span>
                    </div>
                    <IconArrow className="w-4 h-4 -rotate-45 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-pop transition-all duration-300" />
                </div>

                {/* Content */}
                <div>
                    <h3 className="text-xl md:text-2xl font-bold leading-tight mb-3 group-hover:text-pop transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm opacity-70 leading-relaxed line-clamp-3">
                        {description}
                    </p>
                </div>

                {/* Footer / Tags */}
                {tags && tags.length > 1 && (
                    <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-ink/5 dark:border-white/5">
                        {tags.slice(1).map((tag) => (
                            <span key={tag} className="text-[10px] font-mono px-2 py-1 bg-ink/5 dark:bg-white/5 rounded-sm opacity-60">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </article>
        </Link>
    );
}
