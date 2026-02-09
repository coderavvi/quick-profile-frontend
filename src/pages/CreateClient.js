import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import ClientForm from '../components/ClientForm';
import ClientSuccessScreen from '../components/ClientSuccessScreen';
import api from '../utils/api';

const CreateClient = () => {
	const [loading, setLoading] = useState(false);
	const [successClient, setSuccessClient] = useState(null);
	const navigate = useNavigate();

	const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';

	const handleSubmit = async (formData) => {
		try {
			setLoading(true);
			const response = await api.post('/clients', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			toast.success('✓ ' + response.data.message);
			setSuccessClient(response.data.client);
		} catch (error) {
			const message =
				error.response?.data?.message ||
				error.response?.data?.errors?.[0]?.msg ||
				'Failed to create client';
			toast.error('✗ ' + message);
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleFinish = () => {
		navigate('/admin/dashboard');
	};

	if (successClient) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<Navbar />
				<main className='max-w-3xl mx-auto px-4 py-8'>
					<ClientSuccessScreen
						client={successClient}
						baseUrl={baseUrl}
						onFinish={handleFinish}
					/>
				</main>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar />

			<main className='max-w-3xl mx-auto px-4 py-8'>
				<div className='mb-8'>
					<button
						onClick={() => navigate('/admin/dashboard')}
						className='text-primary hover:underline mb-4'>
						← Back to Dashboard
					</button>
					<h1 className='text-3xl font-bold text-gray-800'>
						Create New Client
					</h1>
				</div>

				<div className='bg-white rounded-lg shadow p-8'>
					<ClientForm onSubmit={handleSubmit} loading={loading} />
				</div>
			</main>
		</div>
	);
};

export default CreateClient;
