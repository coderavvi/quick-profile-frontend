import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ClientForm = ({ initialData, onSubmit, loading }) => {
	const [formData, setFormData] = useState({
		clientName: '',
		businessName: '',
		uniqueUrl: '',
	});
	const [pdf, setPdf] = useState(null);
	const [urlAvailable, setUrlAvailable] = useState(null);
	const [checkingUrl, setCheckingUrl] = useState(false);
	const [errors, setErrors] = useState({});
	const [pdfFileName, setPdfFileName] = useState('');

	useEffect(() => {
		if (initialData) {
			setFormData({
				clientName: initialData.clientName || '',
				businessName: initialData.businessName || '',
				uniqueUrl: initialData.uniqueUrl || '',
			});
			setPdfFileName(initialData.pdfUrl ? 'PDF already uploaded' : '');
		}
	}, [initialData]);

	const checkUrlAvailability = async (url) => {
		if (!url.trim()) {
			setUrlAvailable(null);
			return;
		}

		setCheckingUrl(true);
		try {
			const response = await api.get('/clients/check-url', {
				params: { uniqueUrl: url },
			});
			setUrlAvailable(response.data.available);
		} catch (error) {
			setUrlAvailable(false);
		} finally {
			setCheckingUrl(false);
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			if (formData.uniqueUrl && formData.uniqueUrl !== initialData?.uniqueUrl) {
				checkUrlAvailability(formData.uniqueUrl);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [formData.uniqueUrl, initialData?.uniqueUrl]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: '',
			}));
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.type !== 'application/pdf') {
				setErrors((prev) => ({
					...prev,
					pdf: 'Only PDF files are allowed',
				}));
				setPdf(null);
				setPdfFileName('');
			} else if (file.size > 10485760) {
				setErrors((prev) => ({
					...prev,
					pdf: 'File size must be less than 10MB',
				}));
				setPdf(null);
				setPdfFileName('');
			} else {
				setPdf(file);
				setPdfFileName(file.name);
				setErrors((prev) => ({
					...prev,
					pdf: '',
				}));
			}
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.clientName.trim()) {
			newErrors.clientName = 'Client name is required';
		}
		if (!formData.businessName.trim()) {
			newErrors.businessName = 'Business name is required';
		}
		if (!formData.uniqueUrl.trim()) {
			newErrors.uniqueUrl = 'Unique URL is required';
		} else if (!initialData && !pdf) {
			newErrors.pdf = 'PDF file is required for new clients';
		}

		return newErrors;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const newErrors = validateForm();
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		const data = new FormData();
		data.append('clientName', formData.clientName);
		data.append('businessName', formData.businessName);
		data.append('uniqueUrl', formData.uniqueUrl);
		if (pdf) {
			data.append('pdf', pdf);
		}

		onSubmit(data);
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			<div>
				<label className='block text-gray-700 font-medium mb-2'>
					Client Name *
				</label>
				<input
					type='text'
					name='clientName'
					value={formData.clientName}
					onChange={handleInputChange}
					className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
					placeholder='Enter client name'
				/>
				{errors.clientName && (
					<p className='text-red-500 text-sm mt-1'>{errors.clientName}</p>
				)}
			</div>

			<div>
				<label className='block text-gray-700 font-medium mb-2'>
					Business Name *
				</label>
				<input
					type='text'
					name='businessName'
					value={formData.businessName}
					onChange={handleInputChange}
					className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
					placeholder='Enter business name'
				/>
				{errors.businessName && (
					<p className='text-red-500 text-sm mt-1'>{errors.businessName}</p>
				)}
			</div>

			<div>
				<label className='block text-gray-700 font-medium mb-2'>
					Unique URL *
				</label>
				<div className='flex items-center gap-2'>
					<input
						type='text'
						name='uniqueUrl'
						value={formData.uniqueUrl}
						onChange={handleInputChange}
						className='flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
						placeholder='Enter unique URL (e.g., john-doe)'
						disabled={!!initialData}
					/>
					{checkingUrl && <span className='text-gray-500'>Checking...</span>}
					{!checkingUrl && urlAvailable === true && (
						<span className='text-green-500 font-medium'>✓ Available</span>
					)}
					{!checkingUrl && urlAvailable === false && (
						<span className='text-red-500 font-medium'>✗ Taken</span>
					)}
				</div>
				{errors.uniqueUrl && (
					<p className='text-red-500 text-sm mt-1'>{errors.uniqueUrl}</p>
				)}
				{initialData && (
					<p className='text-gray-500 text-sm mt-1'>
						URL cannot be changed after creation
					</p>
				)}
			</div>

			<div>
				<label className='block text-gray-700 font-medium mb-2'>
					PDF File {!initialData && '*'}
				</label>
				<div className='border-2 border-dashed border-gray-300 rounded p-6 text-center'>
					<input
						type='file'
						accept='application/pdf'
						onChange={handleFileChange}
						className='hidden'
						id='pdf-input'
					/>
					<label htmlFor='pdf-input' className='cursor-pointer'>
						<div className='text-6xl mb-2'>📄</div>
						<p className='text-gray-600 mb-2'>
							{pdfFileName ? (
								<>
									<span className='font-medium text-green-600'>
										{pdfFileName}
									</span>
									<br />
									<span className='text-sm'>Click to change</span>
								</>
							) : (
								<>
									Drag and drop PDF here or click to select
									<br />
									<span className='text-sm text-gray-500'>
										Maximum file size: 10MB
									</span>
								</>
							)}
						</p>
					</label>
				</div>
				{errors.pdf && (
					<p className='text-red-500 text-sm mt-1'>{errors.pdf}</p>
				)}
			</div>

			<button
				type='submit'
				disabled={loading || (!initialData && urlAvailable === false)}
				className='w-full px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium'>
				{loading
					? 'Saving...'
					: initialData
						? 'Update Client'
						: 'Create Client'}
			</button>
		</form>
	);
};

export default ClientForm;
