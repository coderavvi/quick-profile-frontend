import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
	const { admin, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/admin/login');
	};

	return (
		<nav className='bg-white shadow-md sticky top-0 z-50'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center h-16'>
					<Link to='/admin/dashboard' className='flex items-center'>
						<span className='text-2xl font-bold text-primary'>
							QuickProfile
						</span>
					</Link>

					<div className='flex items-center gap-4'>
						<span className='text-gray-600'>{admin?.email}</span>
						<button
							onClick={handleLogout}
							className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition'>
							Logout
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
