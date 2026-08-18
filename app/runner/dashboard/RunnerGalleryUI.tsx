import React from 'react';
import Image from 'next/image';
import { useRunnerGalleryLogic, getThumbnailUrl, getImageUrl } from './useRunnerGalleryLogic';
import Pagination from '@/app/ui/Pagination';

export default function RunnerGalleryUI(props: ReturnType<typeof useRunnerGalleryLogic>) {
    const {
        images,
        isLoading,
        error,
        selectedImage,
        setSelectedImage,
        pagination,
        currentPage,
        fetchGallery,
        handlePageChange,
        handleDownload,
    } = props;

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gallery 🖼️</h1>
                    {pagination && (
                        <p className="text-base-content/60 mt-1">
                            {pagination.total_item} foto tersedia • Halaman {pagination.curr_page} dari {pagination.total_page}
                        </p>
                    )}
                </div>
                <button onClick={() => fetchGallery(currentPage)} className="btn btn-outline shadow-sm hover:shadow-md transition-shadow">
                    🔄 Refresh
                </button>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center items-center flex-1">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            )}

            {/* Error */}
            {error && !isLoading && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && images.length === 0 && (
                <div className="flex flex-col items-center justify-center flex-1 text-base-content/40 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-medium">Belum ada foto</p>
                    <p className="text-sm">Belum ada foto yang tersedia di galeri</p>
                </div>
            )}

            {/* Grid */}
            {!isLoading && images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="group relative bg-base-100 rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl"
                            onClick={() => setSelectedImage(img)}
                        >
                            <div className="aspect-square overflow-hidden bg-base-300">
                                <Image
                                    src={
                                        img.thumbnail_filename
                                            ? getThumbnailUrl(img.user_id, img.thumbnail_filename)
                                            : getImageUrl(img.user_id, img.saved_filename)
                                    }
                                    alt={img.original_filename}
                                    width={400}
                                    height={400}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            
                            {/* Hover Overlay */}
                            <div className="opacity-0 absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 flex flex-col justify-end p-4 group-hover:opacity-100">
                                <p className="text-white font-medium truncate">{img.original_filename}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-white/80 text-xs">
                                        {new Date(img.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                    <button 
                                        className="btn btn-circle btn-sm btn-primary bg-primary/90 border-none hover:bg-primary backdrop-blur-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(img.saved_filename, img.original_filename);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && !isLoading && images.length > 0 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={pagination.curr_page}
                        totalPages={pagination.total_page}
                        hasPrev={pagination.has_prev}
                        hasNext={pagination.has_next}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="bg-base-100 rounded-2xl overflow-hidden max-w-3xl w-full relative shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setSelectedImage(null)} 
                            className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost bg-black/20 text-white hover:bg-black/40 z-10"
                        >
                            ✕
                        </button>
                        <div className="relative bg-base-300">
                            <Image
                                src={getImageUrl(selectedImage.user_id, selectedImage.saved_filename)}
                                alt={selectedImage.original_filename}
                                width={800}
                                height={600}
                                className="w-full h-auto max-h-[70vh] object-contain"
                            />
                        </div>
                        <div className="p-6 bg-base-100 flex justify-between items-center gap-4">
                            <div className="min-w-0">
                                <h3 className="text-lg font-bold truncate">{selectedImage.original_filename}</h3>
                                <p className="text-sm text-base-content/60 mt-1">
                                    Uploaded on {new Date(selectedImage.created_at).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDownload(selectedImage.saved_filename, selectedImage.original_filename)}
                                className="btn btn-primary shadow-md shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Download Original
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
