import React from 'react';
import { Link } from 'react-router-dom';

const ClientTable = ({
	clients,
	onDelete,
	onToggleStatus,
	loading,
	pagination,
	onPageChange,
}) => {
	if (loading) {
		return (
			<div className='flex justify-center py-8'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
			</div>
		);
	}

	if (clients.length === 0) {
		return (
			<div className='text-center py-8 text-gray-500'>
				<p>No clients found. Create one to get started!</p>
			</div>
		);
	}

	return (
		<>
			<div className='overflow-x-auto'>
				<table className='w-full border-collapse'>
					<thead className='bg-gray-100'>
						<tr>
							<th className='border border-gray-300 px-4 py-3 text-left'>
								Client Name
							</th>
							<th className='border border-gray-300 px-4 py-3 text-left'>
								Business Name
							</th>
							<th className='border border-gray-300 px-4 py-3 text-left'>
								Unique URL
							</th>
							<th className='border border-gray-300 px-4 py-3 text-left'>
								Status
							</th>
							<th className='border border-gray-300 px-4 py-3 text-center'>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{clients.map((client) => (
							<tr key={client._id} className='hover:bg-gray-50'>
								<td className='border border-gray-300 px-4 py-3'>
									{client.clientName}
								</td>
								<td className='border border-gray-300 px-4 py-3'>
									{client.businessName}
								</td>
								<td className='border border-gray-300 px-4 py-3'>
									<a
										href={`/${client.uniqueUrl}`}
										target='_blank'
										rel='noopener noreferrer'
										className='text-blue-500 hover:underline'>
										{client.uniqueUrl}
									</a>
								</td>
								<td className='border border-gray-300 px-4 py-3'>
									<button
										onClick={() => onToggleStatus(client._id)}
										className={`px-3 py-1 rounded text-white text-sm font-medium ${
											client.isActive
												? 'bg-green-500 hover:bg-green-600'
												: 'bg-red-500 hover:bg-red-600'
										}`}>
										{client.isActive ? 'Active' : 'Inactive'}
									</button>
								</td>
								<td className='border border-gray-300 px-4 py-3'>
									<div className='flex justify-center gap-2'>
										<Link
											to={`/admin/clients/edit/${client._id}`}
											className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm'>
											Edit
										</Link>
										<button
											onClick={() => onDelete(client._id)}
											className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm'>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{pagination && (
				<div className='flex justify-center items-center gap-2 mt-6'>
					<button
						onClick={() => onPageChange(pagination.page - 1)}
						disabled={pagination.page === 1}
						className='px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition'>
						Previous
					</button>
					<span className='text-gray-600'>
						Page {pagination.page} of {pagination.pages}
					</span>
					<button
						onClick={() => onPageChange(pagination.page + 1)}
						disabled={pagination.page >= pagination.pages}
						className='px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition'>
						Next
					</button>
				</div>
			)}
		</>
	);
};

export default ClientTable;
