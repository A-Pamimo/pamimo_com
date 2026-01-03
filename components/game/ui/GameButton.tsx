import React from 'react';
import { useSound } from '../../../hooks/useSound';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
    target?: never;
    rel?: never;
};

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
};

type GameButtonBaseProps = {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    color?: 'amber' | 'emerald' | 'green';
    bracketed?: boolean;
    fullWidth?: boolean;
    isActive?: boolean;
    children?: React.ReactNode;
};

type GameButtonProps = GameButtonBaseProps & (ButtonProps | AnchorProps);

const GameButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, GameButtonProps>(({
    className,
    variant = 'primary',
    color = 'amber',
    bracketed = false,
    fullWidth = false,
    isActive = false,
    children,
    ...props
}, ref) => {
    const { play } = useSound();

    // Base styles
    const baseStyles = "font-mono font-bold uppercase transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm tracking-wider inline-flex items-center justify-center";

    // Color maps (using Tailwind classes directly)
    const colorStyles: Record<string, Record<string, string>> = {
        amber: {
            primary: "bg-term-accent text-term-bg hover:bg-white hover:text-black",
            secondary: "border border-term-accent text-term-accent hover:bg-term-accent hover:text-term-bg",
            ghost: "text-term-accent hover:text-white",
            danger: "border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-black"
        },
        emerald: { // For Contact Terminal
            primary: "bg-emerald-500 text-black hover:bg-white hover:text-black",
            secondary: "border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black",
            ghost: "text-emerald-700 hover:text-emerald-400",
            danger: "text-emerald-700 hover:text-emerald-400"
        },
        green: { // For Blog Console
            primary: "bg-green-500 text-black hover:bg-green-400 hover:scale-105",
            secondary: "border border-green-500 text-green-500 hover:bg-green-500 hover:text-black",
            ghost: "text-green-700 hover:text-green-400",
            danger: "border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-black"
        }
    };

    // Resolve styles
    const selectedColor = colorStyles[color] || colorStyles.amber;
    const variantStyle = selectedColor[variant];

    const widthStyle = fullWidth ? "w-full" : "inline-block";
    const paddingStyle = variant === 'ghost' ? "p-0" : "px-4 py-2";

    const computedClassName = `${baseStyles} ${variantStyle} ${widthStyle} ${paddingStyle} ${className || ''}`;

    if (props.href) {
        return (
            <a
                ref={ref as React.Ref<HTMLAnchorElement>}
                className={computedClassName}
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
                {bracketed ? `[${children}]` : children}
            </a>
        );
    }

    return (
        <button
            ref={ref as React.Ref<HTMLButtonElement>}
            className={computedClassName}
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
            {bracketed ? `[${children}]` : children}
        </button>
    );
});

GameButton.displayName = 'GameButton';

export default GameButton;
