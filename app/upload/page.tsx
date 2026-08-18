'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function UploadPage() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            router.push('/login');
        }
    }, [router]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setUploadedFile(file);
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

    const handleUpload = async () => {
        if (!uploadedFile) {
            setUploadError('Please upload an image first.');
            return;
        }

        setIsLoading(true);
        setUploadError(null);
        setUploadSuccess(null);

        const formData = new FormData();
        formData.append('file', uploadedFile);

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setUploadError('No access token found. Please log in again.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Upload failed');
            }

            setUploadSuccess(`Great news! Your image "${result.data.original_filename}" has been successfully uploaded and is ready for similarity search. You can now proceed to the dashboard to view the results.`);
            
            setTimeout(() => {
                router.push('/dashboard');
            }, 5000);
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadError('Upload failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-base-200">
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-base-100 p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">Upload Image</h1>
                    
                    <div 
                        {...getRootProps()} 
                        className="border-2 border-dashed border-base-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p>Drop the image here ...</p>
                        ) : (
                            <p>Drag and drop an image here, or click to select</p>
                        )}
                    </div>

                    {uploadedFileName && (
                        <p className="mt-2 text-sm text-base-content/70">{uploadedFileName}</p>
                    )}

                    {uploadedImagePreview && (
                        <div className="mt-4 flex justify-center items-center overflow-hidden" style={{ maxHeight: '300px' }}>
                            <Image 
                                src={uploadedImagePreview} 
                                alt="Preview" 
                                width={300}
                                height={300}
                                style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '300px' }}
                            />
                        </div>
                    )}

                    {uploadError && (
                        <div className="mt-4 p-2 bg-error/20 border border-error text-error rounded">
                            {uploadError}
                        </div>
                    )}

                    {uploadSuccess && (
                        <div className="mt-4 p-2 bg-success/20 border border-success text-success rounded">
                            {uploadSuccess}
                        </div>
                    )}

                    <button 
                        onClick={handleUpload}
                        disabled={!uploadedFile || isLoading}
                        className={`mt-6 w-full py-2 px-4 rounded ${
                            uploadedFile && !isLoading
                                ? 'btn btn-primary'
                                : 'btn btn-disabled'
                        }`}
                    >
                        {isLoading ? 'Uploading...' : 'Upload and Start Search'}
                    </button>
                </div>
            </div>
        </div>
    );
}