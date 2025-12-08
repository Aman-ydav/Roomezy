<p align="center">
  <img src="https://roomezy.vercel.app/logo.png" width="60" />
</p>
<h1 align="center">R&nbsp;O&nbsp;O&nbsp;M&nbsp;E&nbsp;Z&nbsp;Y</h1>

**Roomezy** is a modern, fast, and trustworthy platform designed to help students and working professionals find rooms, PGs (Paying Guest accommodations), hostels, and flatmates with ease. Built with a focus on user experience, Roomezy offers verified listings, real-time chat, photo-based feeds, and seamless interactions to make finding the perfect living space simple and secure.

## 🎯 Our Mission & Vision

### The Problem We Solve
It all started in college WhatsApp groups — endless messages like 'Need a room near campus' or 'Looking for a roommate who doesn't smoke.' The chaos, the confusion, the uncertainty… something had to change. Traditional rental platforms were impersonal, expensive, and lacked the human touch needed for shared living decisions.

### Our Vision
We wanted Roomezy to be more than a listing app — a trusted space where people could match based on habits, lifestyle, and comfort. A platform that values people, not just properties. Where safety, clarity, and community come first.

### The Solution
Every feature — from filters to chat to verification — was built based on real user problems. Roomezy was shaped by community stories and powered by modern web technologies. From beta feedback to real users finding their roommates — Roomezy grew into a community. A place where safety, clarity, and comfort lead the experience.

### Our Core Values
- **Trust First**: Verified listings and transparent communication
- **Community Driven**: Built by users, for users
- **Safety Focused**: Prioritizing secure interactions and background checks
- **Inclusive**: Welcoming all lifestyles and preferences
- **Innovation**: Leveraging technology to solve real-world problems

### Impact & Growth
Roomezy represents the evolution of roommate finding — from chaotic group chats to a structured, safe, and efficient platform. We've helped thousands connect with compatible roommates and find their perfect living spaces, creating lasting friendships and communities along the way.

## 🚀 Features

- **Verified Listings**: Browse rooms, PGs, and hostels with verified details and photos.
- **Flatmate Matching**: Connect with potential roommates based on preferences and profiles.
- **Real-Time Chat**: Integrated messaging system for instant communication.
- **Photo-Based Feed**: Visual discovery of listings with high-quality images.
- **Save & Bookmark**: Keep track of favorite listings for later.
- **User Profiles**: Create detailed profiles to showcase yourself or your property.
- **PWA Support**: Install as a Progressive Web App for mobile-like experience.
- **Google Authentication**: Secure login with Google OAuth.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Dark/Light Theme**: Toggle between themes for better usability.

## 📋 How It Works

### Understanding Post Types
Roomezy uses three simple post types to help you find exactly what you're looking for:

1. **"Room Available" Posts** (🏠):
   - Posted by owners who have a room to rent or roommates seeking someone to share their space.
   - These are direct room listings with details like rent, location, photos, and amenities.
   - Perfect for finding actual available rooms.

2. **"Looking for Roommate" Posts** (👥):
   - Posted by people who already have a room and want someone to share rent with.
   - Great for budget-friendly options and building instant connections.
   - These posts help you join existing shared living arrangements.

3. **"Looking for Room" Posts** (👤):
   - Posted by room seekers who need accommodation.
   - Owners and roommate-seekers can contact them if they have availability.
   - These posts do NOT list rooms — they're for finding potential roommates or tenants.

### Getting Started Guide

#### For Room Seekers:
1. **Create Your Account**: Sign up with email, add your details, and multiple locations for flexible searching.
2. **Browse Posts**: Use filters to find "Room Available" or "Looking for Roommate" posts that match your preferences.
3. **Connect Safely**: Reach out politely, ask important questions, and schedule viewings.
4. **Verify Details**: Always meet in public places and trust your instincts.

#### For Room Owners/Roommates:
1. **List Your Space**: Choose the right post type and provide accurate details.
2. **Add Quality Photos**: High-quality images increase response rates significantly.
3. **Be Transparent**: Include all costs, rules, and preferences upfront.
4. **Screen Applicants**: Ask relevant questions and meet potential roommates in person.

### Account Management
- **Dashboard**: Manage all your posts, edit details, toggle visibility, and track interactions.
- **Profile Settings**: Update personal info, add multiple locations, and set preferences.
- **Post Status**: Toggle posts between active, archived, or hidden as needed.
- **Privacy Controls**: Control what information is visible to other users.

