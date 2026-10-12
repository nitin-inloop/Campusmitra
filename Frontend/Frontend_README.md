# Campus Mitra Frontend

A modern, production-grade React frontend for the Campus Mitra RAG system, featuring stunning animations, Magic UI components, and a premium user experience designed for college students.

## ✨ Features

- 🎨 **Premium UI Design** - Bold, energetic, modern interface with gradients, glassmorphism, and micro-animations
- 🔐 **Authentication** - Secure login and registration with JWT tokens and Zod validation
- 📁 **File Management** - Drag-and-drop PDF upload with real-time processing status
- 💬 **AI Chat Interface** - Streaming responses with source references and real-time typing indicators
- 🎯 **Interactive Dashboard** - Animated metrics, Magic UI cards, and visual feedback
- 🚀 **Landing Page** - Eye-catching hero section with animated text and feature showcases
- 📱 **Fully Responsive** - Mobile-first design that works beautifully on all devices

## 🛠️ Tech Stack

### Core
- **React 19** - Latest React with modern hooks and features
- **Vite 7** - Lightning-fast build tool and dev server
- **TypeScript Ready** - Type-safe development support

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **ShadCN UI** - High-quality, accessible component primitives
- **Magic UI Components** - Animated border beams, shimmer effects, grid patterns
- **Fancy Components** - Letter swap animations, particle backgrounds, glow effects

### Forms & Validation
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Zod integration for React Hook Form

### Routing & State
- **React Router 7** - Declarative routing for React
- **React Context** - Global state management for authentication

### HTTP & Notifications
- **Axios** - Promise-based HTTP client with interceptors
- **React Hot Toast** - Beautiful toast notifications

### Icons
- **Lucide React** - Beautiful, customizable icons

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** installed
- **Backend API** running on `http://localhost:8000` (or configure `VITE_API_URL`)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the `Frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
```

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # ShadCN-style base components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Popover.jsx
│   │   │   ├── Accordion.jsx
│   │   │   └── Dropzone.jsx
│   │   ├── magic/           # Magic UI components
│   │   │   ├── BorderBeam.jsx
│   │   │   ├── MagicCard.jsx
│   │   │   ├── GridPattern.jsx
│   │   │   ├── ShimmerButton.jsx
│   │   │   └── AnimatedGradientText.jsx
│   │   ├── fancy/           # Fancy Components
│   │   │   ├── AnimatedText.jsx
│   │   │   ├── AnimatedGradient.jsx
│   │   │   ├── GlowCard.jsx
│   │   │   └── NumberTicker.jsx
│   │   └── Layout.jsx       # Main layout with navigation
│   ├── contexts/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── lib/
│   │   ├── api.js           # Axios client with interceptors
│   │   └── utils.js         # Utility functions (cn, etc.)
│   ├── pages/
│   │   ├── Landing.jsx      # Landing page with hero section
│   │   ├── Login.jsx        # Login page with Zod validation
│   │   ├── Register.jsx     # Registration page
│   │   ├── Dashboard.jsx    # Main dashboard with metrics
│   │   ├── Files.jsx        # File management page
│   │   └── Chat.jsx         # AI chat interface
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles and animations
├── public/                  # Static assets
├── package.json
├── vite.config.js
└── README.md
```

## 🗺️ Available Routes

- `/` - Landing page (public)
- `/login` - User login (public)
- `/register` - User registration (public)
- `/dashboard` - Main dashboard (protected)
- `/files` - File management (protected)
- `/chat` - AI chat interface (protected)

## 🎨 UI Components

### Magic UI Components
- **BorderBeam** - Animated gradient borders that flow around cards
- **MagicCard** - Interactive cards with mouse-following glow effects
- **GridPattern** - Subtle grid backgrounds for depth
- **ShimmerButton** - Buttons with animated shimmer effects
- **AnimatedGradientText** - Text with animated gradient backgrounds

### Fancy Components
- **LetterSwapHover** - Text with letter-by-letter hover animations
- **AnimatedGradient** - Animated gradient backgrounds
- **FloatingBlobs** - Floating animated blobs
- **ParticleBackground** - Particle effect backgrounds
- **NumberTicker** - Animated number counting
- **GlowCard** - Cards with interactive glow effects

### Base UI Components
- **Button** - Multiple variants with animations
- **Card** - Glassmorphism cards with hover effects
- **Badge** - Status indicators with gradients
- **Input** - Form inputs with validation states
- **Dropzone** - Drag-and-drop file upload zone
- **Popover** - Contextual popovers
- **Accordion** - Expandable content sections

## 🔐 Authentication

- **JWT-based** - Secure token-based authentication
- **Automatic token injection** - Tokens added to all protected requests
- **Global 401 handling** - Automatic redirect to login on token expiration
- **Protected routes** - Route guards for authenticated pages
- **Form validation** - Zod schemas with React Hook Form

## 📁 File Management

- **Drag & Drop Upload** - Intuitive file upload interface
- **Real-time Status** - Live updates on file processing status
- **File Metadata** - Display file size, chunk count, and upload date
- **Status Badges** - Visual indicators (ready, processing, error)
- **Delete Functionality** - Remove files with confirmation

## 💬 AI Chat

- **Streaming Responses** - Real-time SSE streaming from `/rag/ask-stream`
- **Source References** - Clickable source badges with document previews
- **Message History** - Session-based chat history
- **Typing Indicators** - Visual feedback during streaming
- **Bubble UI** - Modern chat interface with user/AI message distinction

## 🎯 Dashboard Features

- **Animated Metrics** - Number tickers for file counts and chunks
- **Magic UI Cards** - Interactive cards with border beams
- **Quick Actions** - Direct links to key features
- **Visual Feedback** - Hover effects and animations
- **Status Overview** - At-a-glance system status

## 🎨 Design Features

- **Radial Gradients** - Subtle background gradients
- **Glassmorphism** - Frosted glass effects with backdrop blur
- **Micro-animations** - Smooth transitions and hover effects
- **Gradient Text** - Animated gradient text effects
- **Responsive Design** - Mobile-first, works on all screen sizes

## 🏗️ Build for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment.

## 🔌 API Integration

The frontend integrates with the FastAPI backend:

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/token` - User login (OAuth2 form data)
- `GET /auth/users/me` - Get current user

### File Endpoints
- `POST /files/upload` - Upload PDF (multipart/form-data)
- `GET /files/my-files` - Get user's files
- `DELETE /files/{file_id}` - Delete a file
- `GET /files/{file_id}` - Get file details

### RAG Endpoints
- `POST /rag/ask` - Ask a question (JSON)
- `POST /rag/ask-stream` - Ask with streaming response (SSE)

All protected endpoints automatically include the Bearer token from localStorage.

## 🎨 Customization

### Colors
The app uses a blue-indigo-purple gradient theme. Customize colors in:
- Tailwind config (if using config file)
- Component className props
- CSS custom properties

### Animations
Animation durations and effects can be customized in:
- Framer Motion transition props
- CSS keyframes in `index.css`
- Component animation parameters

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Campus Mitra system.

## 🙏 Acknowledgments

- **Magic UI** - For inspiration on animated components
- **Fancy Components** - For creative UI patterns
- **ShadCN UI** - For accessible component primitives
- **Framer Motion** - For smooth animations

---

Built with ❤️ for students by the Campus Mitra team.
