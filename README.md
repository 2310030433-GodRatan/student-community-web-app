# Student Community Web App

A full-stack web application for students to share notes, academic resources, and collaborate with peers.

## 📋 Project Overview

This is a monorepo containing both frontend and backend applications for a student community platform where users can:
- Create and share academic notes
- Share educational resources
- Connect with other students
- Manage user profiles
- Authenticate securely

## 🏗️ Project Structure

```
student-community-web-app/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env.example
├── backend/                  # Node.js/Express backend application
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── controllers/
│   │   └── app.js
│   ├── package.json
│   ├── .env.example
│   └── server.js
├── .gitignore
└── README.md
```

## 🚀 Features

### Authentication & User Management
- User registration and login
- JWT-based authentication
- Secure password hashing
- User profile management
- Session management

### Notes & Resources
- Create, read, update, delete notes
- Share academic resources
- Categorize content by subject
- Search and filter functionality

### Community Features
- User profiles
- User following/connections
- Activity feed
- Comments on posts

### Frontend
- Responsive UI with React.js
- Form validation
- Real-time updates
- Intuitive navigation

### Backend
- RESTful API with Express.js
- MongoDB database integration
- Input validation and sanitization
- Error handling

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios (API calls)
- CSS/Tailwind CSS (styling)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose (ODM)
- JWT (authentication)
- bcryptjs (password hashing)

### Tools & Services
- Git & GitHub
- MongoDB Atlas (cloud database)
- Environment variables (.env)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Notes Endpoints
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### Resources Endpoints
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create a new resource
- `GET /api/resources/:id` - Get a specific resource
- `PUT /api/resources/:id` - Update a resource
- `DELETE /api/resources/:id` - Delete a resource

### User Endpoints
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/follow` - Follow a user
- `POST /api/users/:id/unfollow` - Unfollow a user

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 📝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Commit with clear messages
4. Push to your branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**2310030433-GodRatan**

## 🤝 Support

For issues and questions, please open an issue on the GitHub repository.

---

**Happy Coding! 🎓**
