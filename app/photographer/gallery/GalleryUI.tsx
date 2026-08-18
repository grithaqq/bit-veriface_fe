import React from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/app/lib/types';
import Pagination from '@/app/ui/Pagination';
import { useGalleryLogic, getThumbnailUrl, getImageUrl } from './useGalleryLogic';

export default function GalleryUI(props: ReturnType<typeof useGalleryLogic>) {
    const {
        images,
        isLoading,
        error,
        selectedImage,
        setSelectedImage,
        pagination,
        handlePageChange,
        handleDownload,
        handleDelete,
        router,
    } = props;

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Galeri Saya 📷</h1>
                    {pagination && (
                        <p className="text-base-content/60 mt-1">
                            {pagination.total_item} foto milik Anda • Halaman {pagination.curr_page} dari {pagination.total_page}
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push('/photographer/upload')}
                        className="btn btn-primary shadow-sm hover:shadow-md transition-shadow"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Upload Foto
                    </button>
                </div>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-lg font-medium">Belum ada foto</p>
                    <p className="text-sm">Mulai upload foto untuk mengisi galeri Anda</p>
                    <button onClick={() => router.push('/photographer/upload')} className="btn btn-sm btn-primary mt-2">
                        Upload Sekarang
                    </button>
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
                                    <div className="flex gap-2">
                                        <button 
                                            className="btn btn-circle btn-sm btn-error bg-error/90 border-none hover:bg-error backdrop-blur-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(img.id);
                                            }}
                                            title="Hapus foto"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button 
                                            className="btn btn-circle btn-sm btn-primary bg-primary/90 border-none hover:bg-primary backdrop-blur-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(img);
                                            }}
                                            title="Download foto"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
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
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDelete(selectedImage.id)}
                                    className="btn btn-error btn-outline shadow-sm shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="hidden md:inline">Hapus</span>
                                </button>
                                <button
                                    onClick={() => handleDownload(selectedImage)}
                                    className="btn btn-primary shadow-md shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    <span className="hidden md:inline">Download</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
