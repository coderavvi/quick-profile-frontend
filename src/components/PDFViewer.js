import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl, businessName }) => {
	const [numPages, setNumPages] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isImage, setIsImage] = useState(false);

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
		setLoading(false);
	};

	const onDocumentLoadError = (error) => {
		console.error('PDF load error:', error);
		// Check if it might be an image
		if (pdfUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
			setIsImage(true);
			setLoading(false);
		} else {
			setError('Failed to load document');
			setLoading(false);
		}
	};

	const handleDownload = () => {
		const link = document.createElement('a');
		link.href = pdfUrl;
		const fileExtension = pdfUrl.split('.').pop().toLowerCase();
		const fileName = `${businessName}-profile.${fileExtension}`;
		link.download = fileName;
		link.click();
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
			<div className='bg-white rounded-lg shadow-lg w-full'>
				{/* Document Viewer */}
				<div className='p-6'>
					{loading && (
						<div className='flex justify-center py-12'>
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
						<>
							<div className='flex flex-col items-center'>
								<img
									src={pdfUrl}
									alt={businessName}
									className='max-w-full h-auto'
								/>
							</div>
							<div className='flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-300'>
								<button
									onClick={handleDownload}
									className='px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition'>
									⬇️ Download
								</button>
							</div>
						</>
					)}

					{!error && !isImage && (
						<>
							<Document
								file={pdfUrl}
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
												/>
											),
										)}
								</div>
							</Document>

							<div className='flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-300'>
								<button
									onClick={handleDownload}
									className='px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition'>
									⬇️ Download
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default PDFViewer;
