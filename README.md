# Campus Mitra

A modern, production-grade RAG (Retrieval-Augmented Generation) system designed for college students, featuring a beautiful React frontend and a powerful FastAPI backend. Upload PDF documents, ask questions, and get AI-powered answers based on your documents.

## ✨ Features

### Frontend Features
- 🎨 **Premium UI Design** - Bold, energetic, modern interface with gradients, glassmorphism, and micro-animations
- 🔐 **Authentication** - Secure login and registration with JWT tokens and Zod validation
- 📁 **File Management** - Drag-and-drop PDF upload with real-time processing status
- 💬 **AI Chat Interface** - Streaming responses with source references and real-time typing indicators
- 🎯 **Interactive Dashboard** - Animated metrics, Magic UI cards, and visual feedback
- 🚀 **Landing Page** - Eye-catching hero section with animated text and feature showcases
- 📱 **Fully Responsive** - Mobile-first design that works beautifully on all devices

### Backend Features
- 🔒 **Secure Authentication** - OAuth2-compatible JWT-based authentication
- 📄 **PDF Processing** - Automatic document chunking and embedding generation
- 🧠 **RAG Pipeline** - Advanced retrieval-augmented generation using LangChain
- 🔍 **Vector Search** - ChromaDB-based semantic search across user documents
- ⚡ **Streaming Responses** - Server-Sent Events (SSE) for real-time AI responses
- 🛡️ **Rate Limiting** - Protection against abuse with configurable limits
- 📊 **User Isolation** - Each user has their own document collection and embeddings

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with modern hooks and features
- **Vite 7** - Lightning-fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **ShadCN UI** - High-quality, accessible component primitives
- **Magic UI Components** - Animated border beams, shimmer effects, grid patterns
- **React Router 7** - Declarative routing
- **Axios** - HTTP client with interceptors
- **React Hook Form + Zod** - Form validation
- **React Hot Toast** - Beautiful toast notifications

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Python 3.13** - Latest Python version
- **LangChain** - Framework for building LLM applications
- **ChromaDB** - Vector database for embeddings
- **MongoDB** - Document database for user and file metadata
- **PyMuPDF** - PDF processing and text extraction
- **Sentence Transformers** - Embedding generation
- **Google Generative AI** - LLM integration
- **Uvicorn** - ASGI server
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
CampusMitra/
├── Frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # UI components (Magic UI, Fancy, Base)
│   │   ├── contexts/           # React contexts (Auth)
│   │   ├── lib/                # Utilities and API client
│   │   ├── pages/              # Route pages
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── public/                 # Static assets
│   ├── package.json
│   └── vite.config.js
│
├── Extended_Langchain_Rag/     # FastAPI backend application
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   ├── routes/                 # API route definitions
│   ├── schemas/                # Pydantic models
│   ├── middleware/             # Rate limiting, etc.
│   ├── models/                 # Data models
│   ├── PDFs/                   # Uploaded PDF storage
│   ├── app.py                  # FastAPI application
│   ├── Rag_Pipeline.py         # RAG processing pipeline
│   └── requirements.txt
│
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** (for frontend)
- **Python 3.13+** (for backend)
- **MongoDB** (running locally or connection string)
- **ChromaDB** (automatically initialized)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd Extended_Langchain_Rag
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables:**
   Create a `.env` file in `Extended_Langchain_Rag/`:
   ```env
   MONGODB_URL=mongodb://localhost:27017
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   GOOGLE_API_KEY=your-google-api-key
   ```

6. **Run the backend server:**
   ```bash
   uvicorn app:app --reload
   ```

   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in `Frontend/`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🗺️ Available Routes

### Frontend Routes
- `/` - Landing page (public)
- `/login` - User login (public)
- `/register` - User registration (public)
- `/dashboard` - Main dashboard (protected)
- `/files` - File management (protected)
- `/chat` - AI chat interface (protected)

### Backend API Endpoints

#### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/token` - Login and get access token
- `GET /auth/users/me` - Get current user info

