import React from 'react';

// --- Type Definitions ---

type ButtonVariant = 'default' | 'terminal' | 'blog' | 'outline' | 'ghost' | 'danger';

type ButtonBaseProps = {
    variant?: ButtonVariant;
    size?: 'sm' | 'md' | 'lg';
    bracketed?: boolean;
    fullWidth?: boolean;
    isActive?: boolean;
    children?: React.ReactNode;
    className?: string;
};

type ButtonAsButton = ButtonBaseProps &
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
        href?: undefined;
    };

type ButtonAsAnchor = ButtonBaseProps &
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
        href: string;
    };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

// --- Style Maps ---

const variantStyles: Record<ButtonVariant, string> = {
    default: 'bg-ink text-cream hover:bg-pop hover:text-white dark:bg-white dark:text-ink dark:hover:bg-pop dark:hover:text-white',
    terminal: 'bg-amber-500 text-black hover:bg-white hover:text-black border border-amber-500',
    blog: 'bg-pop text-white hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink',
    outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-cream dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-ink',
    ghost: 'bg-transparent text-ink hover:text-pop dark:text-white dark:hover:text-pop',
    danger: 'border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white'
};

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
};

import { useSound } from '../../hooks/useSound';

// ... (previous imports and types remain unchanged)

// --- Component ---

/**
 * Unified Button component for use across the application.
 * Polymorphic: renders as <button> by default, <a> when href is provided.
 * 
 * Variants:
 * - default: Standard dark/light mode button
 * - terminal: Amber terminal-style (game mode)
 * - blog: Pop color accent (blog sections)
 * - outline: Border only
 * - ghost: No background
 * - danger: Red for destructive actions
 */
const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    (
        {
            variant = 'default',
            size = 'md',
            bracketed = false,
            fullWidth = false,
            isActive = false,
            children,
            className = '',
            ...props
        },
        ref
    ) => {
        const { play } = useSound();

        // Base styles
        const baseStyles = [
            'font-mono font-bold uppercase tracking-wider',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-pop focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'inline-flex items-center justify-center',
            variantStyles[variant],
            sizeStyles[size],
            fullWidth ? 'w-full' : '',
            isActive ? 'ring-2 ring-pop' : '',
            className
        ].filter(Boolean).join(' ');

        const content = bracketed ? `[${children}]` : children;

        // Render as anchor if href is provided
        if ('href' in props && props.href) {
            return (
                <a
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    className={baseStyles}
                    {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                    onMouseEnter={(e) => {
                        play('hover');
                        (props.onMouseEnter as any)?.(e);
                    }}
                    onClick={(e) => {
                        play('click');
                        (props.onClick as any)?.(e);
                    }}
                >
                    {content}
                </a>
            );
        }

        // Default: render as button
        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                className={baseStyles}
                {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
                onMouseEnter={(e) => {
                    play('hover');
                    (props.onMouseEnter as any)?.(e);
                }}
                onClick={(e) => {
                    play('click');
                    (props.onClick as any)?.(e);
                }}
            >
                {content}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
export { Button };
export type { ButtonProps, ButtonVariant };
