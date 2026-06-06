# TravelBuddy Frontend

A modern, production-ready React frontend for the TravelBuddy application - a travel companion matching platform.

## Tech Stack

- **React 19** - UI library
- **React Router 7** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **SockJS & STOMP** - WebSocket client for real-time chat
- **React Hot Toast** - Toast notifications

## Features

### Authentication
- Login/Register with email and password
- JWT-based authentication
- Protected routes
- Remember me functionality

### Dashboard
- Overview of trips, matches, and chats
- Quick actions to navigate the app
- Recent activity feed
- Recommended travel buddies

### Travel Plans
- Create, edit, and delete travel plans
- Set destination, dates, budget, and travel style
- Search and filter plans
- View upcoming and past trips

### Find Matches
- Discover potential travel buddies
- View match percentage
- Filter by destination, travel style, and budget
- Send interest requests

### My Matches
- View matched users
- Start conversations
- See match scores

### Messaging
- Real-time chat with WebSocket
- Message history
- Typing indicators
- Online status
- Read receipts

### Profile
- View and edit profile
- Upload profile picture
- Set interests and travel preferences
- Profile completion indicator

## Design System

### Colors
- **Primary**: #2563EB (Blue)
- **Secondary**: #0F172A (Slate)
- **Accent**: #06B6D4 (Cyan)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Danger**: #EF4444 (Red)
- **Background**: #F8FAFC (Light)
- **Surface**: #FFFFFF (White)

### Typography
- Font Family: Inter, system-ui, sans-serif
- Clean, modern, and highly readable

### Components
- Button (primary, secondary, outline, ghost, danger, success)
- Input (with icons, password toggle, validation)
- Card (with hover effects)
- Modal (with animations)
- Avatar (with online indicator)
- Skeleton (loading states)
- Badge (status indicators)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:8080
```

## Project Structure

```
src/
├── api/
│   └── axios.js          # Axios configuration
├── components/
│   ├── layout/           # Layout components
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── index.js
│   └── ui/               # Reusable UI components
│       ├── Avatar.jsx
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       ├── Modal.jsx
│       ├── Skeleton.jsx
│       └── index.js
├── context/
│   └── AuthContext.jsx   # Authentication context
├── pages/
│   ├── Chat.jsx
│   ├── Chats.jsx
│   ├── Dashboard.jsx
│   ├── FindMatches.jsx
│   ├── Login.jsx
│   ├── MyMatches.jsx
│   ├── MyPlans.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   ├── TravelPlans.jsx
├── routes/
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── styles/
│   └── global.css        # Global styles & Tailwind
├── App.jsx
└── main.jsx
```

## API Integration

The frontend connects to the Spring Boot backend at `http://localhost:8080`.

### Key Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/me` - Get current user
- `GET /api/travel-plans/my-plans` - Get user's travel plans
- `POST /api/travel-plans` - Create travel plan
- `GET /api/travel-plans/matches` - Get potential matches
- `GET /api/matches` - Get user's matches
- `POST /api/matches/request` - Send match request
- `GET /api/chat/conversations` - Get chat list
- `WebSocket /chat` - Real-time messaging

## Dark Mode

The application supports dark mode. Toggle it using the button in the sidebar.

## Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## License

MIT