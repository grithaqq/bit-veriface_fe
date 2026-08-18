import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GalleryItem, GalleryResponse, PaginationInfo } from '@/app/lib/types';
import { fetchWithAuth } from '@/app/lib/fetchWithAuth';

export const PAGE_SIZE = 15;

export function getImageUrl(userId: string, savedFilename: string) {
    return `/api/image?user_id=${encodeURIComponent(userId)}&filename=${encodeURIComponent(savedFilename)}`;
}

export function getThumbnailUrl(userId: string, thumbnailFilename: string) {
    return `/api/image?user_id=${encodeURIComponent(userId)}&filename=${encodeURIComponent('thumbnails/' + thumbnailFilename)}`;
}

export function useGalleryLogic() {
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    const fetchMyFiles = useCallback(async (page: number) => {
        setIsLoading(true);
        setError(null);
        const skip = (page - 1) * PAGE_SIZE;
        try {
            const response = await fetchWithAuth(
                `/api/files?skip=${skip}&limit=${PAGE_SIZE}`,
                { method: 'GET' }
            );
            if (!response.ok) throw new Error('Gagal memuat galeri');
            const data: GalleryResponse = await response.json();
            setImages(data.data ?? []);
            setPagination(data.pagination ?? null);
        } catch (err) {
            console.error('Gallery fetch failed:', err);
            setError('Gagal memuat galeri. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            router.push('/login');
            return;
        }
        fetchMyFiles(currentPage);
    }, [router, currentPage, fetchMyFiles]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDownload = (img: GalleryItem) => {
        const url = getImageUrl(img.user_id, img.saved_filename);
        fetch(url)
            .then((r) => r.blob())
            .then((blob) => {
                const objectUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = objectUrl;
                link.download = img.original_filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(objectUrl);
            });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus foto ini?')) return;
        
        setIsLoading(true);
        try {
            const response = await fetchWithAuth(`/api/files?id=${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Gagal menghapus foto');
            
            // Refresh gallery after successful deletion
            setSelectedImage(null);
            fetchMyFiles(currentPage);
        } catch (err) {
            console.error('Delete failed:', err);
            setError('Gagal menghapus foto. Silakan coba lagi.');
            setIsLoading(false);
        }
    };

    return {
        images,
        isLoading,
        error,
        selectedImage,
        setSelectedImage,
        pagination,
        currentPage,
        handlePageChange,
        handleDownload,
        handleDelete,
        router,
    };
}
