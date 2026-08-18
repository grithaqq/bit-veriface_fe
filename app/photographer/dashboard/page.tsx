'use client';

import { useSearchLogic } from './useSearchLogic';
import SearchUI from './SearchUI';

/**
 * ENTRY POINT
 * This component binds the logic hook and the presentational UI component.
 */
export default function PhotographerDashboardPage() {
    const logic = useSearchLogic();
    return <SearchUI {...logic} />;
}
