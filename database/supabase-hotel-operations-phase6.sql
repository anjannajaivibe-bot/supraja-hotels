alter table hotel_staff_attendance
  add column if not exists marked_at timestamptz;

alter table hotel_staff_attendance
  add column if not exists recorded_by_employee_id uuid references hotel_employees(id) on delete set null;

alter table hotel_staff_attendance
  add column if not exists recorded_by_employee_name text;

alter table hotel_staff_attendance
  add column if not exists shift_id uuid references hotel_shifts(id) on delete set null;

create table if not exists hotel_checklist_entries (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete restrict,
  checklist_date date not null default current_date,
  checklist_type text not null check (checklist_type in ('shift_start','daily','shift_end')),
  scope_key text not null,
  item_key text not null,
  item_label text not null,
  is_completed boolean not null default false,
  completed_at timestamptz,
  completed_by_employee_id uuid references hotel_employees(id) on delete set null,
  completed_by_employee_name text,
  shift_id uuid references hotel_shifts(id) on delete set null,
  notes text,
  recorded_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(hotel_id, scope_key, checklist_type, item_key)
);

create index if not exists hotel_checklist_entries_hotel_date_idx
on hotel_checklist_entries(hotel_id, checklist_date desc, checklist_type);

create index if not exists hotel_checklist_entries_shift_idx
on hotel_checklist_entries(shift_id, checklist_type);

alter table hotel_checklist_entries enable row level security;
