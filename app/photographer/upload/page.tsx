'use client';

import { useUploadLogic } from './useUploadLogic';
import UploadUI from './UploadUI';

/**
 * ENTRY POINT
 * This component binds the logic hook and the presentational UI component.
 */
export default function PhotographerUploadPage() {
    const logic = useUploadLogic();
    return <UploadUI {...logic} />;
}
