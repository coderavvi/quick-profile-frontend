# QuickProfile - Quick Start Guide

## 5-Minute Setup

### Step 1: Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your MongoDB URI:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickprofile
JWT_SECRET=your_secret_key_here
```

### Step 2: Create First Admin User

```bash
node scripts/createAdmin.js admin@quickprofile.com password123
```

### Step 3: Start Backend

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Step 4: Frontend Setup (New Terminal)

```bash
cd frontend
npm install
```

Create `.env.local`:

```
REACT_APP_API_URL=https://quick-profile-backend.onrender.com/api
REACT_APP_BASE_URL=http://localhost:3000
```

> **Note:** `REACT_APP_API_URL` points to the production Render backend. For local development, change it to `http://localhost:5000/api` and ensure your local backend is running.

### Step 5: Start Frontend

```bash
npm start
```

Frontend runs on `http://localhost:3000`

## Access the Application

1. **Admin Dashboard:** http://localhost:3000/admin/login
   - Email: `admin@quickprofile.com`
   - Password: `password123`

2. **Create a Client:**
   - Click "Add New Client"
   - Fill in name and business details
   - Upload a PDF file
   - Submit

3. **View Public Profile:**
   - Copy the unique URL from dashboard
   - Visit http://localhost:3000/{unique-url}

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create cluster (shared free tier)
4. Create database access user
5. Whitelist your IP
6. Copy connection string
7. Replace in `.env`

## Deployment Checklist

### Before Deploying to Production:

- [ ] Change JWT_SECRET to secure random string
- [ ] Update CORS_ORIGINS to your frontend URL
- [ ] Set NODE_ENV=production
- [ ] Use strong MongoDB password
- [ ] Enable MongoDB IP whitelist for production IPs
- [ ] Test all features locally
- [ ] Create admin account for production
- [ ] Backup database before first deploy

**→ See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete step-by-step instructions**

### Deploy to Render (Backend):

1. Push to GitHub
2. Connect GitHub to Render
3. Create new Web Service
4. Select backend folder
5. Add environment variables (see DEPLOYMENT_GUIDE.md)
6. Deploy

### Deploy to Vercel (Frontend):

1. Push to GitHub
2. Import project to Vercel
3. Set `REACT_APP_API_URL` env variable to your backend API URL
4. Set `REACT_APP_BASE_URL` env variable to your production domain (e.g., `https://yourdomain.com`)
5. Deploy

## Development Tips

### Useful Commands

Backend:

```bash
npm run dev       # Start with nodemon
npm start        # Start production
```

Frontend:

```bash
npm start        # Start dev server
npm run build    # Create production build
npm test         # Run tests
```

### Database Debugging

Connect to MongoDB and run:

```javascript
// View all clients
db.clients.find();

// View all admins
db.admins.find();

// Delete all clients (careful!)
db.clients.deleteMany({});
```

### Common Issues

**Backend won't start:**

- Check port 5000 isn't in use
- Verify MongoDB connection string
- Check .env file exists

**Frontend can't reach backend:**

- Verify backend is running
- Check REACT_APP_API_URL
- Clear browser cache

**PDF uploads fail:**

- Check file size < 10MB
- Ensure it's a valid PDF
- Check /uploads folder exists

## Features Walkthrough

### Creating a Client

1. Login to admin dashboard
2. Click "Add New Client"
3. Enter client name and business name
4. Enter unique URL (auto-validated)
5. Upload PDF file
6. Submit

### Sharing Profile

1. Each client gets a unique URL
2. Share URL: `https://yourdomain.com/unique-url`
3. Public can view welcome page and PDF
4. No admin access needed

### Managing Clients

- **Edit:** Update all details except URL
- **Toggle Status:** Temporarily disable profile
- **Delete:** Remove client and PDF
- **Search:** Filter by name or URL

## File Upload Details

- **Max Size:** 10MB
- **Format:** PDF only
- **Storage:** /uploads folder (or cloud if configured)
- **Access:** Based on unique URL

## Security Notes

- Passwords hashed with bcryptjs
- JWT tokens valid for 7 days
- Protected admin routes require token
- CORS restricts to configured domains
- PDFs accessible only via unique URL

## Support

Need help? Check these:

1. Browser console for errors (F12)
2. Backend terminal for logs
3. MongoDB Atlas dashboard
4. Render/Vercel deployment logs

## Next Steps

After setup, try:

1. Create multiple clients
2. Test profile sharing
3. Configure for production
4. Deploy to Render/Vercel
5. Setup custom domain

Happy profiling! 🚀
