import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import ClientForm from '../components/ClientForm';
import api from '../utils/api';

const EditClient = () => {
	const { id } = useParams();
	const [client, setClient] = useState(null);
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		fetchClient();
	}, [id]);

	const fetchClient = async () => {
		try {
			setFetching(true);
			const response = await api.get(`/clients/${id}`);
			setClient(response.data);
		} catch (error) {
			const errorMsg =
				error.response?.data?.message || 'Failed to fetch client';
			toast.error('✗ ' + errorMsg);
			console.error(error);
			setTimeout(() => navigate('/admin/dashboard'), 500);
		} finally {
			setFetching(false);
		}
	};

	const handleSubmit = async (formData) => {
		try {
			setLoading(true);
			const response = await api.put(`/clients/${id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			toast.success('✓ ' + response.data.message);
			setTimeout(() => navigate('/admin/dashboard'), 500);
		} catch (error) {
			const message =
				error.response?.data?.message ||
				error.response?.data?.errors?.[0]?.msg ||
				'Failed to update client';
			toast.error('✗ ' + message);
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (fetching) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<Navbar />
				<main className='max-w-3xl mx-auto px-4 py-8'>
					<div className='flex justify-center py-12'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
					</div>
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
					<h1 className='text-3xl font-bold text-gray-800'>Edit Client</h1>
				</div>

				<div className='bg-white rounded-lg shadow p-8'>
					{client && (
						<ClientForm
							initialData={client}
							onSubmit={handleSubmit}
							loading={loading}
						/>
					)}
				</div>
			</main>
		</div>
	);
};

export default EditClient;
