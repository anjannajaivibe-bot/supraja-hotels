create table if not exists hotel_rooms (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete cascade,
  room_no text not null,
  room_type text,
  status text not null default 'available' check (status in ('available','occupied','dirty','maintenance','blocked')),
  notes text,
  is_active boolean not null default true,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(hotel_id, room_no)
);

create table if not exists hotel_complaints (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete restrict,
  booking_id uuid references hotel_bookings(id) on delete set null,
  room_no text,
  guest_name text,
  category text not null default 'guest_service',
  priority text not null default 'normal' check (priority in ('normal','urgent','critical')),
  complaint text not null,
  status text not null default 'open' check (status in ('open','in_progress','resolved')),
  resolution text,
  created_by text not null,
  resolved_by text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists hotel_maintenance_tickets (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete restrict,
  room_no text,
  area text,
  category text not null default 'general',
  priority text not null default 'normal' check (priority in ('normal','urgent','critical')),
  issue text not null,
  status text not null default 'open' check (status in ('open','in_progress','resolved')),
  resolution text,
  created_by text not null,
  resolved_by text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table hotel_daily_reconciliations add column if not exists expected_cash numeric(12,2) not null default 0;
alter table hotel_daily_reconciliations add column if not exists cash_variance numeric(12,2) not null default 0;
alter table hotel_daily_reconciliations add column if not exists upi_total numeric(12,2) not null default 0;
alter table hotel_daily_reconciliations add column if not exists card_total numeric(12,2) not null default 0;
alter table hotel_daily_reconciliations add column if not exists bank_transfer_total numeric(12,2) not null default 0;
alter table hotel_daily_reconciliations add column if not exists status text not null default 'submitted' check (status in ('submitted','verified','variance_pending'));
alter table hotel_daily_reconciliations add column if not exists verified_by text;
alter table hotel_daily_reconciliations add column if not exists verified_at timestamptz;

create index if not exists hotel_rooms_hotel_status_idx on hotel_rooms(hotel_id,status);
create index if not exists hotel_complaints_hotel_status_idx on hotel_complaints(hotel_id,status,created_at desc);
create index if not exists hotel_maintenance_hotel_status_idx on hotel_maintenance_tickets(hotel_id,status,created_at desc);

alter table hotel_rooms enable row level security;
alter table hotel_complaints enable row level security;
alter table hotel_maintenance_tickets enable row level security;

-- Trusted server routes use SUPABASE_SERVICE_ROLE_KEY. No anon policies are created.
