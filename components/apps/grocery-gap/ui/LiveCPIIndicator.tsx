'use client';

import { useRegionalCPI } from '@/app/actions/getRegionalCPI';
import styles from './LiveCPIIndicator.module.css';

export default function LiveCPIIndicator() {
    const { data, loading } = useRegionalCPI();

    // Use US National data
    const cpiData = data?.regions?.US;

    if (loading) return <div className={styles.loading}>Loading live data...</div>;
    if (!cpiData) return null;

    return (
        <div className={styles.container}>
            <div className={styles.badge}>
                <span className={styles.dot}></span>
                LIVE DATA
            </div>
            <div className={styles.content}>
                <p className={styles.label}>Official US CPI (All Items)</p>
                <p className={`${styles.value} ${cpiData.yearOverYear > 0 ? styles.positive : styles.negative}`}>
                    {cpiData.yearOverYear > 0 ? '+' : ''}{cpiData.yearOverYear}%
                    <span className={styles.period}> (YoY, {cpiData.period})</span>
                </p>
            </div>
            <p className={styles.source}>Source: Bureau of Labor Statistics (BLS)</p>
        </div>
    );
}