### Safety & Best Practices
- **Verify Information**: Always cross-check details provided by other users.
- **Meet in Public**: Schedule initial meetings in safe, public locations.
- **Trust Your Judgment**: If something feels off, don't proceed.
- **Report Issues**: Use our reporting system for suspicious activity.
- **Secure Communication**: Use our platform's messaging for initial contact.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.1.1 with Vite for fast development and building.
- **State Management**: Redux Toolkit for predictable state management.
- **Styling**: Tailwind CSS with custom components via shadcn/ui.
- **Routing**: React Router DOM for client-side navigation.
- **Real-Time Communication**: Socket.IO Client for chat functionality.
- **Animations**: Framer Motion for smooth UI transitions.
- **Icons**: Lucide React for consistent iconography.
- **Forms & UI**: Radix UI components for accessible interfaces.
- **HTTP Client**: Axios with interceptors for API calls.
- **Notifications**: React Hot Toast and Sonner for user feedback.
- **Build Tools**: ESLint for code quality, Vite for bundling.

### Backend
- **Runtime**: Node.js with Express.js for robust API development.
- **Database**: MongoDB with Mongoose for data modeling and aggregation.
- **Authentication**: JWT (JSON Web Tokens) and bcrypt for secure user sessions.
- **File Uploads**: Multer for handling image uploads, Cloudinary for storage.
- **Real-Time Features**: Socket.IO for live chat and notifications.
- **Email Services**: Brevo (formerly Sendinblue) for transactional emails.
- **Security**: Helmet for HTTP headers, CORS for cross-origin requests.
- **Validation**: Custom middleware for input validation and error handling.
- **Deployment**: Designed for platforms like Render, Railway, or Vercel.

## 📁 Project Structure

```
roomezy/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middlewares/     # Authentication, file uploads
│   │   ├── utils/           # Helpers, error classes
│   │   ├── socket/          # Real-time chat logic
│   │   ├── db/              # Database connection
│   │   ├── app.js           # Express app setup
│   │   └── index.js         # Server entry point
│   ├── public/              # Static files
│   └── package.json         # Dependencies and scripts
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Page-level components
    │   ├── features/        # Redux slices and providers
    │   ├── hooks/           # Custom React hooks
    │   ├── utils/           # API clients, constants
    │   ├── socket/          # Socket.IO client setup
    │   └── app/             # Redux store configuration
    ├── public/              # Static assets (logo, manifest)
    └── package.json         # Dependencies and scripts
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance like MongoDB Atlas)
- Git

### Backend Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/roomezy.git
   cd roomezy/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/roomezy
   # Or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/roomezy

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email Service (Brevo)
   BREVO_API_KEY=your_brevo_api_key
   EMAIL_FROM=noreply@roomezy.com

   # CORS Origins
   CORS_ALLOWED_ORIGINS=http://localhost:3000,https://roomezy.vercel.app

   # Server Port
   PORT=8000

   # Environment
   NODE_ENV=development
   ```

4. **Start the server**:
   ```bash
   npm run dev  # For development with nodemon
   # or
   npm start    # For production
   ```

   The backend will run on `http://localhost:8000`.

### Frontend Setup
1. **Navigate to frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the `frontend/` directory with the following variables:
   ```env
   # API URLs
   VITE_API_URL=http://localhost:8000/api/v1
   VITE_SOCKET_URL=http://localhost:8000

   # For production (update in Vercel dashboard):
   # VITE_API_URL=https://your-backend-url.onrender.com/api/v1
   # VITE_SOCKET_URL=https://your-backend-url.onrender.com

   # Google OAuth Client ID
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (default Vite port).

## 🚀 Deployment

### Backend Deployment
- **Recommended Platforms**: Render, Railway, or Heroku.
- **Steps**:
  1. Push your backend code to GitHub.
  2. Connect your repository to the deployment platform.
  3. Set environment variables in the platform's dashboard.
  4. Deploy and note the production URL for frontend configuration.

### Frontend Deployment
- **Recommended Platform**: Vercel (optimized for Vite).
- **Steps**:
  1. Push your frontend code to GitHub.
  2. Connect to Vercel and import the project.
  3. Set environment variables in Vercel's dashboard.
  4. Deploy and get your live URL.

## 📱 Progressive Web App (PWA)

Roomezy supports PWA installation for a native app-like experience:
- Add to home screen on mobile devices.
- Offline capabilities for cached content.
- Push notifications (future feature).

## 🔒 Security Features

- **Authentication**: JWT-based sessions with secure cookie handling.
- **Authorization**: Role-based access control for users and admins.
- **Data Validation**: Input sanitization and validation on both client and server.
- **Rate Limiting**: Prevents abuse with request throttling.
- **HTTPS**: Enforced in production for encrypted communications.
- **CORS**: Configured for secure cross-origin requests.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: roomezyy@gmail.com
- **Website**: [Roomezy](https://roomezy.vercel.app)
- **GitHub**: [Github](https://github.com/Aman-ydav/roomezy)

---

Built with ❤️ for students and professionals seeking the perfect living space.
