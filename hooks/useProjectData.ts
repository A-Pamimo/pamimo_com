import { useMemo } from 'react';
import { PROJECT_DATA } from '../constants';
import { Project } from '../types';

export const useProjectData = () => {
    // Logic: NOVA -> WEG -> Chronological (Newest First)
    const sortedProjects = useMemo(() => {
        return Object.values(PROJECT_DATA).sort((a, b) => {
            // 1. Force NOVA first (Product Innovation)
            if (a.id === 'nova') return -1;
            if (b.id === 'nova') return 1;

            // 2. Force HarvestLink Second (Recent Win)
            if (a.id === 'harvest_link') return -1;
            if (b.id === 'harvest_link') return 1;

            // 3. Force WEG Third (Founder Role)
            if (a.id === 'weg') return -1;
            if (b.id === 'weg') return 1;

            // 4. Chronological (Newest to Oldest)
            return b.year - a.year;
        });
    }, []);

    return { projects: sortedProjects };
};
