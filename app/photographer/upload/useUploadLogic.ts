import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/app/lib/fetchWithAuth';

export interface UploadItem {
    id: string;
    file: File;
    preview: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    errorMessage?: string;
}

export function useUploadLogic() {
    const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) router.push('/login');
    }, [router]);

    // Clean up object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            uploadItems.forEach(item => URL.revokeObjectURL(item.preview));
        };
    }, [uploadItems]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newItems = acceptedFiles.map((file) => ({
            id: Math.random().toString(36).substring(7),
            file,
            preview: URL.createObjectURL(file),
            status: 'pending' as const,
        }));

        setUploadItems((prev) => [...prev, ...newItems]);
        setUploadSuccess(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
        maxSize: 15 * 1024 * 1024, // 15MB
    });

    const handleUpload = async () => {
        const pendingItems = uploadItems.filter((item) => item.status === 'pending' || item.status === 'error');
        if (pendingItems.length === 0) return;

        setIsUploading(true);
        setUploadSuccess(null);

        let successCount = 0;

        for (const item of pendingItems) {
            setUploadItems((prev) =>
                prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading' } : i))
            );

            const formData = new FormData();
            formData.append('file', item.file);

            try {
                const response = await fetchWithAuth('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Upload gagal');

                setUploadItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, status: 'success' } : i))
                );
                successCount++;
            } catch (error: any) {
                console.error('Upload failed for', item.file.name, error);
                setUploadItems((prev) =>
                    prev.map((i) =>
                        i.id === item.id ? { ...i, status: 'error', errorMessage: error.message || 'Upload gagal' } : i
                    )
                );
            }
        }

        setIsUploading(false);
        if (successCount > 0) {
            setUploadSuccess(`${successCount} gambar berhasil diupload!`);
            setTimeout(() => {
                setUploadItems((prev) => prev.filter(item => item.status !== 'success'));
            }, 3000);
        }
    };

    const handleRemoveItem = (id: string) => {
        setUploadItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleClearAll = () => {
        setUploadItems([]);
        setUploadSuccess(null);
    };

    const hasPendingItems = uploadItems.some(item => item.status === 'pending' || item.status === 'error');

    return {
        uploadItems,
        isUploading,
        uploadSuccess,
        getRootProps,
        getInputProps,
        isDragActive,
        handleUpload,
        handleRemoveItem,
        handleClearAll,
        hasPendingItems,
    };
}
