# Trip Weather App

A full-stack web application where users sign in with Google, save locations, create trips, and view weather for their trip locations and dates. Weather data is securely fetched via a Netlify serverless function so API keys are never exposed in client-side code.

## Live Demo

https://tripweatherapp.netlify.app

---

## Features

- Google sign-in via Supabase Auth
- Save locations (label, latitude, longitude)
- Create trips linked to saved locations
- View weather for each trip
- Weather API calls handled securely via Netlify Functions
- Supabase Postgres database with Row Level Security (RLS)
- Multi-user support with per-user data isolation

---

## Tech Stack

- **Frontend:** Vite + React
- **Authentication:** Supabase Auth (Google OAuth)
- **Database:** Supabase Postgres
- **Security:** Supabase Row Level Security (RLS)
- **Backend Functions:** Netlify Functions
- **Weather API:** OpenWeather
- **Hosting:** Netlify

---

## Supabase Configuration

### 1. Create a Supabase project
1. Go to https://supabase.com and create a new project.
2. In the Supabase dashboard, navigate to:
   - **Settings → API**
3. Copy:
   - **Project URL**
   - **anon public key**

These will be used as environment variables.

---

### 2. Database schema

The database consists of the following tables (see `supabase/schema.sql` for full SQL):

#### Profiles
- `id` (uuid, primary key, references `auth.users.id`)
- `email` (text)
- `name` (text)

#### locations
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → `Profiles.id`)
- `label` (text)
- `lat` (numeric)
- `lon` (numeric)

#### trips
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → `Profiles.id`)
- `location_id` (uuid, foreign key → `locations.id`)
- `start_date` (date)
- `end_date` (date)
- `notes` (text, optional)

#### forecast_snapshots
- `id` (uuid, primary key)
- `trip_id` (uuid, foreign key → `trips.id`)
- `fetched_at` (timestamp)
- `provider` (text)
- `raw_json` (jsonb)

---

### 3. Automatic profile creation on signup

A database trigger automatically creates a row in the `Profiles` table whenever a new user signs in for the first time via Supabase Auth. This ensures all users can immediately create locations and trips.

---

### 4. Row Level Security (RLS) decisions

Row Level Security is enabled on all user-owned tables.

- **Profiles**
  - Users can read, update, and insert only their own profile (`auth.uid() = id`)

- **locations**
  - Users can read, insert, update, and delete only rows where `user_id = auth.uid()`

- **trips**
  - Users can read, insert, update, and delete only rows where `user_id = auth.uid()`

- **forecast_snapshots**
  - Users can access only snapshots related to trips they own

This ensures complete data isolation between users.

---

## Google Auth Configuration

### 1. Create Google OAuth credentials
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create an **OAuth Client ID** (Web application)
3. Save the Client ID and Client Secret

---

### 2. Enable Google provider in Supabase
1. Supabase Dashboard → **Authentication → Providers → Google**
2. Enable Google
3. Paste the Google Client ID and Client Secret

---

### 3. Configure redirect URLs (important)

Supabase Dashboard → **Authentication → URL Configuration**

Set:
- https://tripweatherapp.netlify.app

- **Additional Redirect URLs**
http://localhost:5173
https://tripweatherapp.netlify.app

## Environment Variables (no secrets committed)

### Local development (`.env` file in project root)
Create a `.env` file (do not commit it):

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL_HERE
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY_HERE

### Netlify environment variables

In the Netlify dashboard → **Site settings → Environment variables**, set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `OPENWEATHER_API_KEY` (mark as secret)

Scopes:
- Build
- Functions

## Running the app locally

Install dependencies:

```bash
npm install
netlify dev
http://localhost:8888
