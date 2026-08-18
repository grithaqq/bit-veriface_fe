'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SearchResult {
    img_path: string;
    img_id: string;
    user_id: string;
}

interface PaginationInfo {
    total_item: number;
    total_page: number;
    page_size: number;
    curr_page: number;
    prev_page: number;
    next_page: number;
    has_prev: boolean;
    has_next: boolean;
}

interface ApiResponse {
    status: number;
    message: string;
    data: SearchResult[];
    pagination: PaginationInfo;
}

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [maxDistance, setMaxDistance] = useState(70);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<SearchResult | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            router.push('/login');
        }
    }, [router]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
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
        maxSize: 2000000 // 2MB limit
    });

    const handleMaxDistanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMaxDistance(Number(event.target.value));
    };

    const handleSearch = async () => {
        if (!uploadedImage) {
            setError('Please upload an image first');
            return;
        }

        setIsLoading(true);
        setHasSearched(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', uploadedImage);

        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                throw new Error('No access token found');
            }

            const response = await fetch(`/api/search?max_distance=${maxDistance}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const result: ApiResponse = await response.json();
            setSearchResults(result.data);
            setPaginationInfo(result.pagination);
        } catch (error) {
            console.error('Search failed:', error);
            setError('Search failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageClick = (result: SearchResult) => {
        setSelectedImage(result);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleDownload = (imageUrl: string, fileName: string) => {
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    };

    return (
        <div className="flex h-screen bg-base-200">
            {/* Sidebar */}
            <div className="w-64 bg-base-100 shadow-xl p-4">
                <h2 className="text-xl font-bold mb-4">Image Similarity Search</h2>
                <div {...getRootProps()} className="bg-base-300 p-4 rounded-lg cursor-pointer">
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the image here ...</p>
                    ) : (
                        <p>Drag and drop file here, or click to select file</p>
                    )}
                    <p className="text-xs mt-2">Limit 2000KB per file • JPEG, JPG, PNG</p>
                </div>
                {uploadedFileName && (
                    <div className="mt-4 bg-base-300 p-2 rounded flex justify-between items-center">
                        <span className="truncate">{uploadedFileName}</span>
                        <button onClick={() => {
                            setUploadedImage(null);
                            setUploadedFileName(null);
                            setUploadedImagePreview(null);
                        }} className="text-error">×</button>
                    </div>
                )}
                {uploadedImagePreview && (
                    <div className="mt-4 border-2 border-primary rounded-lg p-1">
                        <Image src={uploadedImagePreview} alt="Uploaded" width={200} height={200} style={{objectFit: 'contain'}} />
                    </div>
                )}
                {/* Min Distance slider */}
                <div className="mt-4">
                    <label htmlFor="maxDistance" className="block text-sm font-medium text-base-content">
                        Max Distance: {maxDistance}
                    </label>
                    <input
                        type="range"
                        id="maxDistance"
                        name="maxDistance"
                        min="0"
                        max="1000"
                        step="1"
                        value={maxDistance}
                        onChange={handleMaxDistanceChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <button 
                    onClick={handleSearch} 
                    className="mt-4 btn btn-primary w-full"
                    disabled={isLoading || !uploadedImage}
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-2xl font-bold mb-4">Image Similarity Search Results 🖼️</h1>
                {error && (
                    <p className="text-error mb-4">{error}</p>
                )}
                {!hasSearched && (
                    <p className="text-base-content/70">Upload an image and click "Search" to see similarity results.</p>
                )}
                {hasSearched && searchResults.length === 0 && (
                    <p className="text-base-content/70">No results found. Try another image.</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {searchResults.map((result) => (
                        <div key={result.img_id} className="bg-base-100 rounded-lg shadow-md overflow-hidden cursor-pointer" onClick={() => handleImageClick(result)}>
                            <Image
                                src={`http://${result.img_path}`}
                                alt={`Result ${result.img_id}`}
                                width={200}
                                height={200}
                                style={{objectFit: 'cover'}}
                            />
                            <div className="p-2">
                                <p className="text-sm text-base-content/70">ID: {result.img_id.slice(0, 8)}...</p>
                            </div>
                            <div className="p-2">
                                <p className="text-sm text-base-content/70 text-yellow-300">Distance: {result.distance}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {paginationInfo && (
                    <div className="mt-4 text-center">
                        <p>Showing {searchResults.length} of {paginationInfo.total_item} results</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-base-100 rounded-lg p-4 max-w-2xl w-full relative my-8">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-base-content/70 hover:text-base-content z-10"
                            aria-label="Close modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="max-h-[80vh] overflow-y-auto pt-8">
                            <Image src={selectedImage.img_path} alt="Selected" width={600} height={400} style={{objectFit: 'contain'}} />
                            <div className="flex justify-between items-center sticky bottom-0 bg-base-100 py-2">
                                <p className="text-lg">ID: {selectedImage.img_id}</p>
                                <button
                                    onClick={() => handleDownload(selectedImage.img_path, `image-${selectedImage.img_id}.jpg`)}
                                    className="btn btn-primary"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}