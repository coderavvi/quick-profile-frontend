import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl, businessName }) => {
	const isImageUrl = (url) => {
		// Check Cloudinary URL pattern: /image/upload/ indicates an image resource
		if (url && url.includes('/image/upload/')) return true;
		// Check file extension (handle query parameters after extension)
		if (url && url.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) return true;
		return false;
	};

	// Detect if URL is an image upfront
	const detectedAsImage = isImageUrl(pdfUrl);

	const [numPages, setNumPages] = useState(null);
	const [loading, setLoading] = useState(!detectedAsImage);
	const [error, setError] = useState(null);
	const [isImage, setIsImage] = useState(detectedAsImage);

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
		setLoading(false);
	};

	const onDocumentLoadError = (error) => {
		console.error('PDF load error:', error);
		// If PDF loading fails, try displaying as image
		if (isImageUrl(pdfUrl)) {
			setIsImage(true);
			setLoading(false);
		} else {
			setError('Failed to load document');
			setLoading(false);
		}
	};

	const handleDownload = () => {
		if (!pdfUrl) {
			console.error('No PDF URL available for download');
			return;
		}
		console.log('Downloading from:', pdfUrl);
		const link = document.createElement('a');
		link.href = pdfUrl;
		const fileExtension = pdfUrl.includes('.') ? pdfUrl.split('.').pop().toLowerCase() : 'pdf';
		const fileName = `${businessName}-profile.${fileExtension}`;
		link.download = fileName;
		link.setAttribute('crossOrigin', 'anonymous');
		link.click();
	};

	return (
		<div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
			<div className='bg-white rounded-lg shadow-lg w-full h-full flex flex-col'>
				{/* Document Viewer */}
				<div className='flex-1 overflow-y-auto p-6'>
					{loading && (
						<div className='flex justify-center items-center h-full'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
						</div>
					)}

					{error && (
						<div className='text-center py-12 text-red-600'>
							<p>{error}</p>
							<p className='text-sm text-gray-600 mt-2'>
								<a
									href={pdfUrl}
									target='_blank'
									rel='noopener noreferrer'
									className='text-blue-500 hover:underline'>
									Open document in new tab
								</a>
							</p>
						</div>
					)}

					{!error && isImage && (
						<div className='flex flex-col items-center'>
							<img
								src={pdfUrl}
								alt={businessName}
								className='max-w-full h-auto'
								crossOrigin='anonymous'
							/>
						</div>
					)}

					{!error && !isImage && (
						<Document
							file={{ url: pdfUrl, withCredentials: false }}
							onLoadSuccess={onDocumentLoadSuccess}
							onLoadError={onDocumentLoadError}
							loading={<div>Loading document...</div>}>
							<div className='flex flex-col items-center space-y-4'>
								{numPages &&
									Array.from({ length: numPages }, (_, i) => i + 1).map(
										(pageNum) => (
											<Page
												key={pageNum}
												pageNumber={pageNum}
												width={Math.min(window.innerWidth - 60, 900)}
												renderTextLayer={false}
												renderAnnotationLayer={false}
											/>
										),
									)}
							</div>
						</Document>
					)}
				</div>

				{/* Download Button */}
				<div className='flex justify-center items-center gap-4 p-6 border-t border-gray-300 bg-white'>
					<button
						onClick={handleDownload}
						className='px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition'>
						⬇️ Download
					</button>
				</div>
			</div>
		</div>
	);
};

export default PDFViewer;
