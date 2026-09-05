create extension if not exists pgcrypto;

create table if not exists hotels (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into hotels (code, name) values
  ('cyber-view','Hotel Supraja Cyber View'),
  ('residency','Hotel Supraja Residency'),
  ('lodge','Hotel Supraja Lodge'),
  ('saket','Saket Banquet Hall')
on conflict (code) do update set name = excluded.name;

create table if not exists hotel_admin_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  display_name text not null,
  password_hash text not null,
  hotel_id uuid not null references hotels(id) on delete restrict,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists hotel_staff_members (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete cascade,
  name text not null,
  staff_type text not null default 'cleaning',
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists hotel_shifts (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete restrict,
  admin_username text not null,
  display_name text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  start_note text,
  end_note text,
  handover_note text,
  status text not null default 'active' check (status in ('active','closed')),
  created_at timestamptz not null default now()
);

create unique index if not exists hotel_shifts_one_active_user
on hotel_shifts(admin_username) where status = 'active';

create table if not exists hotel_staff_attendance (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete restrict,
  staff_member_id uuid not null references hotel_staff_members(id) on delete restrict,
  attendance_date date not null default current_date,
  status text not null check (status in ('present','absent','leave','half_day')),
  shift_label text,
  check_in_time time,
  check_out_time time,
  remarks text,
  recorded_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(staff_member_id, attendance_date)
);

create table if not exists hotel_operation_audit_log (
  id bigint generated always as identity primary key,
  hotel_id uuid references hotels(id) on delete set null,
  username text not null,
  actor_role text not null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists hotel_shifts_hotel_started_idx on hotel_shifts(hotel_id, started_at desc);
create index if not exists hotel_staff_attendance_hotel_date_idx on hotel_staff_attendance(hotel_id, attendance_date desc);
create index if not exists hotel_operation_audit_log_hotel_created_idx on hotel_operation_audit_log(hotel_id, created_at desc);

alter table hotels enable row level security;
alter table hotel_admin_users enable row level security;
alter table hotel_staff_members enable row level security;
alter table hotel_shifts enable row level security;
alter table hotel_staff_attendance enable row level security;
alter table hotel_operation_audit_log enable row level security;

-- These operational tables are accessed only by trusted server routes using
-- SUPABASE_SERVICE_ROLE_KEY. No anon policies are intentionally created.

-- To add a hotel login, generate a scrypt hash with the app helper format
-- "salt:hexhash" and insert it into hotel_admin_users. A master-admin user
-- management screen will be added in the next implementation phase.
