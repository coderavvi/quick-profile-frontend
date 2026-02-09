import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl, businessName }) => {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
		setLoading(false);
	};

	const onDocumentLoadError = (error) => {
		console.error('PDF load error:', error);
		setError('Failed to load PDF');
		setLoading(false);
	};

	const handlePreviousPage = () => {
		setPageNumber((prev) => Math.max(prev - 1, 1));
	};

	const handleNextPage = () => {
		setPageNumber((prev) => Math.min(prev + 1, numPages));
	};

	const handleDownload = () => {
		const link = document.createElement('a');
		link.href = pdfUrl;
		link.download = `${businessName}-profile.pdf`;
		link.click();
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
			<div className='bg-white rounded-lg shadow-lg max-w-4xl w-full'>
				{/* PDF Viewer */}
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
									Open PDF in new tab
								</a>
							</p>
						</div>
					)}

					{!error && (
						<>
							<Document
								file={pdfUrl}
								onLoadSuccess={onDocumentLoadSuccess}
								onLoadError={onDocumentLoadError}
								loading={<div>Loading PDF...</div>}>
								<div className='flex flex-col items-center'>
									<Page
										pageNumber={pageNumber}
										width={Math.min(window.innerWidth - 60, 800)}
										renderTextLayer={false}
									/>
								</div>
							</Document>

							{numPages && (
								<div className='flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-300'>
									<button
										onClick={handlePreviousPage}
										disabled={pageNumber === 1}
										className='px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition'>
										← Previous
									</button>

									<span className='text-gray-600 font-medium'>
										Page {pageNumber} of {numPages}
									</span>

									<button
										onClick={handleNextPage}
										disabled={pageNumber >= numPages}
										className='px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition'>
										Next →
									</button>

									<button
										onClick={handleDownload}
										className='px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition'>
										⬇️ Download PDF
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default PDFViewer;
