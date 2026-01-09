-- Database schema for Trip Weather App
-- Run in Supabase SQL Editor

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text
);

create table locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  label text not null,
  lat numeric not null,
  lon numeric not null
);

create table trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  notes text
);

create table forecast_snapshots (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  fetched_at timestamptz not null default now(),
  provider text not null,
  raw_json jsonb not null
);
