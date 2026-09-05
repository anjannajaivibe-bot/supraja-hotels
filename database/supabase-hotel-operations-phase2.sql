create table if not exists hotel_bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text unique not null,
  hotel_id uuid not null references hotels(id) on delete restrict,
  source text not null default 'walk_in' check (source in ('walk_in','phone','whatsapp','website','ota','corporate','referral','management')),
  guest_name text not null,
  phone text,
  room_no text not null,
  check_in_date date not null default current_date,
  check_out_date date not null,
  nights integer not null default 1 check (nights > 0),
  approved_rate numeric(12,2) not null default 0 check (approved_rate >= 0),
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  status text not null default 'checked_in' check (status in ('reserved','checked_in','checked_out','cancelled')),
  created_by text not null,
  checked_in_at timestamptz,
  checked_out_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists hotel_payments (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete restrict,
  booking_id uuid not null references hotel_bookings(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  payment_type text not null default 'payment' check (payment_type in ('payment','refund')),
  payment_mode text not null check (payment_mode in ('cash','upi','card','bank_transfer','mixed')),
  transaction_ref text,
  recorded_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists hotel_daily_reconciliations (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete restrict,
  reconciliation_date date not null default current_date,
  opening_cash numeric(12,2) not null default 0,
  approved_payouts numeric(12,2) not null default 0,
  actual_closing_cash numeric(12,2) not null default 0,
  notes text,
  recorded_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(hotel_id, reconciliation_date)
);

create index if not exists hotel_bookings_hotel_status_idx on hotel_bookings(hotel_id, status, check_in_date desc);
create index if not exists hotel_bookings_hotel_created_idx on hotel_bookings(hotel_id, created_at desc);
create index if not exists hotel_payments_hotel_created_idx on hotel_payments(hotel_id, created_at desc);
create index if not exists hotel_payments_booking_idx on hotel_payments(booking_id, created_at desc);
create index if not exists hotel_daily_reconciliations_hotel_date_idx on hotel_daily_reconciliations(hotel_id, reconciliation_date desc);

alter table hotel_bookings enable row level security;
alter table hotel_payments enable row level security;
alter table hotel_daily_reconciliations enable row level security;

-- Operational access remains server-side only through SUPABASE_SERVICE_ROLE_KEY.
-- No anonymous policies are intentionally created.
