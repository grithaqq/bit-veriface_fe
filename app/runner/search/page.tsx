'use client';

import { useRunnerSearchLogic } from './useRunnerSearchLogic';
import RunnerSearchUI from './RunnerSearchUI';

/**
 * ENTRY POINT
 * This component binds the logic hook and the presentational UI component.
 */
export default function RunnerSearchPage() {
    const logic = useRunnerSearchLogic();
    return <RunnerSearchUI {...logic} />;
}
