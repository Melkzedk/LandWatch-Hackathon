# LandWatch - Real Estate Platform

A MERN stack application for browsing and managing real estate listings enhanced with AI capabilities.

## Features

- Property listings with detailed information
- AI-powered property descriptions and insights
- User authentication via Supabase
- Property search and filtering
- Interactive map view of properties
- Admin dashboard for property management

## Tech Stack

- Frontend:
  - React
  - Supabase Client
  - React Router
  - Tailwind CSS
  
- Backend:
  - Node.js
  - Express
  - Supabase (Database)
  - OpenRouter API (AI Integration)

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenRouter API key

## Setup

1. Clone the repository
```bash
git clone <repository-url>
cd landwatch
```

2. Install dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Environment Setup

Frontend (.env):
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Backend (.env):
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE=your_service_role_key
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

4. Start the application

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

## Development

- Frontend runs on http://localhost:3000
- Backend runs on http://localhost:5000

## Contributing

1. Create a feature branch
2. Commit changes
3. Open a pull request

## License
