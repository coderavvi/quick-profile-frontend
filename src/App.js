import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateClient from './pages/CreateClient';
import EditClient from './pages/EditClient';
import ProfileView from './pages/ProfileView';

// Styles
import './index.css';

function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					{/* Public Routes */}
					<Route path='/:uniqueUrl' element={<ProfileView />} />

					{/* Admin Routes */}
					<Route path='/admin/login' element={<Login />} />
					<Route
						path='/admin/dashboard'
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/admin/clients/new'
						element={
							<ProtectedRoute>
								<CreateClient />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/admin/clients/edit/:id'
						element={
							<ProtectedRoute>
								<EditClient />
							</ProtectedRoute>
						}
					/>

					{/* Default redirect */}
					<Route path='/' element={<Navigate to='/admin/login' replace />} />
				</Routes>

				<ToastContainer
					position='bottom-right'
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</AuthProvider>
		</Router>
	);
}

export default App;
