# QuickProfile - Business Profile Manager

A full-stack application for creating, managing, and sharing business profiles with unique URLs. Built with React, Express, and MongoDB.

## Features

✨ **Admin Dashboard**

- Login with JWT authentication
- Create, read, update, and delete client profiles
- Toggle client active/inactive status
- Search and paginate through clients
- Real-time URL availability checking

📄 **PDF Management**

- Upload PDF business profiles
- PDF file type and size validation
- Store PDFs securely on the server

🌐 **Public Profile Pages**

- Welcome landing page for each client
- PDF viewer with navigation
- Download PDF option
- Share unique URLs

🔒 **Security**

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected admin routes
- CORS configuration

📱 **Responsive Design**

- Mobile-friendly interface
- Tailwind CSS styling
- Accessible components

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer
- **Validation**: express-validator

### Frontend

- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **PDF Viewer**: react-pdf
- **Styling**: Tailwind CSS
- **Notifications**: react-toastify

## Project Structure

```
QuickProfile/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── multer.js             # File upload config
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   └── clientController.js   # Client CRUD logic
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── errorHandler.js       # Error handling
│   ├── models/
│   │   ├── Admin.js              # Admin schema
│   │   └── Client.js             # Client schema
│   ├── routes/
│   │   ├── auth.js               # Auth endpoints
│   │   └── clients.js            # Client endpoints
│   ├── uploads/                  # PDF storage
│   ├── server.js                 # Express app entry
│   ├── package.json
│   ├── .env.example
│   └── render.yaml               # Render deployment
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ClientForm.js     # Form component
│   │   │   ├── ClientTable.js    # Table component
│   │   │   ├── Navbar.js         # Navigation
│   │   │   ├── PDFViewer.js      # PDF display
│   │   │   └── ProtectedRoute.js # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.js    # Auth state
│   │   ├── pages/
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Dashboard.js      # Client management
│   │   │   ├── CreateClient.js   # Create page
│   │   │   ├── EditClient.js     # Edit page
│   │   │   ├── Welcome.js        # Public welcome
│   │   │   └── ProfileView.js    # PDF view
│   │   ├── utils/
│   │   │   └── api.js            # Axios instance
│   │   ├── App.js                # Main app
│   │   ├── index.js              # Entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json               # Vercel deployment
│   └── .env.example
│
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account
- Render account (for backend)
- Vercel account (for frontend)

### Backend Setup

1. **Clone and navigate to backend:**

   ```bash
   cd QuickProfile/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env` file:**

   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your values:**

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickprofile
   JWT_SECRET=your_very_secure_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the server:**

   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend:**

   ```bash
   cd QuickProfile/frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env.local` file:**

   ```bash
   cp .env.example .env.local
   ```

4. **Update `.env.local` (for development):**

   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start the development server:**

   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration (optional)
- `GET /api/auth/me` - Get current admin (protected)

### Clients (Protected routes require JWT token)

- `POST /api/clients` - Create client (multipart form: pdf file required)
- `GET /api/clients` - Get all clients (with pagination & search)
  - Query params: `page`, `limit`, `search`
- `GET /api/clients/:id` - Get single client
- `PUT /api/clients/:id` - Update client (multipart form: pdf optional)
- `PATCH /api/clients/:id/status` - Toggle client status
- `DELETE /api/clients/:id` - Delete client

### Public Routes

- `GET /api/clients/profile/:uniqueUrl` - Get public profile
- `GET /api/clients/check-url` - Check URL availability
  - Query param: `uniqueUrl`

## Usage

### Admin Dashboard

1. **Login**
   - Navigate to `/admin/login`
   - Demo credentials (setup these in MongoDB):
     - Email: `admin@quickprofile.com`
     - Password: `password123`

2. **Create Client**
   - Click "Add New Client"
   - Fill in client name, business name
   - Enter unique URL and upload PDF
   - System checks URL availability in real-time
   - Submit to create

3. **Manage Clients**
   - View all clients in the dashboard
   - Search by name or URL
   - Toggle active/inactive status
   - Edit client details
   - Delete clients

### Public Profiles

1. **Access Profile**
   - Navigate to `/:uniqueUrl` (e.g., `/john-doe`)
   - See welcome page with business information

2. **View PDF**
   - Click "View Business Profile"
   - PDF viewer with page navigation
   - Download PDF option available

## Deployment

### Backend (Render)

1. **Create Render account and connect GitHub**

2. **Create new Web Service:**
   - Connect your GitHub repository
   - Select backend directory
   - Set environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `NODE_ENV=production`

3. **Configure disk (for file uploads):**
   - Add persistent disk (1GB)
   - Mount path: `/opt/render/project/src/uploads`

4. **Deploy:**
   - Render will automatically deploy on git push
   - Backend URL will be: `https://your-service-name.onrender.com`

