# QuickProfile - Operations & Maintenance Guide

## 📋 Table of Contents
1. [Daily Operations](#daily-operations)
2. [Common Tasks](#common-tasks)
3. [Troubleshooting](#troubleshooting)
4. [Performance Monitoring](#performance-monitoring)
5. [Security Checklist](#security-checklist)
6. [Backup & Recovery](#backup--recovery)
7. [Updates & Dependencies](#updates--dependencies)

---

## 🔄 Daily Operations

### Starting Development Environment

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
# Expected output: "Server running on port 5000"
# "MongoDB connected"
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
# Expected output: "Compiled successfully!"
# "Listening on port 3000"
```

**Verify System:**
```bash
# Check backend health
curl http://localhost:5000/api/health

# Expected response:
# {"status":"Backend is running"}

# Open browser to frontend
# http://localhost:3000/admin/login
```

### Stopping Services

```bash
# In each terminal, press Ctrl+C
# Wait for graceful shutdown message
```

---

## 🛠️ Common Tasks

### Create Admin User

If you need a new admin account (only one needed for demo):

```bash
# Connect to MongoDB and insert:
db.admins.insertOne({
  email: "neoadmin@quickprofile.com",
  password: <bcryptjs hashed password>,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use the existing: `admin@quickprofile.com` / `password123`

### View Database

**MongoDB Atlas Web:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Login to your account
3. Navigate to your cluster
4. Click "Collections"
5. View `admins` and `clients` collections

**MongoDB CLI (if installed):**
```bash
mongosh "<your-mongodb-uri>"
use quickprofile
db.clients.find()
db.admins.find()
```

### Reset Database

**Warning: This deletes all data!**

```bash
# Using MongoDB Atlas:
# 1. Go to cluster
# 2. Click "..." menu
# 3. Select "Load Sample Dataset" or delete collections manually

# Or use mongosh:
mongosh "<your-mongodb-uri>"
use quickprofile
db.dropDatabase()
```

### Add Test Data

```javascript
// Using MongoDB compass or Atlas:
// Insert to 'clients' collection:
[
  {
    clientName: "John Doe",
    businessName: "Doe Consulting",
    uniqueUrl: "john-doe",
    pdfUrl: "/uploads/pdf-john-doe-1707340800000.pdf",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clientName: "Jane Smith",
    businessName: "Smith Design Co",
    uniqueUrl: "jane-smith",
    pdfUrl: "/uploads/pdf-jane-smith-1707340800001.pdf",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]
```

---

## 🔧 Troubleshooting

### Backend Issues

**Backend won't start:**
```bash
# Check port 5000 is available
lsof -i :5000
# Kill process if needed
kill -9 <PID>

# Check Node version
node --version  # Should be 14+

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**MongoDB connection failing:**
```bash
# 1. Check URI in .env
cat .env | grep MONGODB_URI

# 2. Test URI directly
mongosh "<your-uri-here>"

# 3. Check firewall/IP whitelist in MongoDB Atlas
# Go to Network Access → IP Whitelist
# Add your IP address (or 0.0.0.0 for anywhere - development only!)
```

**JWT errors:**
```bash
# 1. Verify JWT_SECRET in .env
cat .env | grep JWT_SECRET

# 2. Check token in request
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/auth/me

# 3. Generate new token (login again)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@quickprofile.com","password":"password123"}'
```

**File upload failing:**
```bash
# 1. Check /uploads directory exists
ls -la backend/uploads

# 2. Check permissions
chmod 755 backend/uploads

# 3. Verify multer config
cat backend/config/multer.js

# 4. Test file size
ls -lh <pdf-file>  # Should be < 10MB
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

**Node modules error:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

**Environment variables not loading:**
```bash
# 1. Stop frontend (Ctrl+C)
# 2. Verify .env.local exists
ls -la frontend/.env.local

# 3. Check content
cat frontend/.env.local
# Should contain: REACT_APP_API_URL=...

# 4. Restart frontend
npm start
# It will print env vars on startup
```

**Login fails after successful credentials:**
```bash
# 1. Check browser console for errors
# Open DevTools → Console tab

# 2. Check network requests
# Open DevTools → Network tab
# Look for POST /api/auth/login request
# Check response status and message

# 3. Verify token storage
# In browser console:
localStorage.getItem('token')

# 4. Check API URL
# In browser console:
console.log(process.env.REACT_APP_API_URL)
```

**PDF not displaying:**
```bash
# 1. Check file exists in backend
ls -la backend/uploads/

# 2. Verify file is valid PDF
file backend/uploads/pdf-*.pdf

# 3. Check browser console for PDF.js errors
# Open DevTools → Console tab

# 4. Test PDF endpoint directly
curl http://localhost:5000/uploads/pdf-filename.pdf
# Should download the file, not show error
```

### Network Issues

**CORS errors:**
```bash
# Check origin is allowed in backend
cat backend/server.js | grep -A5 "cors"

# Update if needed - look for corsOptions object
# Development should allow localhost:3000

# Restart backend after changes
```

**Timeout errors:**
```bash
# 1. Check backend is running
curl http://localhost:5000/api/health

# 2. Check network connectivity
ping localhost

# 3. Check firewall not blocking port
sudo ufw status

# 4. Check API response time
time curl http://localhost:5000/api/health
```

---

## 📊 Performance Monitoring

### Backend Performance

**Check response times:**
```bash
# Test endpoint speed
for i in {1..5}; do
  time curl -s http://localhost:5000/api/clients \
    -H "Authorization: Bearer <token>" > /dev/null
done
```

**Expected times:**
- Health check: <10ms
- Login: 50-100ms
- Get clients: 20-50ms
- Create client: 100-200ms (with file)

### Frontend Performance

**Browser DevTools:**
1. Open DevTools (F12)
2. Go to Performance tab
3. Record page load
4. Check metrics:
   - First Contentful Paint (FCP): <1s
   - Largest Contentful Paint (LCP): <2.5s
   - Cumulative Layout Shift (CLS): <0.1

### Database Performance

**Check index usage:**
```bash
# MongoDB atlas → Metrics → Slow queries
# Look for:
# - Created clients: uniqueUrl should be indexed
# - Logins: email should be indexed
# - Queries: < 200ms average
```

**Optimize queries:**
```bash
# In MongoDB atlas, check indexes
# Expected indexes:
# - _id (default)
# - email (for admin)
# - uniqueUrl (for clients)
```

---

## 🔒 Security Checklist

### Before Production

- ✅ Change admin password from default
- ✅ Set strong JWT_SECRET (40+ random characters)
- ✅ Update MongoDB URI to production database
- ✅ Enable MongoDB IP whitelist (not 0.0.0.0)
- ✅ Set NODE_ENV=production
- ✅ Enable HTTPS on frontend
- ✅ Verify CORS origins specific (not *)
- ✅ Setup SSL certificate for backend
- ✅ Enable backup for MongoDB
- ✅ Setup application logging
- ✅ Configure error tracking (Sentry)
- ✅ Implement rate limiting
- ✅ Setup DDoS protection (Cloudflare)

### Weekly Security Tasks

- [ ] Review MongoDB access logs
- [ ] Check for failed login attempts
- [ ] Verify file upload integrity
- [ ] Review environment variables
- [ ] Check dependency vulnerabilities
  ```bash
  npm audit
  ```

### Monthly Security Tasks

- [ ] Update dependencies
  ```bash
  npm update
  ```
- [ ] Review and rotate JWT_SECRET (if possible)
- [ ] Check MongoDB backups were successful
- [ ] Review security logs
- [ ] Update admin password

---

## 💾 Backup & Recovery

### MongoDB Backup

**Automated Backup (MongoDB Atlas):**
1. Go to MongoDB Atlas
2. Cluster → Backup → Enable Backup
3. Set backup frequency (daily recommended)
4. Backups stored for 35 days

**Manual Backup:**
```bash
# Export all data
mongodump --uri="<your-mongodb-uri>" --out ./backup/$(date +%Y%m%d)

# Verify backup
ls -la backup/
```

### File Backup

**Backup Uploads:**
```bash
# Backup PDF uploads
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz backend/uploads/

# Store somewhere safe (S3, Google Drive, etc.)
```

### Full System Backup

**Backup script:**
```bash
#!/bin/bash
BACKUP_DIR="/backups/quickprofile-$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup files
cp -r backend $BACKUP_DIR/
cp -r frontend $BACKUP_DIR/

# Backup database
mongodump --uri="<uri>" --out $BACKUP_DIR/database

# Compress
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR

echo "Backup completed: $BACKUP_DIR.tar.gz"
```

### Recovery Procedure

**If database lost:**
```bash
# 1. Restore from MongoDB backup
mongorestore --uri="<uri>" ./backup/<date>/database

# 2. Verify data
mongosh "<uri>"
use quickprofile
db.clients.count()
db.admins.count()
```

**If files lost:**
```bash
# 1. Restore from backup
tar -xzf uploads-backup-YYYYMMDD.tar.gz
cp -r backup/uploads/* backend/uploads/

# 2. Restart backend
```

---

## 📦 Updates & Dependencies

### Check for Updates

```bash
# Backend
cd backend
npm outdated

# Frontend
cd frontend
npm outdated
```

### Update Dependencies (Safe)

```bash
# Update patch versions (bug fixes)
npm update

# Check what changed
npm list
```

### Major Updates (Requires Testing)

```bash
# Check for major updates
npm outdated

# Update specific package
npm install package@latest

# Test thoroughly
npm start  # or npm run dev
```

### Security Updates

```bash
# Check vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Manual fix if needed
npm install <package>@latest
```

### Dependency Versions

**Current Stack (Tested & Working):**

Backend:
- express: 4.18.2
- mongoose: 7.0.0
- jsonwebtoken: 9.0.0
- bcryptjs: 2.4.3
- multer: 1.4.5-lts.1

Frontend:
- react: 18.2.0
- react-router: 6.8.0
- axios: 1.3.2
- react-toastify: 9.1.2
- react-pdf: 7.3.0

### Before Updating

1. Commit current code
   ```bash
   git add .
   git commit -m "Before dependency update"
   ```

2. Create backup
   ```bash
   tar -czf backup-$(date +%Y%m%d).tar.gz .
   ```

3. Test after update
   ```bash
   npm start
   # Run through all features manually
   ```

4. If broken, rollback
   ```bash
   git checkout package-lock.json
   npm install
   ```

---

## 🚀 Deployment Operations

### Before Deploying

**Checklist:**
- ✅ All tests passing
- ✅ No console errors
- ✅ Environment variables set
- ✅ Code committed to git
- ✅ Database ready
- ✅ Security review done
- ✅ Documentation updated

### Deploy Backend (Render)

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to production"
git push origin main

# 2. Render auto-deploys from main branch
# Monitor at: https://dashboard.render.com

# 3. Verify deployment
curl https://<your-render-url>/api/health
```

### Deploy Frontend (Vercel)

```bash
# 1. Push to GitHub
git push origin main

# 2. Vercel auto-deploys
# Monitor at: https://vercel.com/dashboard

# 3. Verify deployment
# Visit: https://<your-app>.vercel.app/admin/login
```

### Post-Deployment Verification

```bash
# 1. Test login
# Visit deployed frontend
# Login with credentials

# 2. Test client operations
# Create a test client
# Edit it
# Delete it

# 3. Test public profile
# Visit public profile with URL

# 4. Monitor logs
# Backend: Render → Logs
# Frontend: Vercel → Deployment logs
```

---

## 📞 Support Resources

### Error Messages Guide

| Error | Cause | Solution |
|-------|-------|----------|
| ECONNREFUSED | Backend not running | Start backend with `npm run dev` |
| MongoServerError: connect ECONNREFUSED | MongoDB not reachable | Check URI and IP whitelist |
| JWT malformed | Invalid or expired token | Login again to get new token |
| CORS error | Backend origin not allowed | Check CORS config in backend |
| File too large | PDF > 10MB | Compress PDF or increase limit |
| ENOENT: no such file | Upload directory missing | Create `backend/uploads` directory |
| ERR_MODULE_NOT_FOUND | Dependencies missing | Run `npm install` |
| 404 not found | Route doesn't exist | Check API endpoint path |
| 500 server error | Backend crash | Check backend console logs |
| Token stored but won't send | localStorage issue | Clear browser cache, login again |

### Debug Mode

**Frontend:**
```javascript
// Add to src/utils/api.js for extra logging
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

**Backend:**
```javascript
// Add to server.js for request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Log Locations

**Backend:**
- Console output on startup
- Error messages in terminal
- MongoDB logs in Atlas

**Frontend:**
- Browser DevTools Console
- Network tab for API calls
- Application tab for localStorage

**Deployment:**
- Render Dashboard → Logs (backend)
- Vercel Dashboard → Deployments → Logs (frontend)

---

## 📅 Maintenance Schedule

### Daily
- Check for error notifications
- Monitor application usage
- Test basic functionality

### Weekly
- Review logs
- Check for dependency updates
- Test backup restoration

### Monthly
- Update dependencies
- Review security logs
- Optimize database
- Plan improvements

### Quarterly
- Full security audit
- Performance review
- Feature planning
- User feedback review

---

**Last Updated:** February 7, 2026  
**Version:** 1.0.0  
**Status:** Production Ready
