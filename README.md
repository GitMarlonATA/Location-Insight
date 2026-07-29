# Location Insight

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-336791?logo=postgresql&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?logo=openai&logoColor=white)

Click anywhere on an interactive map and get an **AI-generated description of that place** — landmarks, the type of area, and notable nearby features. A full-stack TypeScript app that combines maps, reverse geocoding, and a large language model.

## How it works

1. Pick a point on the map (Leaflet + OpenStreetMap tiles), starting from your browser's geolocation.
2. The server reverse-geocodes the coordinates via **Nominatim** to resolve a human-readable address.
3. It prompts **OpenAI** to describe what's around that location in under 150 words.
4. Each lookup is saved to **PostgreSQL** so you can revisit your history.

## Tech stack

- **Frontend** — React 18 + Vite, TypeScript, Tailwind CSS, Radix UI / shadcn/ui, Framer Motion, TanStack Query, Wouter, Recharts
- **Backend** — Node.js + Express, OpenAI API, Nominatim (OpenStreetMap) reverse geocoding
- **Data** — PostgreSQL with Drizzle ORM (+ drizzle-zod), Passport session auth
- **Tooling** — tsx, esbuild, Drizzle Kit, Vite

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/location/describe` | Given `{ latitude, longitude }`, returns an AI description and the resolved address |
| `GET`  | `/api/location/history` | Returns recent location lookups |

## Getting started

### Prerequisites
- Node.js 20+
- A PostgreSQL database
- An OpenAI API key

### Run locally
```bash
npm install
npm run db:push     # create the schema with Drizzle
npm run dev         # start the dev server
```

### Environment
```
DATABASE_URL=postgres://user:pass@host:5432/dbname
AI_INTEGRATIONS_OPENAI_API_KEY=sk-...
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
```

## Notes

Originally prototyped on Replit. Map tiles © OpenStreetMap contributors; geocoding via Nominatim.

---
Built by [Marlon Ticora](https://github.com/GitMarlonATA) · [LinkedIn](https://www.linkedin.com/in/marlon-augusto-ticora-alvarez-fullstack-ml/)
