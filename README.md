# Career Hub - Dynamic Job Board Platform

A modern, full-stack job board platform where you can post job openings, internships, and startup opportunities for both fresh graduates and experienced professionals. The platform includes an admin panel for easy content management and email integration for contact forms.

## 🚀 Features

### For Job Seekers
- **Browse Opportunities**: View job openings, internships, and startup opportunities
- **Filter by Category**: Filter by job type (job, internship, startup)
- **Experience Level Filtering**: Find opportunities suitable for freshers, experienced professionals, or all levels
- **Contact Form**: Get in touch with the platform administrators
- **Newsletter Subscription**: Stay updated with the latest opportunities

### For Administrators
- **Admin Panel**: Complete CRUD operations for job posts
- **Easy Posting**: Create, edit, and delete job opportunities through a user-friendly interface
- **Email Integration**: Receive contact form submissions and newsletter subscriptions via email
- **Real-time Updates**: Changes reflect immediately on the website

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **Nodemailer** for email functionality
- **CORS** for cross-origin requests
- **Helmet** for security
- **Rate limiting** for API protection

### Database
- **JSON file-based storage** (easily replaceable with any database)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose (for easy deployment)
- Gmail account with App Password (for email functionality)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-hub
   ```

2. **Run the deployment script**
   ```bash
   # On Windows
   deploy.bat
   
   # On Linux/Mac
   ./deploy.sh
   ```

3. **Configure email settings**
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate an app password
   - Update `EMAIL_PASS` in the `.env` file
   - Restart the backend: `docker-compose restart backend`

### Manual Setup

#### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your email credentials
npm start
```

#### Frontend Setup
```bash
npm install
cp env.example .env
# Edit .env with your API URL
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
EMAIL_USER=sakshee907@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Email Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password
   - Use this password in the `EMAIL_PASS` environment variable

## 📱 Usage

### For Administrators

1. **Access Admin Panel**
   - Navigate to `http://localhost:3000/admin`
   - Create, edit, and delete job posts

2. **Creating a New Post**
   - Click "Add New Post"
   - Fill in all required fields
   - Select category (job, internship, startup)
   - Add tags (comma-separated)
   - Set experience level and other details
   - Click "Create Post"

3. **Managing Posts**
   - View all posts in the admin panel
   - Edit posts by clicking the edit button
   - Delete posts with confirmation dialog

### For Visitors

1. **Browse Opportunities**
   - Visit the homepage to see all opportunities
   - Use category filters to narrow down results
   - Click on posts to view details

2. **Contact Form**
   - Click "Contact" in the header
   - Fill out the contact form
   - Messages are sent to the configured email

3. **Newsletter Subscription**
   - Scroll to the footer
   - Enter your email address
   - Click "Subscribe"

## 🚀 Deployment

### Using Docker (Recommended)
The included Docker setup makes deployment easy:

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs

# Stop services
docker-compose down
```

### Manual Deployment

#### Backend Deployment
1. Set up a Node.js server
2. Install dependencies: `npm install --production`
3. Set environment variables
4. Start the server: `npm start`

#### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to any static hosting service
3. Update `VITE_API_URL` to point to your backend

### Production Considerations
- Use a proper database (PostgreSQL, MongoDB, etc.) instead of JSON files
- Set up SSL certificates for HTTPS
- Configure proper CORS settings
- Use environment-specific configurations
- Set up monitoring and logging

## 📧 Email Features

The platform includes comprehensive email functionality:

- **Contact Form**: Visitors can send messages directly to the admin email
- **Newsletter Subscriptions**: Email notifications for new subscribers
- **Rate Limiting**: Prevents spam with built-in rate limiting
- **Professional Templates**: Clean, professional email templates

## 🔒 Security Features

- **Rate Limiting**: API endpoints are protected with rate limiting
- **CORS Protection**: Proper CORS configuration
- **Input Validation**: All inputs are validated
- **Security Headers**: Helmet.js for security headers
- **Email Rate Limiting**: Separate rate limiting for email endpoints

## 🎨 Customization

### Styling
- Modify `src/index.css` for global styles
- Update component styles in individual files
- Customize the color scheme in `tailwind.config.ts`

### Content
- Update the hero section in `src/components/Hero.tsx`
- Modify the header navigation in `src/components/Header.tsx`
- Customize the footer in `src/pages/Index.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: sakshee907@gmail.com
- Create an issue in the repository

## 🔄 Updates

### Version 1.0.0
- Initial release with full CRUD functionality
- Admin panel for content management
- Email integration
- Responsive design
- Docker deployment support

---

**Built with ❤️ for the career community**