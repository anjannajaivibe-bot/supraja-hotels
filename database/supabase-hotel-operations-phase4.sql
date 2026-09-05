create table if not exists hotel_housekeeping_checks (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete restrict,
  room_id uuid not null references hotel_rooms(id) on delete restrict,
  room_no text not null,
  status text not null default 'pending' check (status in ('pending','cleaning','ready','issue')),
  cleaned_by_staff_id uuid references hotel_staff_members(id) on delete set null,
  cleaned_by_name text,
  notes text,
  recorded_by text not null,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists hotel_housekeeping_one_open_room
on hotel_housekeeping_checks(room_id)
where status in ('pending','cleaning','issue');

create table if not exists hotel_shift_handovers (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete restrict,
  outgoing_username text not null,
  outgoing_name text not null,
  incoming_username text,
  incoming_name text,
  cash_handover numeric(12,2) not null default 0,
  occupied_rooms integer not null default 0,
  pending_arrivals integer not null default 0,
  pending_payments numeric(12,2) not null default 0,
  open_complaints integer not null default 0,
  open_maintenance integer not null default 0,
  master_key_status text,
  notes text,
  status text not null default 'submitted' check (status in ('submitted','accepted')),
  submitted_at timestamptz not null default now(),
  accepted_at timestamptz,
  accepted_by text,
  created_at timestamptz not null default now()
);

create index if not exists hotel_housekeeping_hotel_created_idx on hotel_housekeeping_checks(hotel_id,created_at desc);
create index if not exists hotel_shift_handovers_hotel_created_idx on hotel_shift_handovers(hotel_id,created_at desc);

alter table hotel_housekeeping_checks enable row level security;
alter table hotel_shift_handovers enable row level security;

-- Trusted server routes use SUPABASE_SERVICE_ROLE_KEY. No anonymous policies are created.