### Frontend (Vercel)

1. **Create Vercel account and connect GitHub**

2. **Import project:**
   - Select frontend directory
   - Set environment variables:
     - `REACT_APP_API_URL=https://your-backend-url/api`

3. **Deploy:**
   - Vercel handles continuous deployment
   - Frontend URL will be provided

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong JWT secrets
   - Keep MongoDB credentials private

2. **Authentication:**
   - Passwords are hashed with bcryptjs (10 salt rounds)
   - JWT tokens expire in 7 days
   - Protected routes require valid token

3. **File Uploads:**
   - Only PDF files allowed
   - Maximum file size: 10MB
   - Files stored in `/uploads` directory

4. **CORS:**
   - Configured for production domains
   - Restrict to your frontend URL in production

## Environment Variables

### Backend (.env)

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/quickprofile
JWT_SECRET=your_super_secret_key
PORT=5000
NODE_ENV=production
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

### Frontend (.env.local)

```
REACT_APP_API_URL=https://your-backend-url/api
```

## Error Handling

- **401 Unauthorized:** Invalid or missing authentication token
- **400 Bad Request:** Validation error (invalid input, duplicate URL, etc.)
- **404 Not Found:** Resource doesn't exist or inactive profile
- **500 Server Error:** Internal server error

## Features by Page

### Admin Pages

- **Login** (`/admin/login`): Email/password authentication
- **Dashboard** (`/admin/dashboard`): View, search, and manage clients
- **Create Client** (`/admin/clients/new`): Add new client with PDF
- **Edit Client** (`/admin/clients/edit/:id`): Update client details

### Public Pages

- **Welcome** (`/:uniqueUrl`): Client introduction page
- **Profile View** (`/profile/:uniqueUrl`): PDF viewer

## Troubleshooting

### Backend Issues

**Port already in use:**

```bash
# Change PORT in .env or use:
kill -9 $(lsof -t -i :5000)
```

**MongoDB connection error:**

- Check MONGODB_URI is correct
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify database name matches

**File upload fails:**

- Check `/uploads` directory exists
- Ensure file is actually PDF
- Verify file size < 10MB

### Frontend Issues

**API calls fail:**

- Verify backend is running
- Check `REACT_APP_API_URL` in `.env.local`
- Clear browser cache and localStorage

**PDF not loading:**

- Check PDF URL is correct
- Verify backend serving uploads correctly
- Check browser console for errors

**Authentication issues:**

- Clear localStorage: `localStorage.clear()`
- Check token hasn't expired
- Verify admin exists in MongoDB

## Database Setup

### Create Admin User (via MongoDB)

```javascript
db.admins.insertOne({
	email: 'admin@quickprofile.com',
	password: '<bcrypt_hashed_password>',
});
```

Or use the registration endpoint to create admin:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@quickprofile.com",
    "password": "password123"
  }'
```

## Performance Optimization

1. **Frontend:**
   - React code splitting with lazy loading
   - PDF pagination to reduce memory
   - Image optimization

2. **Backend:**
   - MongoDB indexing on uniqueUrl
   - Pagination for large client lists
   - Caching with appropriate headers

## Future Enhancements

- [ ] Cloud storage integration (AWS S3, Cloudinary)
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Custom branding for public profiles
- [ ] Multiple admin accounts
- [ ] Profile analytics/view tracking
- [ ] Social media integration
- [ ] Contact form on profiles

## License

MIT

## Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using React, Express, and MongoDB**