#### File Management
- `POST /files/upload` - Upload a PDF file
- `GET /files/my-files` - Get user's files
- `GET /files/{file_id}` - Get file details
- `DELETE /files/{file_id}` - Delete a file

#### RAG Operations
- `POST /rag/ask` - Ask a question (JSON response)
- `POST /rag/ask-stream` - Ask with streaming response (SSE)

#### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health status

## 📚 Documentation

For detailed documentation, please refer to:

- **[Frontend Documentation](./Frontend/Frontend_README.md)** - Complete frontend guide with component details, styling, and customization
- **[API Documentation](./Extended_Langchain_Rag/API_README.md)** - Complete API reference with request/response examples

## 🔐 Authentication Flow

1. **Register** a new user via `POST /auth/register`
2. **Login** via `POST /auth/token` to receive a JWT access token
3. **Include the token** in subsequent requests:
   ```
   Authorization: Bearer <your_access_token>
   ```
4. Tokens expire after **30 minutes** (configurable)

## 📁 File Upload & Processing

1. **Upload a PDF** via the frontend or `POST /files/upload`
2. **File status** progresses: `uploading` → `processing` → `ready`
3. **Processing includes:**
   - PDF text extraction
   - Document chunking
   - Embedding generation
   - Vector storage in ChromaDB
4. **Check status** via `GET /files/my-files` or `GET /files/{file_id}`

## 💬 Using the RAG System

1. **Ensure files are ready** (status: `ready`)
2. **Ask questions** via the chat interface or API
3. **Get answers** based on your uploaded documents
4. **View sources** - Each answer includes references to source documents

### Streaming Responses

The `/rag/ask-stream` endpoint provides real-time streaming using Server-Sent Events (SSE), perfect for chat interfaces.

## 🛡️ Rate Limiting

The API implements rate limiting:
- **60 requests per minute** per IP
- **1000 requests per hour** per IP

Health check endpoints are exempt from rate limiting.

## 🏗️ Building for Production

### Frontend

```bash
cd Frontend
npm run build
```

The built files will be in `Frontend/dist/`, ready for deployment.

### Backend

The backend can be deployed using:
- **Uvicorn** (production mode)
- **Gunicorn** with Uvicorn workers
- **Docker** (recommended)

Example production command:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🧪 Testing

### Backend API Testing

Use the interactive API documentation at `http://localhost:8000/docs` or use tools like:
- **Postman**
- **cURL**
- **HTTPie**

Example workflow:
```bash
# Register
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@example.com", "password": "test123"}'

# Login
curl -X POST "http://localhost:8000/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test&password=test123"

# Upload file
curl -X POST "http://localhost:8000/files/upload" \
  -H "Authorization: Bearer <token>" \
  -F "file=@document.pdf"
```

## 🎨 Customization

### Frontend
- Customize colors in Tailwind config or component props
- Adjust animations in Framer Motion transitions
- Modify UI components in `src/components/`

### Backend
- Configure RAG parameters in `Rag_Pipeline.py`
- Adjust chunk size and overlap in document processing
- Customize embedding model in the pipeline
- Modify rate limits in `middleware/rate_limiter.py`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Campus Mitra system.

## 🙏 Acknowledgments

- **Magic UI** - For inspiration on animated components
- **Fancy Components** - For creative UI patterns
- **ShadCN UI** - For accessible component primitives
- **Framer Motion** - For smooth animations
- **LangChain** - For RAG framework
- **FastAPI** - For the excellent web framework

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check `MONGODB_URL` in `.env`

**ChromaDB Issues:**
- ChromaDB will auto-initialize on first run
- Check file permissions for the database directory

**Import Errors:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

**API Connection Error:**
- Verify `VITE_API_URL` in `.env`
- Ensure backend is running on the correct port
- Check CORS settings in backend

**Build Errors:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 20+)

## 📞 Support

For issues or questions:
- Check the detailed documentation in `Frontend/Frontend_README.md` and `Extended_Langchain_Rag/API_README.md`
- Review the API documentation at `http://localhost:8000/docs`
- Open an issue in the repository

---

Built with ❤️ for students by the Campus Mitra team.
