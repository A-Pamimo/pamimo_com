'use client';

import Link from 'next/link';
import styles from './BackButton.module.css';

export default function BackButton() {
    return (
        <Link href="/blog" className={styles.backButton} aria-label="Back to Blog Index">
            <span className={styles.arrow}>←</span>
            <span className={styles.label}>Back to Index</span>
        </Link>
    );
}
