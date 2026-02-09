import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			await login(email, password);
			toast.success('✓ Login successful! Redirecting...');
			setTimeout(() => navigate('/admin/dashboard'), 500);
		} catch (error) {
			toast.error('✗ ' + (error.message || 'Login failed'));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-600'>
			<div className='bg-white rounded-lg shadow-xl p-8 w-full max-w-md'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-primary mb-2'>QuickProfile</h1>
					<p className='text-gray-600'>Admin Dashboard</p>
				</div>

				<form onSubmit={handleSubmit} className='space-y-6'>
					<div>
						<label className='block text-gray-700 font-medium mb-2'>
							Email Address
						</label>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
							placeholder='your@email.com'
							required
						/>
					</div>

					<div>
						<label className='block text-gray-700 font-medium mb-2'>
							Password
						</label>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
							placeholder='Enter your password'
							required
						/>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full py-2 bg-primary text-white font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50'>
						{loading ? 'Logging in...' : 'Login'}
					</button>
				</form>

				<div className='mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-600'>
					<p>
						<strong>Demo Credentials:</strong>
					</p>
					<p>Email: admin@quickprofile.com</p>
					<p>Password: password123</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
