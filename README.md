# LandWatch - Real Estates Platform

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

## PROJECT SCREENSHOTS
<img width="1365" height="599" alt="Screenshot 2025-11-05 100541" src="https://github.com/user-attachments/assets/21f03779-6508-4351-8f98-3e955dd64c01" />
<img width="1365" height="602" alt="Screenshot 2025-11-05 100555" src="https://github.com/user-attachments/assets/cd475680-fd07-4a82-9342-f98510acc1bf" />
<img width="1355" height="592" alt="Screenshot 2025-11-05 100626" src="https://github.com/user-attachments/assets/10e81e65-14dd-4258-a2ad-1ce635564918" />
<img width="1362" height="596" alt="Screenshot 2025-11-05 100641" src="https://github.com/user-attachments/assets/c0ad7df0-09c2-4643-a867-ce21f4fcfed2" />
<img width="1365" height="600" alt="Screenshot 2025-11-05 100652" src="https://github.com/user-attachments/assets/eeb189b4-1f20-4e0f-ba8d-ebde30826830" />






## License
