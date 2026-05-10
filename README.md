# SportScope Backend

SportScope Backend is a Node.js + Express REST API that powers the SportScope platform.

The backend aggregates sports data from external APIs, processes and normalizes it, stores selected historical data in MongoDB, and serves structured endpoints for the frontend application.

The system currently focuses on:

* Cricket

  * Live matches
  * Upcoming matches
  * Historical matches
  * Series information
  * Player directory and filtering

* Tennis

  * Fixtures
  * Tournaments
  * Rankings
  * Player search

The backend also includes:

* Caching for reduced API usage
* Scheduled cron jobs
* Historical data persistence
* Filtering and search capabilities
* Database-backed sports records

---

# Tech Stack

* Node.js (CommonJS)
* Express.js
* MongoDB + Mongoose
* Axios
* node-cron

---

# Architecture Overview

```text
Frontend (React + Vite)
        ↓
Express REST API
        ↓
External Sports APIs
        ↓
MongoDB Storage + Cache
```

---

# Features

## Cricket Features

* Live match tracking
* Upcoming fixtures
* Recent/completed match storage
* Historical match retrieval
* Series browsing
* Player directory
* Advanced filtering and search
* Featured players system

## Tennis Features

* ATP/WTA fixtures
* Tournament schedules
* Player search
* Rankings
* Historical fixture querying

## Backend Features

* REST API architecture
* MongoDB persistence
* Scheduled cron jobs
* In-memory caching
* Query filtering
* Pagination support
* External API integration
* Data normalization utilities

---

# Repository Structure

```text
SportScope-Backend/
│
├── config/        # Database configuration
├── cron/          # Scheduled cron jobs
├── models/        # MongoDB/Mongoose models
├── routes/        # Express route handlers
├── scripts/       # Import/seed scripts
├── services/      # External API integrations
├── utils/         # Helpers, cache, formatting
├── server.js      # Main server entry point
└── package.json
```

---

# Installation & Setup

## 1. Clone the Repository

```bash
git clone <your-backend-repository-url>
cd SportScope-Backend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the root directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

# External API Keys (if required)
API_KEY_1=your_api_key
API_KEY_2=your_api_key
```

### Required Variables

| Variable    | Description               |
| ----------- | ------------------------- |
| `MONGO_URI` | MongoDB connection string |
| `PORT`      | Server port               |

Some services inside `services/` may require additional external API keys.

---

## 4. Start the Server

Production:

```bash
npm start
```

Development mode:

```bash
npm run dev
```

Server runs on:

```text
http://localhost:5000
```

---

# API Base Routes

| Category           | Base Route                |
| ------------------ | ------------------------- |
| Health Check       | `/`                       |
| Cricket Matches    | `/api/matches`            |
| Cricket Players    | `/api/players`            |
| Cricket Series     | `/api/series`             |
| Tennis Fixtures    | `/api/tennis/fixtures`    |
| Tennis Players     | `/api/tennis/players`     |
| Tennis Tournaments | `/api/tennis/tournaments` |
| Tennis Rankings    | `/api/tennis/rankings`    |

---

# Cricket API

## Matches

### Get Live Matches

```http
GET /api/matches/live
```

Query Parameters:

| Parameter | Description      |
| --------- | ---------------- |
| `filter`  | `major` or `all` |

---

### Get Recent Matches

```http
GET /api/matches/recent
```

---

### Get Upcoming Matches

```http
GET /api/matches/upcoming
```

---

### Save Recent Matches to Database

```http
POST /api/matches/save-recent
```

---

### Get Saved Historical Matches

```http
GET /api/matches/saved
```

---

### Match Database Statistics

```http
GET /api/matches/stats
```

---

### Cleanup Old Matches

```http
DELETE /api/matches/cleanup?days=30
```

Deletes historical matches older than the provided number of days.

---

# Players API

## Get Players

```http
GET /api/players
```

Supports:

* Pagination
* Filtering
* Search
* Sorting

### Common Query Parameters

