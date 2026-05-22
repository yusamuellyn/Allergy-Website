# Allergy-Aware Dining Finder

A full-stack web app that helps people with food allergies explore nearby restaurants. Enter an address, and the app finds local venues with public websites, scrapes menu-related text when possible, and uses Google Gemini to produce a conservative allergy-risk summary for each place.

**This tool is for informational purposes only.** It is not medical advice. Always confirm ingredients, preparation, and allergens directly with the restaurant before eating.

## Features

- Address search with Geoapify autocomplete
- Nearby restaurant discovery via Google Places (geocoding + text search)
- Menu text extraction from restaurant websites (Cheerio + axios)
- AI-generated allergy summaries: risk score (1–100) and top allergen/risk factors
- Results grouped per search (`searchId`) so lookups do not mix
- Loading state and result cards with photos, scores, and website links
- About and How It Works pages explaining the flow and limitations

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 19, Vite, React Router, Axios, Geoapify |
| Backend | Node.js, Express 5, Mongoose |
| Data | MongoDB |
| APIs | Google Places / Geocoding, Google Gemini |
| Scraping | Axios, Cheerio |

## How it works

1. User enters an address on the home page.
2. **POST `/api/postPlaces`** — Backend geocodes the address, searches for restaurants within ~1 km, fetches place details (name, address, website, photo), and saves up to **6** restaurants with websites to MongoDB under a new `searchId`.
3. **GET `/api/analyzePlaces?searchId=...`** — For each saved restaurant, the server scrapes menu text from the website, then calls Gemini to produce `allergyAnalysis` (`risk_score`, `top_allergies`).
4. **GET `/api/getAllData?searchId=...`** — Frontend loads and displays the analyzed results.

If scraping fails, analysis still runs using the restaurant name and address only (with more conservative prompting).

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- [MongoDB](https://www.mongodb.com/) (local install or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- API keys:
  - [Google Cloud](https://console.cloud.google.com/) — Places API, Geocoding API, and Place Photos (same key as `GOOGLE_API_KEY`)
  - [Google AI Studio](https://aistudio.google.com/) — Gemini API (`GEMINI_API_KEY`)
  - [Geoapify](https://www.geoapify.com/) — Geocoder autocomplete (`VITE_GEOAPIFY_API_KEY`)

## Project structure

```
Allergy Wesbite Project/
├── Backend/
│   ├── config/db.js
│   ├── controllers/       # HTTP handlers (places, analyze)
│   ├── models/Data.js     # Mongoose schema
│   ├── routes/allergyRoutes.js
│   ├── services/          # Places, scraping, Gemini
│   └── server.js
└── Frontend/
    └── Allergy-Project/     # React + Vite app
        └── src/
            ├── pages/       # Home, About, How It Works
            └── components/
```

## Setup

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd "Allergy Wesbite Project"

cd Backend && npm install
cd ../Frontend/Allergy-Project && npm install
```

### 2. Backend environment variables

Create `Backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/allergy-project
GOOGLE_API_KEY=your_google_places_api_key
GEMINI_API_KEY=your_gemini_api_key
```

| Variable | Description |
|----------|-------------|
| `PORT` | Express port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `GOOGLE_API_KEY` | Google Maps Platform key (Geocoding, Places, Place Photos) |
| `GEMINI_API_KEY` | Gemini API key for menu analysis |

Enable **Geocoding API**, **Places API**, and billing on your Google Cloud project if required.

### 3. Frontend environment variables

Create `Frontend/Allergy-Project/.env` (see `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GEOAPIFY_API_KEY=your_geoapify_api_key
```

`VITE_API_BASE_URL` must match the backend URL and port. The backend allows CORS from `http://localhost:5173` (Vite dev server).

### 4. Run the app

**Terminal 1 — Backend:**

```bash
cd Backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd Frontend/Allergy-Project
npm run dev
```

Open the URL Vite prints (usually [http://localhost:5173](http://localhost:5173)).

### Production build (frontend only)

```bash
cd Frontend/Allergy-Project
npm run build
npm run preview
```

Deploy the `dist/` folder to any static host and point `VITE_API_BASE_URL` at your deployed API. Update `Backend/server.js` CORS `origin` for your production frontend URL.

## API reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/postPlaces` | Body: `{ "address": "..." }`. Returns `{ searchId, saved }`. |
| `GET` | `/api/analyzePlaces?searchId=<uuid>` | Scrapes menus and runs Gemini analysis. Returns `{ status, analyzed }`. |
| `GET` | `/api/getAllData?searchId=<uuid>` | Returns all restaurant documents for that search. |

## Limitations

- Only restaurants with a public **website** are included (needed for scraping).
- Many sites block scraping or use JavaScript-only menus; menu text may be empty or incomplete.
- Risk scores are **generic** (not tailored to a specific user’s allergen list).
- Analysis is automated and can be wrong—use it as a starting point, not a guarantee.

## Author

Samuel Yu

## License

MIT
