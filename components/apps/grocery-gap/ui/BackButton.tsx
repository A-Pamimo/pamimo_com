'use client';

import Link from 'next/link';
import styles from './BackButton.module.css';

export default function BackButton() {
    return (
        <Link href="/" className={styles.backButton} aria-label="Back to Portfolio">
            <span className={styles.arrow}>←</span>
            <span className={styles.label}>Back to Musings</span>
        </Link>
    );
}
