'use client';

import { useRunnerGalleryLogic } from './useRunnerGalleryLogic';
import RunnerGalleryUI from './RunnerGalleryUI';

/**
 * ENTRY POINT
 * This component binds the logic hook and the presentational UI component.
 */
export default function RunnerDashboardPage() {
    const logic = useRunnerGalleryLogic();
    return <RunnerGalleryUI {...logic} />;
}
