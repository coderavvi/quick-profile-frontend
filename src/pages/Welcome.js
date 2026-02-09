import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Welcome = () => {
	const { uniqueUrl } = useParams();
	const [client, setClient] = useState(null);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);
	const navigate = useNavigate();

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
			<div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
			</div>
		);
	}

	if (notFound) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100'>
				<div className='text-center'>
					<h1 className='text-4xl font-bold text-gray-800 mb-4'>
						Profile Not Found
					</h1>
					<p className='text-gray-600 mb-6'>
						The profile you're looking for doesn't exist or has been removed.
					</p>
					<a
						href='/'
						className='px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition'>
						Return to Home
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4'>
			<div className='text-center max-w-2xl'>
				<div className='mb-8'>
					<div className='inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6'>
						<span className='text-5xl'>🚀</span>
					</div>
					<h1 className='text-5xl font-bold text-gray-800 mb-4'>
						Welcome to {client.businessName}
					</h1>
					<p className='text-lg text-gray-600 mb-8'>
						This is {client.clientName}'s business profile. Check out their
						latest information and services.
					</p>
				</div>

				<div className='space-y-4'>
					<button
						onClick={() => navigate(`/profile/${uniqueUrl}`)}
						className='block w-full px-8 py-4 bg-primary text-white text-lg font-medium rounded-lg hover:opacity-90 transition shadow-lg'>
						View Business Profile
					</button>

					<Link
						to={`/profile/${uniqueUrl}`}
						className='block text-primary hover:underline text-lg'>
						Click here to view profile →
					</Link>
				</div>

				<div className='mt-12 p-6 bg-white rounded-lg shadow'>
					<p className='text-gray-600 text-sm'>
						<strong>QuickProfile</strong> - Simple Business Profile Sharing
					</p>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
