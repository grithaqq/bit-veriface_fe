import React from 'react';
import Image from 'next/image';
import { useUploadLogic } from './useUploadLogic';

export default function UploadUI(props: ReturnType<typeof useUploadLogic>) {
    const {
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
    } = props;

    return (
        <div className="flex flex-col min-h-full">
            <div className="flex-grow flex items-start justify-center p-4 pt-8">
                <div className="bg-base-100 p-8 rounded-2xl shadow-xl w-full max-w-4xl flex flex-col">
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">Upload Photos 📤</h1>
                    <p className="text-base-content/60 mb-8">
                        Pilih beberapa foto sekaligus untuk ditambahkan ke database
                    </p>

                    {/* Giant Dropzone (from UI Exploration) */}
                    <div
                        {...getRootProps()}
                        className={`transition-all duration-300 p-12 flex flex-col items-center justify-center cursor-pointer mb-8 rounded-3xl border-4 border-dashed
                        ${isDragActive ? 'border-primary bg-primary/5' : 'border-base-300 bg-base-100 hover:border-primary hover:bg-base-50'}`}
                    >
                        <input {...getInputProps()} />
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${isDragActive ? 'bg-primary/20 text-primary' : 'bg-base-200 text-base-content/40'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Drag & Drop files here</h3>
                        <p className="text-base-content/50 mb-6">or click to browse from your computer</p>
                        <div className="flex gap-4 text-sm text-base-content/40 font-medium">
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> 
                                JPG, PNG
                            </span>
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg> 
                                Max 15MB
                            </span>
                        </div>
                    </div>

                    {/* Alerts */}
                    {uploadSuccess && (
                        <div className="alert alert-success mt-4 text-sm py-3 mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{uploadSuccess}</span>
                        </div>
                    )}

                    {/* Upload Queue (Modern Layout) */}
                    {uploadItems.length > 0 && (
                        <div className="bg-base-200 rounded-2xl shadow-sm border border-base-300 overflow-hidden flex-1 flex flex-col">
                            <div className="p-4 border-b border-base-300 bg-base-100 flex justify-between items-center">
                                <h3 className="font-bold flex items-center">
                                    <span className="badge badge-primary badge-sm mr-2">{uploadItems.length}</span> 
                                    Files in queue
                                </h3>
                                <button 
                                    onClick={handleClearAll} 
                                    disabled={isUploading} 
                                    className="btn btn-sm btn-ghost text-error"
                                >
                                    Clear Queue
                                </button>
                            </div>
                            
                            <div className="p-4 space-y-2 max-h-[40vh] overflow-y-auto">
                                {uploadItems.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className={`flex items-center gap-4 p-3 bg-base-100 rounded-xl transition-all border 
                                            ${item.status === 'error' ? 'border-error/30 bg-error/5' : 
                                              item.status === 'success' ? 'border-success/30 bg-success/5' : 
                                              'border-transparent hover:border-base-300'}`}
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-base-300 overflow-hidden shrink-0 relative">
                                            <Image
                                                src={item.preview}
                                                alt={item.file.name}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className={item.status === 'uploading' ? 'opacity-70' : ''}
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between mb-1">
                                                <span className={`text-sm font-medium truncate ${item.status === 'success' ? 'text-success' : item.status === 'error' ? 'text-error' : ''}`}>
                                                    {item.file.name}
                                                </span>
                                                <span className="text-xs font-bold flex items-center gap-1">
                                                    {item.status === 'pending' && <span className="text-base-content/50">Pending</span>}
                                                    {item.status === 'uploading' && <span className="text-primary">Uploading...</span>}
                                                    {item.status === 'success' && <span className="text-success flex items-center"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Done</span>}
                                                    {item.status === 'error' && <span className="text-error truncate max-w-[150px]" title={item.errorMessage}>⚠ {item.errorMessage}</span>}
                                                </span>
                                            </div>
                                            {item.status === 'uploading' && (
                                                <progress className="progress progress-primary w-full h-1.5" value={0} max="100"></progress> 
                                                // Note: we'd need actual upload progress tracking to animate this, but indeterminate is fine too.
                                                // using value={undefined} makes it indeterminate, or we can use indeterminate progress
                                            )}
                                            {item.status === 'uploading' && <progress className="progress progress-primary w-full h-1.5"></progress>}
                                            {item.status === 'success' && <progress className="progress progress-success w-full h-1.5" value="100" max="100"></progress>}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={isUploading || item.status === 'uploading'}
                                            className="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-error shrink-0"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="p-4 bg-base-100 border-t border-base-300">
                                <button
                                    onClick={handleUpload}
                                    disabled={!hasPendingItems || isUploading}
                                    className="btn btn-primary w-full shadow-md"
                                >
                                    {isUploading
                                        ? <><span className="loading loading-spinner loading-sm" /> Sedang Mengupload...</>
                                        : `Mulai Upload ${uploadItems.filter(i => i.status === 'pending' || i.status === 'error').length} Foto`
                                    }
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
