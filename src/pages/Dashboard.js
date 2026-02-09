import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import ClientTable from '../components/ClientTable';
import api from '../utils/api';

const Dashboard = () => {
	const [clients, setClients] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState(null);

	useEffect(() => {
		fetchClients(currentPage, searchTerm);
	}, [currentPage, searchTerm]);

	const fetchClients = async (page = 1, search = '') => {
		try {
			setLoading(true);
			const response = await api.get('/clients', {
				params: {
					page,
					limit: 10,
					search,
				},
			});

			setClients(response.data.clients);
			setPagination(response.data.pagination);
			if (search) {
				toast.info(`✓ Found ${response.data.clients.length} client(s)`);
			}
		} catch (error) {
			const errorMsg =
				error.response?.data?.message || 'Failed to fetch clients';
			toast.error('✗ ' + errorMsg);
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteClient = async (clientId) => {
		if (!window.confirm('Are you sure you want to delete this client?')) {
			return;
		}

		try {
			await api.delete(`/clients/${clientId}`);
			toast.success('✓ Client deleted successfully');
			fetchClients(currentPage, searchTerm);
		} catch (error) {
			const errorMsg =
				error.response?.data?.message || 'Failed to delete client';
			toast.error('✗ ' + errorMsg);
			console.error(error);
		}
	};

	const handleToggleStatus = async (clientId) => {
		try {
			const response = await api.patch(`/clients/${clientId}/status`);
			toast.success('✓ ' + response.data.message);
			fetchClients(currentPage, searchTerm);
		} catch (error) {
			const errorMsg =
				error.response?.data?.message ||
				'Failed to update client status';
			toast.error('✗ ' + errorMsg);
			console.error(error);
		}
	};

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />

			<main className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800">
						Client Management
					</h1>
					<Link
						to="/admin/clients/new"
						className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium"
					>
						+ Add New Client
					</Link>
				</div>

				<div className="mb-6">
					<input
						type="text"
						placeholder="Search clients by name or URL..."
						value={searchTerm}
						onChange={handleSearch}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				<div className="bg-white rounded-lg shadow">
					<div className="p-6">
						<ClientTable
							clients={clients}
							onDelete={handleDeleteClient}
							onToggleStatus={handleToggleStatus}
							loading={loading}
							pagination={pagination}
							onPageChange={handlePageChange}
						/>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
