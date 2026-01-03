"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './RegionToggle.module.css';
import { useRegion } from '../context/RegionContext';

interface RegionToggleProps {
    className?: string;
}

export default function RegionToggle({ className = '' }: RegionToggleProps) {
    const { region } = useRegion();
    const isCanada = region.code === 'CA';

    // Toggle region query param
    const targetQuery = isCanada ? '?region=US' : '?region=CA';
    const targetLabel = isCanada ? '🇺🇸 Switch to US' : '🇨🇦 Switch to Canada';

    return (
        <Link
            href={targetQuery}
            className={`${styles.toggle} ${className}`}
            aria-label={targetLabel}
            replace
            scroll={false}
        >
            <span className={`${styles.option} ${!isCanada ? styles.active : ''}`}>🇺🇸 US</span>
            <span className={styles.divider}>|</span>
            <span className={`${styles.option} ${isCanada ? styles.active : ''}`}>🇨🇦 CA</span>
        </Link>
    );
}
