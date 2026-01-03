'use client';

import { useEffect, useState } from 'react';
import { getInflationData, InflationData } from '@/app/actions/getInflationData';
import styles from './LiveCPIIndicator.module.css';

export default function LiveCPIIndicator() {
    const [data, setData] = useState<InflationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getInflationData().then((result) => {
            setData(result);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className={styles.loading}>Loading live data...</div>;
    if (!data) return null;

    return (
        <div className={styles.container}>
            <div className={styles.badge}>
                <span className={styles.dot}></span>
                LIVE DATA
            </div>
            <div className={styles.content}>
                <p className={styles.label}>Official Food at Home CPI</p>
                <p className={`${styles.value} ${data.yearOverYear > 0 ? styles.positive : styles.negative}`}>
                    {data.yearOverYear > 0 ? '+' : ''}{data.yearOverYear}%
                    <span className={styles.period}> (YoY, {new Date(data.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})</span>
                </p>
            </div>
            <p className={styles.source}>Source: Federal Reserve Economic Data (FRED)</p>
        </div>
    );
}
