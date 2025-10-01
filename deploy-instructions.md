# Deployment Instructions

## Option 1: Netlify (Recommended for Frontend)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login
   - Drag and drop the `dist` folder to deploy
   - Or connect your GitHub repository for automatic deployments

3. **Set Environment Variables:**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

## Option 2: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables:**
   - In Vercel dashboard, go to Project settings > Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

## Option 3: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Go to [railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Select the backend folder**
4. **Set environment variables:**
   - `EMAIL_USER` = `sakshee907@gmail.com`
   - `EMAIL_PASS` = `your_gmail_app_password`
   - `PORT` = `5000`

### Option 2: Heroku

1. **Install Heroku CLI**
2. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set EMAIL_USER=sakshee907@gmail.com
   heroku config:set EMAIL_PASS=your_gmail_app_password
   ```

4. **Deploy:**
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option 3: Render

1. **Go to [render.com](https://render.com)**
2. **Create new Web Service**
3. **Connect your repository**
4. **Set build command:** `cd backend && npm install`
5. **Set start command:** `cd backend && npm start`
6. **Set environment variables**

## Quick Local Testing

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Access:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Admin Panel: http://localhost:3000/admin

## Email Configuration

1. **Enable 2-Factor Authentication on Gmail**
2. **Generate App Password:**
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password
3. **Use the app password in EMAIL_PASS environment variable**

## Current Status

✅ Frontend built successfully
✅ Backend API created
✅ Admin panel implemented
✅ Email integration ready
✅ Docker configuration ready
✅ Deployment files created

## Next Steps

1. Choose a deployment platform
2. Deploy the backend first
3. Update the frontend's VITE_API_URL
4. Deploy the frontend
5. Configure email settings
6. Test all functionality



