import React from 'react';
import Image from 'next/image';
import { useSearchLogic, getSearchImageUrl, SEARCH_PAGE_SIZE } from './useSearchLogic';
import Pagination from '@/app/ui/Pagination';

export default function SearchUI(props: ReturnType<typeof useSearchLogic>) {
    const {
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
    } = props;

    return (
        <div className="flex flex-col md:flex-row h-full bg-base-200 -mx-8 -my-5 overflow-hidden">
            {/* Sidebar Controls */}
            <aside className="w-full md:w-80 bg-base-100 border-r border-base-200 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0 h-[calc(100vh-64px)] overflow-y-auto">
                <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold mb-6">Find Face 🔍</h2>
                    
                    {error && <div className="alert alert-error mb-4 text-sm py-2"><span>{error}</span></div>}
                    
                    {/* Upload Dropzone */}
                    {!uploadedImagePreview ? (
                        <div 
                            {...getRootProps()} 
                            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors mb-6 group
                            ${isDragActive ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary hover:bg-base-50'}`}
                        >
                            <input {...getInputProps()} />
                            <div className="w-12 h-12 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-base-content/60 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </div>
                            <p className="font-medium text-sm">Drag & drop selfie here</p>
                            <p className="text-xs text-base-content/50 mt-1">or click to browse files</p>
                        </div>
                    ) : (
                        <div className="mb-6 bg-base-200 p-2 rounded-xl border border-base-300 relative group">
                            <div className="relative rounded-lg overflow-hidden aspect-square bg-base-300">
                                <Image 
                                    src={uploadedImagePreview} 
                                    alt="Preview" 
                                    fill 
                                    style={{ objectFit: 'cover' }} 
                                />
                            </div>
                            <button 
                                onClick={handleClearUpload}
                                className="absolute top-4 right-4 btn btn-sm btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                                ✕
                            </button>
                            <div className="mt-2 text-center text-xs truncate px-2 font-medium">
                                {uploadedFileName}
                            </div>
                        </div>
                    )}

                    {/* Sliders & Controls */}
                    <div className="space-y-6 flex-1">
                        <div>
                            <label htmlFor="topK" className="flex justify-between text-sm font-medium mb-2">
                                <span>Top-K Results</span>
                                <span className="text-primary font-bold">{topK}</span>
                            </label>
                            <input 
                                type="range" 
                                id="topK" 
                                min="1" 
                                max="50" 
                                step="1"
                                value={topK} 
                                onChange={(e) => setTopK(Number(e.target.value))}
                                className="w-full range range-primary range-sm"
                            />
                            <div className="flex justify-between text-xs text-base-content/40 mt-1">
                                <span>1</span>
                                <span>50</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 border-t border-base-200 bg-base-100/50 sticky bottom-0">
                    <button 
                        onClick={handleSearch} 
                        className="btn btn-primary w-full shadow-md shadow-primary/20" 
                        disabled={isLoading || !uploadedImage}
                    >
                        {isLoading ? <span className="loading loading-spinner loading-sm" /> : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search Face
                            </>
                        )}
                    </button>
                    {paginationInfo && (
                        <p className="mt-4 text-center text-xs text-base-content/50 font-medium">
                            {allResults.length} matches found
                        </p>
                    )}
                </div>
            </aside>

            {/* Search Results Area */}
            <main className="flex-1 bg-base-200 overflow-y-auto p-8 relative h-[calc(100vh-64px)]">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-6">
                        <h1 className="text-2xl font-bold tracking-tight">Search Results</h1>
                        {hasSearched && (
                            <span className="text-sm font-medium text-base-content/50">
                                Showing {searchResults.length} of {allResults.length}
                            </span>
                        )}
                    </div>

                    {!hasSearched && (
                        <div className="flex flex-col items-center justify-center h-64 text-base-content/40 bg-base-100 rounded-3xl border border-base-300 border-dashed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-lg font-medium">Ready to search</p>
                            <p className="text-sm mt-1">Upload a face image on the left panel to find matches.</p>
                        </div>
                    )}
                    
                    {hasSearched && !isLoading && allResults.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-base-content/40 bg-base-100 rounded-3xl border border-base-300">
                            <p className="text-lg font-medium">No results found.</p>
                            <p className="text-sm mt-1">Try uploading a clearer image or increasing Top-K.</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-64 text-base-content/60 bg-base-100 rounded-3xl border border-base-300">
                            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                            <p className="text-lg font-medium">Sedang memproses...</p>
                            <p className="text-sm mt-1">AI sedang mencocokkan wajah Anda dengan database foto.</p>
                        </div>
                    )}

                    {/* Results Grid */}
                    {hasSearched && !isLoading && allResults.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                            {searchResults.map((result, idx) => {
                                // Dynamic badge color based on distance
                                const dist = result.distance || 0;
                                const badgeClass = dist < 0.6 ? 'badge-success' : dist < 0.8 ? 'badge-warning' : 'badge-error';
                                
                                return (
                                    <div 
                                        key={result.img_id} 
                                        className="group relative bg-base-100 rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                                        onClick={() => setSelectedImage(result)}
                                    >
                                        <div className="aspect-square overflow-hidden bg-base-300 relative">
                                            {/* Distance Badge */}
                                            {result.distance !== undefined && (
                                                <div className="absolute top-2 left-2 z-10">
                                                    <span className={`badge ${badgeClass} badge-sm shadow-sm font-semibold gap-1 text-[10px]`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                        {result.distance.toFixed(3)}
                                                    </span>
                                                </div>
                                            )}
                                            <Image
                                                src={getSearchImageUrl(result.img_path)}
                                                alt={`Result ${result.img_id}`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className="transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="opacity-0 absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300 flex flex-col justify-end p-3 group-hover:opacity-100">
                                            <button 
                                                className="btn btn-primary btn-sm w-full border-none shadow-md"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(getSearchImageUrl(result.img_path), `image-${result.img_id.slice(0,8)}.jpg`);
                                                }}
                                            >
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Client-side pagination */}
                    {allResults.length > SEARCH_PAGE_SIZE && (
                        <div className="mt-8 mb-4">
                            <Pagination
                                currentPage={searchPage}
                                totalPages={totalSearchPages}
                                hasPrev={searchPage > 1}
                                hasNext={searchPage < totalSearchPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </main>

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
                                src={getSearchImageUrl(selectedImage.img_path)}
                                alt="Selected"
                                width={800}
                                height={600}
                                className="w-full h-auto max-h-[70vh] object-contain"
                            />
                        </div>
                        <div className="p-6 bg-base-100 flex justify-between items-center gap-4">
                            <div className="min-w-0">
                                <h3 className="text-lg font-bold truncate">ID: {selectedImage.img_id}</h3>
                                {selectedImage.distance !== undefined && (
                                    <p className="text-sm text-base-content/60 mt-1">
                                        Distance: <span className="font-bold text-primary">{selectedImage.distance}</span>
                                    </p>
                                )}
                            </div>
                            <button 
                                onClick={() => handleDownload(getSearchImageUrl(selectedImage.img_path), `image-${selectedImage.img_id}.jpg`)} 
                                className="btn btn-primary shadow-md shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
