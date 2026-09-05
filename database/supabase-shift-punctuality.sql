alter table hotel_shifts
  add column if not exists shift_type text
    check (shift_type in ('morning','night')),
  add column if not exists scheduled_start_at timestamptz,
  add column if not exists scheduled_end_at timestamptz,
  add column if not exists is_late boolean not null default false,
  add column if not exists late_minutes integer not null default 0,
  add column if not exists late_reason text;

create index if not exists hotel_shifts_punctuality_idx
on hotel_shifts(hotel_id, started_at desc, is_late);
