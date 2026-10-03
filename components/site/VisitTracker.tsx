'use client';

import { useEffect } from 'react';
import { countVisit, markIntroSeen } from '../../lib/visit';

/** Records the visit and that the PA intro has played, for the next page load */
const VisitTracker = () => {
    useEffect(() => {
        countVisit();
        markIntroSeen();
    }, []);
    return null;
};

export default VisitTracker;