| Parameter      | Description                     |
| -------------- | ------------------------------- |
| `page`         | Page number                     |
| `limit`        | Results per page                |
| `q`            | Search by name/playerId         |
| `gender`       | Player gender                   |
| `battingStyle` | Batting style                   |
| `bowlingStyle` | Bowling style                   |
| `position`     | Playing role                    |
| `countryId`    | Country filter                  |
| `continent`    | Continent filter                |
| `sortBy`       | `playerId`, `createdAt`, `name` |
| `order`        | `asc` or `desc`                 |

---

## Additional Player Endpoints

```http
GET /api/players/filters
GET /api/players/countries
GET /api/players/countries/:countryId/players
GET /api/players/continents/:continent/players
GET /api/players/batters
GET /api/players/bowlers
GET /api/players/featured
GET /api/players/id/:playerId
POST /api/players/add
```

---

# Series API

## Get Upcoming Series

```http
GET /api/series/upcoming
```

Query Parameters:

| Parameter | Description                                |
| --------- | ------------------------------------------ |
| `format`  | `t20`, `odi`, `test`, `multiformat`, `all` |
| `status`  | `live`, `upcoming`, `all`                  |
| `search`  | Search query                               |

---

## Get Series Details

```http
GET /api/series/:seriesId
```

Features:

* Match list retrieval
* Data normalization
* Cached responses

---

# Tennis API

## Fixtures

Base Route:

```text
/api/tennis/fixtures
```

### Endpoints

```http
GET /today?type=atp|wta
GET /date/:date?type=atp|wta
GET /range?start=YYYY-MM-DD&end=YYYY-MM-DD&type=atp|wta
GET /tournament/:tournamentId?type=atp|wta
GET /player/:playerId?type=atp|wta
```

---

## Database Fixture Queries

### Completed Fixtures

```http
GET /db/completed
```

Query Parameters:

| Parameter      | Description       |
| -------------- | ----------------- |
| `type`         | ATP or WTA        |
| `source`       | Data source       |
| `tournamentId` | Tournament filter |
| `playerId`     | Player filter     |
| `start`        | Start date        |
| `end`          | End date          |

---

### Generic Fixture Query

```http
GET /db
```

Supports:

* Completion status
* Tournament filtering
* Date filtering
* Player filtering

---

# Caching & Optimization

To reduce external API usage and improve performance, the backend implements:

* In-memory caching
* Historical MongoDB storage
* Scheduled cron jobs
* Selective polling
* Query filtering

Caching utilities are mainly located in:

```text
utils/cache.js
```

---

# Cron Jobs

Cron jobs are located in:

```text
cron/
```

Example:

```text
cron/recentMatchesCron.js
```

These jobs typically:

* Fetch recent sports data
* Store historical records
* Refresh selected datasets

---

# External Data Sources

SportScope integrates with third-party sports APIs for:

* Live cricket data
* Tennis fixtures
* Rankings
* Tournament schedules
* Match information

Some endpoints depend on:

* API availability
* API rate limits
* External provider uptime

---

# Quick API Tests

## Health Check

```bash
curl http://localhost:5000/
```

---

## Live Matches

```bash
curl http://localhost:5000/api/matches/live?filter=major
```

---

## Players

```bash
curl http://localhost:5000/api/players?page=1&limit=20
```

---

# Current Limitations

* Real-time updates currently rely on polling rather than WebSockets
* Some endpoints depend on third-party API availability
* Certain APIs have daily request limits
* Advanced predictive analytics are not yet implemented

---

# Future Improvements

Potential future enhancements include:

* AI/ML-based sports predictions
* Advanced statistics dashboards
* WebSocket real-time updates
* Additional sports support
* User authentication
* Personalized watchlists
* Team analytics
* Data visualization modules

---

# Deployment (Planned)

## Frontend

* Vercel
* Netlify

## Backend

* Render
* Railway
* VPS deployment

## Database

* MongoDB Atlas

---

# License

Add your preferred license here if applicable.
