# Wanderwise — AI-Powered Trip Planner

Wanderwise is a full-stack AI-powered travel planning application that generates personalized, day-by-day travel itineraries based on user preferences, trip duration, and budget.

The application uses OpenAI to generate structured itineraries, an Express.js backend to process requests, and MongoDB Atlas to persist saved trips.

## Live Demo

- **Frontend:** https://wander-wise-snowy.vercel.app/
- **Backend:** https://wanderwise-server-fz4i.onrender.com
- **GitHub Repository:** https://github.com/abhinavjoshi2003/WanderWise

## Features

- **AI-Powered Itinerary Generation:** Generate personalized travel plans from natural-language descriptions.
- **Day-Wise Planning:** Organizes trips into individual days with sightseeing, adventure, food, shopping, relaxation, and transport activities.
- **Budget Estimation:** Provides estimated costs in Indian Rupees (INR).
- **Structured AI Responses:** Uses schema-constrained output and Zod validation to maintain a consistent itinerary structure.
- **Save Trips:** Store generated itineraries in MongoDB Atlas.
- **Persistent Storage:** Retrieve saved trips even after refreshing the application.
- **Trip Management:** View and delete previously saved trips.
- **Responsive Interface:** Access the application across desktop and mobile screen sizes.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| AI Integration | OpenAI API, Responses API |
| Validation | Zod |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git, GitHub |

## Architecture

```text
                 User
                  |
                  v
          React + Vite Frontend
              (Vercel)
                  |
             HTTP Requests
                  |
                  v
           Express.js API
              (Render)
                  |
          +-------+-------+
          |               |
          v               v
      OpenAI API      MongoDB Atlas
          |               |
          v               v
    Generated       Saved Itineraries
    Itinerary       and Trip Records
          |               |
          +-------+-------+
                  |
                  v
          Frontend Response
```


## Getting Started

### Prerequisites

Make sure you have the following installed or configured:

- Node.js 22.x
- npm
- MongoDB Atlas account
- OpenAI API key
- Git

### 1. Clone the repository

```bash
git clone https://github.com/abhinavjoshi2003/WanderWise.git

cd WanderWise
```

### 2. Configure the backend

Navigate to the backend directory:

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=your_mongodb_atlas_connection_string

OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=your_openai_model

CLIENT_URL=http://localhost:5173
```

Replace the placeholder values with your actual configuration.

### 3. Start the backend

```bash
npm run dev
```

The backend should start at:

```text
http://localhost:5000
```

Verify the API using:

```text
http://localhost:5000/api/health
```

### 4. Configure the frontend

Open another terminal and navigate to the root directory:

```bash
npm install
```

Create a `.env` file inside the root directory:

```env
VITE_API_URL=http://localhost:5000
```

### 5. Start the frontend

```bash
npm run dev
```

Open the local application at:

```text
http://localhost:5173
```

The frontend communicates with the backend through the configured API URL.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/trips/generate` | Generate a new AI itinerary |
| GET | `/api/trips/saved` | Retrieve saved trips |
| POST | `/api/trips/saved` | Save an itinerary |
| DELETE | `/api/trips/saved/:id` | Delete a saved trip |
| GET | `/api/health` | Check backend health |

Saved-trip endpoints require the `X-Wanderwise-Client-Id` request header.

## AI Usage and Transparency

Wanderwise integrates the OpenAI API to generate travel itineraries from user-provided descriptions.

The AI integration is implemented in the backend using the OpenAI Responses API and structured output formatting.

Key implementation details:

- Natural-language trip descriptions are sent to the AI model.
- The model generates a structured itinerary containing trip details, daily plans, destinations, estimated costs, and useful tips.
- Zod schemas validate the generated response before it is returned to the frontend.
- The backend assigns unique identifiers to itinerary stops for frontend interactions.
- The generated itinerary can subsequently be saved to MongoDB Atlas.

**Important:** AI-generated travel information is not guaranteed to be factually accurate or up to date. Estimated costs are indicative, not live-verified prices. Users should independently verify destination information, transportation, availability, safety guidance, and opening hours before travelling.

AI is used as an assistance tool for itinerary generation; the application also includes custom backend logic, validation, database integration, API handling, and frontend functionality.

## Known Limitations

1. **AI Accuracy:** Generated itineraries may contain inaccurate recommendations, estimated costs, or destination information.
2. **No Live Verification:** The application does not currently verify real-time attraction availability, ticket prices, opening hours, or transportation schedules.
3. **Currency Support:** Estimated budgets and costs are currently restricted to Indian Rupees (INR).
4. **Trip Duration:** The supported itinerary duration is limited to 1–14 days.
5. **Daily Activities:** Each day contains 2–5 planned stops, which may not suit every travel preference.
6. **Anonymous Trip Ownership:** Saved trips are associated with a browser-generated UUID rather than an authenticated user account. Clearing browser storage or using another browser can result in loss of access to previously saved trips.
7. **AI and API Dependency:** Itinerary generation depends on the availability, usage limits, and cost of the external OpenAI API.
8. **Database Dependency:** Saved-trip functionality requires a working MongoDB Atlas connection.

## Deployment

The application is deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Production environment variables are configured separately through the hosting providers.

The backend uses environment-based CORS configuration to allow requests from the deployed frontend.

## Time Spent

**Total development time:** 7 hours

This includes:

- Frontend development and responsive UI implementation
- Backend API development
- OpenAI API integration and structured response validation
- MongoDB Atlas integration and saved-trip functionality
- Testing and debugging
- Production configuration and deployment

## Future Improvements

- User authentication and individual trip accounts
- Real-time travel information and destination verification
- Interactive maps and route optimization
- Multi-currency budget estimation
- More advanced personalization based on travel preferences
- Collaborative trip planning and sharing
- Improved AI recommendations using external travel data sources

## License

This project is available for educational and portfolio purposes. Add an explicit license file if you intend to grant others permission to reuse or redistribute the code.

---

**Wanderwise — Plan smarter. Travel better.**
