"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './RegionToggle.module.css';
import { useRegion } from '../context/RegionContext';

export default function RegionToggle() {
    const { region } = useRegion();
    const isCanada = region.code === 'CA';

    // Toggle region query param
    const targetQuery = isCanada ? '?region=US' : '?region=CA';
    const targetLabel = isCanada ? '🇺🇸 Switch to US' : '🇨🇦 Switch to Canada';

    return (
        <Link
            href={targetQuery}
            className={styles.toggle}
            aria-label={targetLabel}
            replace
            scroll={false}
        >
            <span className={styles.flag}>{region.flag}</span>
            <span className={styles.label}>{region.code}</span>
            <span className={styles.arrow}>⇄</span>
        </Link>
    );
}
