import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { SearchResult, PaginationInfo, ApiResponse } from '@/app/lib/types';
import { fetchWithAuth } from '@/app/lib/fetchWithAuth';

export const SEARCH_PAGE_SIZE = 12;

export function getSearchImageUrl(imgPath: string): string {
    const match = imgPath.match(/upload_files\/([^/]+)\/(.+)$/);
    if (match) {
        return `/api/image?user_id=${encodeURIComponent(match[1])}&filename=${encodeURIComponent(match[2])}`;
    }
    return `http://${imgPath}`; // fallback jika format tidak dikenali
}

export function useSearchLogic() {
    const [isLoading, setIsLoading] = useState(false);
    const [topK, setTopK] = useState(10);
    const [allResults, setAllResults] = useState<SearchResult[]>([]);
    const [searchPage, setSearchPage] = useState(1);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<SearchResult | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Derived: slice allResults untuk halaman saat ini
    const searchResults = allResults.slice(
        (searchPage - 1) * SEARCH_PAGE_SIZE,
        searchPage * SEARCH_PAGE_SIZE
    );
    const totalSearchPages = Math.ceil(allResults.length / SEARCH_PAGE_SIZE);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;
        setUploadedImage(file);
        setUploadedFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadedImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
        maxSize: 15 * 1024 * 1024, // 15MB
        onDropRejected: (rejections) => {
            const msg = rejections[0]?.errors[0]?.code === 'file-too-large'
                ? 'File terlalu besar. Maksimum 15MB.'
                : 'Format file tidak didukung. Gunakan JPEG atau PNG.';
            setError(msg);
        },
    });

    const handleSearch = async () => {
        if (!uploadedImage) { setError('Please upload an image first'); return; }
        setIsLoading(true);
        setHasSearched(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', uploadedImage);

        try {
            const response = await fetchWithAuth(`/api/search?limit=${topK}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Search failed');
            const result: ApiResponse = await response.json();
            setAllResults(result.data || []);
            setSearchPage(1); // reset ke halaman 1 setiap search baru
            if (result.pagination) {
                setPaginationInfo(result.pagination);
            }
        } catch (err) {
            console.error('Search failed:', err);
            setError('Search failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (imageUrl: string, fileName: string) => {
        fetch(imageUrl)
            .then((r) => r.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    };

    const handleClearUpload = () => {
        setUploadedImage(null);
        setUploadedFileName(null);
        setUploadedImagePreview(null);
    };

    const handlePageChange = (p: number) => {
        setSearchPage(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
        isLoading,
        topK,
        setTopK,
        allResults,
        searchPage,
        uploadedImage,
        uploadedFileName,
        uploadedImagePreview,
        selectedImage,
        setSelectedImage,
        hasSearched,
        paginationInfo,
        error,
        searchResults,
        totalSearchPages,
        getRootProps,
        getInputProps,
        isDragActive,
        handleSearch,
        handleDownload,
        handleClearUpload,
        handlePageChange
    };
}
