import styles from './Hero.module.css';
import { useRegion } from '../context/RegionContext';
import RegionToggle from '../ui/RegionToggle';

export default function Hero() {
    const { region } = useRegion();
    const isCanada = region.code === 'CA';

    return (
        <section className={styles.hero}>
            <RegionToggle />
            <div className={styles.heroContent}>
                <div className={styles.tagline}>[BEHAVIORAL_ECONOMICS]</div>

                <h1 className={styles.title}>
                    The Grocery Gap
                    <span className={styles.titleAccent}>The Cost You Feel</span>
                </h1>

                <div className={styles.subtitle}>
                    <p>The government says inflation is {isCanada ? '2.9%' : '3.4%'}.</p>
                    <p>You feel like it is 15%.</p>
                    <p><strong>Both can be true.</strong></p>
                </div>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>2.5x</span>
                        <span className={styles.statLabel}>Mental multiplier</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>{isCanada ? '3-5%' : '3.9%'}</span>
                        <span className={styles.statLabel}>Shrinkflation Gap</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>{isCanada ? '145%' : '57.8%'}</span>
                        <span className={styles.statLabel}>{isCanada ? 'BC Housing Premium' : 'Housing Premium'}</span>
                    </div>
                </div>
            </div>

            <div className={styles.scrollPrompt}>
                <div className={styles.scrollIcon}></div>
                <span>Scroll_Down</span>
            </div>
        </section>
    );
}
