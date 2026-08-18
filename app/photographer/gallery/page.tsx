'use client';

import { useGalleryLogic } from './useGalleryLogic';
import GalleryUI from './GalleryUI';

/**
 * ENTRY POINT
 * This component binds the logic hook and the presentational UI component.
 */
export default function PhotographerGalleryPage() {
    const logic = useGalleryLogic();
    return <GalleryUI {...logic} />;
}
