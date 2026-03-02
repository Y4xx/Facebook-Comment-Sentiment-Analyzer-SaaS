# Facebook Comment Sentiment Analyzer SaaS

A production-ready SaaS web application that analyzes the sentiment of Facebook post comments using the Facebook Graph API and BERT-based NLP.

## Features

- 🧠 **AI-Powered Analysis** - BERT multilingual sentiment analysis
- 📘 **Facebook Graph API Integration** - Fetch comments directly from Facebook posts and reels
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
- **Facebook Graph API** for fetching comments

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
│   │   ├── api/             # API routes (analysis)
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
- Facebook Developer Account (for API access)

### Facebook Graph API Setup

Before setting up the application, you need to configure Facebook API access:

#### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Click "My Apps" → "Create App"
3. Select "Business" as the app type
4. Fill in the app details and create the app

#### Step 2: Get an Access Token

For development/testing purposes:

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click "Generate Access Token"
4. Grant the required permissions:
   - `pages_read_engagement` - To read comments on page posts
   - `pages_read_user_content` - To read user comments on page posts

For production:

1. Implement Facebook Login in your application
2. Request the necessary permissions from users
3. Use the User Access Token or Page Access Token

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

5. Edit `.env` and configure the following:
   - Set a secure `SECRET_KEY`
   - Add your `FACEBOOK_ACCESS_TOKEN`
   - Set `FACEBOOK_API_VERSION` (e.g., `v19.0`)

6. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   or with
   ```bash
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

## Supported Facebook URL Formats

The application supports the following Facebook URL formats:

| URL Format | Example |
|------------|---------|
| Standard post URL | `https://facebook.com/username/posts/123456789` |
| Video URL | `https://facebook.com/username/videos/123456789` |
| Story URL | `https://facebook.com/story.php?story_fbid=123456789` |
| Permalink | `https://facebook.com/permalink.php?story_fbid=123456789&id=PAGE_ID` |
| Reel URL | `https://facebook.com/reel/123456789` |
| fb.watch | `https://fb.watch/abcdef/` |
| Photo URL | `https://facebook.com/username/photos/a.123/456789` |

### Unsupported URL Formats

**Share URLs are NOT supported** by the Facebook Graph API:

| URL Format | Example | Status |
|------------|---------|--------|
| Share URL (posts) | `https://facebook.com/share/p/1AxW47x5b2/` | ❌ Not supported |
| Share URL (reels) | `https://facebook.com/share/r/1DVe2AfBDR/` | ❌ Not supported |

**How to get the direct URL:**
1. Open the Facebook post in your browser
2. Click on the post's timestamp (date/time)
3. Copy the URL from your browser's address bar

## API Endpoints

### Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyses` | Analyze a Facebook post |
| GET | `/analyses` | Get all user analyses |
| GET | `/analyses/{id}` | Get specific analysis details |

#### Analyze Post Request

**Request Body:**
```json
{
  "facebook_post_url": "https://facebook.com/PageName/posts/123456789"
}
```

**Success Response (201 Created):**
```json
{
  "id": 1,
  "post_url": "https://facebook.com/PageName/posts/123456789",
  "overall_sentiment": "positive",
  "overall_score": 3.8,
  "positive_count": 45,
  "neutral_count": 20,
  "negative_count": 5,
  "total_comments": 70,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Error Handling

The API returns the following HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 201 | Analysis created successfully |
| 400 | Bad request (missing token, invalid URL, or API error) |
| 500 | Internal server error |

Common error messages:

- **"Facebook access token is not configured"** - Set the `FACEBOOK_ACCESS_TOKEN` environment variable
- **"Facebook API error: ..."** - The Facebook API returned an error (e.g., invalid token, rate limit exceeded, or insufficient permissions)

## Usage

1. **Register** - Create a new account
2. **Login** - Sign in with your credentials
3. **Dashboard** - Paste a Facebook post URL (use supported formats above)
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
FACEBOOK_ACCESS_TOKEN=your_access_token_here
FACEBOOK_API_VERSION=v19.0
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
```

## Troubleshooting

### Invalid Access Token

If you receive an "Invalid OAuth access token" error:
1. Check that your access token is correctly set in the environment
2. Verify that the token has not expired
3. Generate a new token if necessary

### Insufficient Permissions

If you receive a permissions error:
1. Ensure your app has the required permissions
2. For page posts, make sure you have a Page Access Token with proper permissions

### Rate Limit Exceeded

If you hit rate limits:
1. Wait for the rate limit window to reset
2. Consider implementing caching for frequently accessed posts
3. Use long-lived tokens to avoid frequent re-authentication

For more details, see [Facebook Rate Limiting](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/).

## Security Best Practices

1. **Never commit access tokens** to version control
2. Use environment variables or secure secret management
3. Use short-lived tokens in development and long-lived tokens in production
4. Regularly rotate access tokens
5. Monitor API usage for unusual activity
