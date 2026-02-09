import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PDFViewer from '../components/PDFViewer';
import api from '../utils/api';

const ProfileView = () => {
	const { uniqueUrl } = useParams();
	const [client, setClient] = useState(null);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		fetchProfile();
	}, [uniqueUrl]);

	const fetchProfile = async () => {
		try {
			setLoading(true);
			const response = await api.get(`/clients/profile/${uniqueUrl}`);
			setClient(response.data);
			setNotFound(false);
		} catch (error) {
			setNotFound(true);
			toast.error('✗ Profile not found or is inactive');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-gray-100'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
			</div>
		);
	}

	if (notFound || !client) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-gray-100'>
				<div className='text-center'>
					<h1 className='text-3xl font-bold text-gray-800 mb-4'>
						Profile Not Found
					</h1>
					<p className='text-gray-600'>
						This profile doesn't exist or has been removed.
					</p>
				</div>
			</div>
		);
	}

	return (
		<PDFViewer pdfUrl={client.pdfUrl} businessName={client.businessName} />
	);
};

export default ProfileView;
