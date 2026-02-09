import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [admin, setAdmin] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Check if token exists on mount
		const token = localStorage.getItem('token');
		if (token) {
			// Optionally verify token with backend
			api
				.get('/auth/me')
				.then((response) => {
					setAdmin(response.data.admin);
				})
				.catch((error) => {
					localStorage.removeItem('token');
					setAdmin(null);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, []);

	const login = async (email, password) => {
		try {
			setError(null);
			const response = await api.post('/auth/login', { email, password });
			const { token, admin } = response.data;

			localStorage.setItem('token', token);
			setAdmin(admin);
			return admin;
		} catch (err) {
			const message = err.response?.data?.message || 'Login failed';
			setError(message);
			throw new Error(message);
		}
	};

	const logout = () => {
		localStorage.removeItem('token');
		setAdmin(null);
	};

	const isAuthenticated = !!admin;

	return (
		<AuthContext.Provider
			value={{
				admin,
				loading,
				error,
				login,
				logout,
				isAuthenticated,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};
