import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const ClientSuccessScreen = ({ client, baseUrl, onFinish }) => {
	const qrRef = useRef();

	const fullUrl = `${baseUrl}/${client.uniqueUrl}`;

	const handleCopyUrl = () => {
		navigator.clipboard.writeText(fullUrl);
		// Simple feedback
		const button = document.querySelector('[data-copy-btn]');
		if (button) {
			const originalText = button.textContent;
			button.textContent = '✓ Copied!';
			setTimeout(() => {
				button.textContent = originalText;
			}, 2000);
		}
	};

	const handleDownloadQR = () => {
		const qrElement = qrRef.current.querySelector('canvas');
		const link = document.createElement('a');
		link.href = qrElement.toDataURL('image/png');
		link.download = `${client.uniqueUrl}-qr-code.png`;
		link.click();
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
			<div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden'>
				{/* Close Button */}
				<div className='absolute top-4 right-4 z-10'>
					<button
						onClick={onFinish}
						className='p-2 rounded-full hover:bg-gray-100 transition text-gray-500 hover:text-gray-700'>
						<svg
							className='w-6 h-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>

				{/* Header with gradient */}
				<div className='bg-gradient-to-r from-green-400 to-blue-500 p-8 text-center text-white'>
					<div className='inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4 backdrop-blur-sm'>
						<span className='text-5xl'>🎉</span>
					</div>
					<h2 className='text-4xl font-bold mb-2'>Perfect!</h2>
					<p className='text-green-50 text-lg'>
						Your client profile is live and ready to share
					</p>
				</div>

				{/* Content */}
				<div className='p-8 space-y-6 max-h-[calc(100vh-400px)] overflow-y-auto'>
					{/* Client Info */}
					<div className='bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200'>
						<h3 className='font-bold text-gray-800 mb-4 text-lg'>
							📋 Client Details
						</h3>
						<div className='space-y-3'>
							<div className='flex justify-between items-center'>
								<span className='text-gray-600'>Name:</span>
								<span className='font-semibold text-gray-800'>
									{client.clientName}
								</span>
							</div>
							<div className='flex justify-between items-center'>
								<span className='text-gray-600'>Business:</span>
								<span className='font-semibold text-gray-800'>
									{client.businessName}
								</span>
							</div>
							<div className='flex justify-between items-center'>
								<span className='text-gray-600'>Unique URL:</span>
								<code className='bg-white px-3 py-1 rounded-lg border border-slate-300 font-mono text-sm'>
									{client.uniqueUrl}
								</code>
							</div>
						</div>
					</div>

					{/* Profile URL */}
					<div className='bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200'>
						<h3 className='font-bold text-gray-800 mb-4 text-lg'>
							🔗 Share Profile Link
						</h3>
						<div className='flex items-center space-x-2 mb-3'>
							<input
								type='text'
								readOnly
								value={fullUrl}
								className='flex-1 px-4 py-3 bg-white border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono'
							/>
							<button
								onClick={handleCopyUrl}
								data-copy-btn
								className='px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition transform hover:scale-105 whitespace-nowrap'>
								📋 Copy
							</button>
						</div>
						<p className='text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-lg'>
							✓ Share this link with clients to view their profile
						</p>
					</div>

					{/* QR Code */}
					<div className='bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200 text-center'>
						<h3 className='font-bold text-gray-800 mb-4 text-lg'>📲 QR Code</h3>
						<div
							ref={qrRef}
							className='flex justify-center mb-4 bg-white p-6 rounded-lg inline-block w-full border border-purple-200'>
							<QRCodeCanvas
								value={fullUrl}
								size={220}
								level='H'
								includeMargin={true}
								imageSettings={{
									src: '',
									x: null,
									y: null,
									height: 40,
									width: 40,
								}}
							/>
						</div>
						<button
							onClick={handleDownloadQR}
							className='w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition transform hover:scale-105'>
							⬇️ Download QR Code
						</button>
						<p className='text-sm text-purple-700 bg-purple-100 px-3 py-2 rounded-lg mt-3'>
							✓ Scan to instantly open the profile
						</p>
					</div>
				</div>

				{/* Footer Buttons */}
				<div className='bg-gray-50 px-8 py-6 border-t border-gray-200 flex gap-3'>
					<button
						onClick={onFinish}
						className='flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105'>
						✓ Finish
					</button>
					<button
						onClick={onFinish}
						className='px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition'>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default ClientSuccessScreen;
