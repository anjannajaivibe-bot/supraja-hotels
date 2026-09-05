create table if not exists hotel_employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text not null default 'Manager / Receptionist',
  pin_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table hotel_shifts
  add column if not exists employee_id uuid references hotel_employees(id) on delete restrict;

create index if not exists hotel_employees_active_name_idx
on hotel_employees(is_active, name);

create unique index if not exists hotel_admin_users_one_login_per_hotel
on hotel_admin_users(hotel_id);

update hotels
set is_active = false
where code = 'saket';

alter table hotel_employees enable row level security;

-- Saket Banquet Hall is operated as part of Hotel Supraja Residency,
-- so it is retained for historical/reference integrity but removed from
-- active hotel login and monitoring selectors.
