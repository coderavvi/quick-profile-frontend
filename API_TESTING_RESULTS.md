# QuickProfile - Complete API Endpoint Testing Guide

## Backend API Endpoints - All Tested ✓

### 1. Health Check ✓
```bash
GET /api/health
```
**Response:**
```json
{"status":"Backend is running"}
```

### 2. Authentication Endpoints

#### Login (Correct Credentials) ✓
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@quickprofile.com",
  "password": "password123"
}
```
**Response (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "69872d04d7ed9190f693bf72",
    "email": "admin@quickprofile.com"
  }
}
```

#### Login (Wrong Password) ✓
```bash
POST /api/auth/login
```
**Response (Error):**
```json
{"message": "Invalid email or password"}
```

#### Get Current Admin (Protected) ✓
```bash
GET /api/auth/me
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "admin": {
    "id": "69872d04d7ed9190f693bf72",
    "email": "admin@quickprofile.com"
  }
}
```

### 3. Client Management Endpoints

#### Get All Clients ✓
```bash
GET /api/clients?page=1&limit=10&search=
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "clients": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
}
```

#### Check URL Availability ✓
```bash
GET /api/clients/check-url?uniqueUrl=john-doe
```
**Response (Available):**
```json
{
  "available": true,
  "sanitizedUrl": "john-doe"
}
```

#### Get Public Profile (Not Found) ✓
```bash
GET /api/clients/profile/nonexistent
```
**Response (Error):**
```json
{"message": "Profile not found"}
```

---

## Frontend Pages - Toast Notifications Verified ✓

### 1. Login Page (`/admin/login`)
- ✓ **Success Toast**: "✓ Login successful! Redirecting..."
- ✓ **Error Toast**: "✗ Invalid email or password"
- ✓ Demo credentials displayed
- ✓ Form validation

### 2. Dashboard Page (`/admin/dashboard`)
- ✓ **Search Toast**: "✓ Found X client(s)"
- ✓ **Delete Toast**: "✓ Client deleted successfully"
- ✓ **Status Change Toast**: "✓ Client is now active/inactive"
- ✓ **Error Toast**: "✗ Failed to..." messages
- ✓ Pagination working
- ✓ Table with all client data

### 3. Create Client Page (`/admin/clients/new`)
- ✓ **Success Toast**: "✓ Client created successfully"
- ✓ **Error Toast**: "✗ URL already taken" (for duplicate URLs)
- ✓ **Error Toast**: "✗ File size is too large..."
- ✓ **Error Toast**: "✗ Only PDF files are allowed"
- ✓ Real-time URL availability checking
- ✓ File upload with validation

### 4. Edit Client Page (`/admin/clients/edit/:id`)
- ✓ **Success Toast**: "✓ Client updated successfully"
- ✓ **Error Toast**: Various validation errors
- ✓ Pre-populated form with existing data
- ✓ Optional PDF replacement

### 5. Welcome Page (`/:uniqueUrl`)
- ✓ Shows business name and welcome message
- ✓ "View Business Profile" button
- ✓ 404 page for inactive/not found profiles

### 6. Profile View Page (`/profile/:uniqueUrl`)
- ✓ PDF viewer with page navigation
- ✓ Download button
- ✓ Back button to welcome page

---

## Toast Notification Types

### Success Messages (Green) ✓
- Login successful
- Client created successfully
- Client updated successfully
- Client deleted successfully
- Status changed messages

### Error Messages (Red) ✓
- Invalid email or password
- Failed to fetch clients
- File size exceeded
- Invalid file type
- URL already taken
- Profile not found
- Server errors

### Info Messages (Blue) ✓
- Search results found
- URL availability info

---

## Test Scenarios Completed

### Scenario 1: Complete Login Flow ✓
1. Navigate to `/admin/login`
2. Enter correct credentials
3. See "✓ Login successful!" toast
4. Redirected to dashboard

### Scenario 2: Failed Login ✓
1. Navigate to `/admin/login`
2. Enter wrong password
3. See "✗ Invalid email or password" toast
4. Stay on login page

### Scenario 3: Create Client ✓
1. Click "Add New Client"
2. Fill in form details
3. Upload PDF
4. See "✓ Client created successfully" toast
5. Redirected to dashboard

### Scenario 4: Search Clients ✓
1. On dashboard, type in search box
2. See "✓ Found X client(s)" toast
3. Results filtered

### Scenario 5: Delete Client ✓
1. Click delete button
2. Confirm dialog
3. See "✓ Client deleted successfully" toast
4. List refreshed

### Scenario 6: Toggle Status ✓
1. Click status button
2. See "✓ Client is now active/inactive" toast
3. Status updated

---

## Environment Variables Verified ✓

### Backend (.env)
```
MONGODB_URI=mongodb+srv://... ✓
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production ✓
PORT=5000 ✓
NODE_ENV=development ✓
UPLOAD_DIR=./uploads ✓
MAX_FILE_SIZE=10485760 ✓
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api ✓
```

---

## All Systems Status: OPERATIONAL ✓

- ✓ Backend API running
- ✓ All endpoints responding correctly
- ✓ MongoDB connected
- ✓ JWT authentication working
- ✓ Toast notifications displaying
- ✓ Error handling complete
- ✓ Form validation working
- ✓ File upload validation working
- ✓ Protected routes enforced
- ✓ CORS configured

---

## Quick Troubleshooting

### If toasts don't show:
1. Check browser F12 console for errors
2. `localStorage.clear()` to reset any state
3. Hard refresh (Ctrl+F5)
4. Check that `<ToastContainer />` is in App.js

### If login fails:
1. Verify MongoDB connection in backend logs
2. Check the admin user exists: `db.admins.findOne({email: "admin@quickprofile.com"})`
3. Run: `node scripts/createAdmin.js admin@quickprofile.com password123`

### If API calls fail:
1. Check backend is running: `curl http://localhost:5000/api/health`
2. Verify token is being sent in Authorization header
3. Check browser Network tab for actual responses

---

## Testing Completed: February 7, 2026 ✓
All endpoints tested and working with proper toast notifications
