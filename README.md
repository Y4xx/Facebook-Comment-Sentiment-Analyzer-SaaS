# Facebook Comment Sentiment Analyzer SaaS

A production-ready SaaS web application that analyzes the sentiment of Facebook post comments using BERT-based NLP.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 🧠 **AI-Powered Analysis** - BERT multilingual sentiment analysis
- 🌍 **Multilingual Support** - English, French, Arabic, and more
- 📊 **Visual Analytics** - Interactive charts and statistics
- 🌙 **Dark Mode** - Full dark/light theme support
- 📱 **Responsive Design** - Works on all devices
- 📥 **Export Results** - Download analysis as CSV

## Tech Stack

### Backend
- **Python** with FastAPI
- **SQLAlchemy** ORM with SQLite
- **HuggingFace Transformers** with BERT model
- **JWT** authentication with bcrypt password hashing

### Frontend
- **React 18** with TypeScript
- **Vite** build tool
- **TailwindCSS** with shadcn/ui components
- **React Query** (TanStack Query) for data fetching
- **Recharts** for data visualization
- **React Router** for navigation

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── ai/              # BERT sentiment analysis
│   │   ├── api/             # API routes (auth, analysis)
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # Database setup
│   │   └── main.py          # FastAPI application
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API client and types
│   │   ├── components/ui/   # shadcn UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── layouts/         # Page layouts
│   │   ├── lib/             # Utilities
│   │   ├── pages/           # Route pages
│   │   └── App.tsx          # Main app component
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

5. Edit `.env` and set a secure `SECRET_KEY`

6. Run the server:
   ```bash
   uvicorn app.main:app --reload

   python3 -m uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/auth/me` | Get current user info |

### Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyses` | Analyze a Facebook post |
| GET | `/analyses` | Get all user analyses |
| GET | `/analyses/{id}` | Get specific analysis details |

## Usage

1. **Register** - Create a new account
2. **Login** - Sign in with your credentials
3. **Dashboard** - Paste a Facebook post URL
4. **Analyze** - Click the analyze button
5. **View Results** - See sentiment distribution, charts, and individual comment analysis
6. **Export** - Download results as CSV

## AI Model

The application uses the `nlptown/bert-base-multilingual-uncased-sentiment` model from HuggingFace, which:

- Supports multiple languages
- Classifies text into 1-5 star ratings
- Ratings are mapped to:
  - ⭐⭐⭐⭐-⭐⭐⭐⭐⭐ → Positive
  - ⭐⭐⭐ → Neutral
  - ⭐-⭐⭐ → Negative

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=sqlite:///./sentiment_analyzer.db
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
RATE_LIMIT_PER_MINUTE=10
SENTIMENT_MODEL=nlptown/bert-base-multilingual-uncased-sentiment
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
```

## License

MIT License
