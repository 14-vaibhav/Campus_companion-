# Campus Companion

A one-stop app for campus life. Students can find nearby **restaurants, laundries, salons, cabs and auto-rickshaws** in one place, with prices, timings and contact numbers. Admins manage the listings and push notifications to students.

The project has two parts:

- **`backend/`** – REST API (Node.js, Express, PostgreSQL)
- **`frontend/`** – Web app (React + Vite), packaged for Android with Capacitor (`CampusHub`)

## Features

- **Service directories** for restaurants, laundries, salons, cabs and autos
  - Search, filter by location or open status, and paginated listings
  - Restaurant menu images, average cost for one, salon haircut and beard prices, laundry price per kg, driver fares
  - "Verified" and "open / available" badges
- **Authentication** with email and password (JWT) or Google sign-in
- **Favorites** to save the places you use most
- **Notifications** from admins, with an expiry date
- **Admin control center** to create, edit and delete listings, upload images and send notifications
- **Image uploads** stored on Cloudinary
- **Interactive API docs** with Swagger
- **Security:** Helmet, CORS allow-list, rate limiting (15 auth requests and 100 API requests per 15 minutes per IP), Joi validation, bcrypt-hashed passwords

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, react-hot-toast, react-dropzone, `@react-oauth/google` |
| Mobile | Capacitor (Android) |
| Backend | Node.js, Express 5, `pg`, JWT, bcryptjs, Joi, Multer |
| Database | PostgreSQL |
| Storage | Cloudinary |
| Docs | Swagger (swagger-jsdoc, swagger-ui-express) |

## Project Structure

```
Campus_companion-/
├── backend/
│   ├── database/        # schema.sql and init / seed scripts
│   └── src/
│       ├── config/      # db, cloudinary, swagger
│       ├── controllers/ # request handlers
│       ├── middleware/  # auth, admin, validation, errors
│       ├── modules/     # per-service controller / model / routes / service
│       ├── routes/      # route definitions mounted in app.js
│       ├── utils/
│       ├── app.js
│       └── server.js
└── frontend/
    └── src/
        ├── components/  # layout and reusable UI
        ├── context/     # Auth, Favorites, Notifications
        ├── pages/       # Login, Home, Profile, service pages, admin
        └── services/    # Axios API client and data services
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- A [Cloudinary](https://cloudinary.com) account (for image uploads)
- A Google OAuth client ID (optional, for Google sign-in)

### 1. Clone

```bash
git clone https://github.com/14-vaibhav/Campus_companion-.git
cd Campus_companion-
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/campus_companion
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=7d
ADMIN_SECRET_KEY=your-admin-secret
ALLOWED_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Create the tables and start the server:

```bash
node database/init.js        # creates all tables from schema.sql
npm run dev                  # development (nodemon)
# npm start                  # production
```

The API runs at `http://localhost:5000/api` and the Swagger docs at `http://localhost:5000/api-docs`.

To create an admin, register a user with `"role": "admin"`. You can also edit and run `node database/seed-admin.js`, which creates an admin user. Change the credentials in that file before you run it.

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

```bash
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run lint
```

The frontend calls `http://localhost:5000/api` in the browser and `http://10.0.2.2:5000/api` inside the Android emulator. Both are set in `frontend/src/services/api.js`.

### 4. Android app (optional)

```bash
cd frontend
npm run build
npx cap add android     # first time only
npx cap sync
npx cap open android
```

## API Overview

Base URL: `/api`. Send the token as `Authorization: Bearer <token>`.

| Resource | Endpoints | Access |
| --- | --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` | Public, `/me` needs a token |
| Restaurants | `/restaurants` | `GET` public, write is admin |
| Laundries | `/laundries` | `GET` public, write is admin |
| Salons | `/salons` | `GET` public, write is admin |
| Cabs | `/cabs` | `GET` public, write is admin |
| Autos | `/autos` | `GET` public, write is admin |
| Notifications | `/notifications` | See Swagger |
| Upload | `POST /upload` (field `image`) | Admin |

List endpoints support `?page=`, `?limit=`, `?offset=`, plus `?location=` and `?is_open=` (restaurants, laundries, salons) or `?is_verified=` (cabs, autos). Paginated responses look like:

```json
{ "total": 50, "limit": 10, "offset": 0, "page": 1, "data": [] }
```

See [`backend/BACKEND_FEATURES.txt`](backend/BACKEND_FEATURES.txt) for the full field reference, or open `/api-docs` on a running server.

## Frontend Routes

| Route | Description |
| --- | --- |
| `/` | Login / register |
| `/home` | Dashboard of services |
| `/services/restaurants`, `/salons`, `/laundries`, `/cabs`, `/autos` | Service listings |
| `/favorites` | Saved places |
| `/notifications` | Announcements |
| `/profile` | Current user |
| `/control-center` | Admin panel (admins only) |

## Contributing

Pull requests are welcome. Fork the repo, create a feature branch, and open a PR.

## Author

Built by [Vaibhav](https://github.com/14-vaibhav).
