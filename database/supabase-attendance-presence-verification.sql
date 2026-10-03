-- Attendance presence verification
-- Applied to Supabase project "Supraja Hotels" on 2026-10-03.
-- Existing attendance history is preserved.

alter table public.hotels
  add column if not exists attendance_latitude double precision,
  add column if not exists attendance_longitude double precision,
  add column if not exists attendance_radius_m integer not null default 100,
  add column if not exists attendance_verification_mode text not null default 'off';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'hotels_attendance_verification_mode_check') then
    alter table public.hotels add constraint hotels_attendance_verification_mode_check
      check (attendance_verification_mode in ('off','observe','enforce'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'hotels_attendance_radius_check') then
    alter table public.hotels add constraint hotels_attendance_radius_check
      check (attendance_radius_m between 25 and 500);
  end if;
end $$;

update public.hotels set attendance_latitude=17.45212880093779, attendance_longitude=78.37846297462835, attendance_radius_m=100, attendance_verification_mode='enforce' where code='cyber-view';
update public.hotels set attendance_latitude=17.494703099705735, attendance_longitude=78.32400007462928, attendance_radius_m=100, attendance_verification_mode='enforce' where code='residency';
update public.hotels set attendance_latitude=17.495346900000005, attendance_longitude=78.31920789678956, attendance_radius_m=100, attendance_verification_mode='enforce' where code='lodge';

create table if not exists public.hotel_attendance_verifications (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id),
  subject_type text not null check (subject_type in ('employee','staff')),
  employee_id uuid references public.hotel_employees(id),
  staff_member_id uuid references public.hotel_staff_members(id),
  action text not null check (action in ('reception_start','cleaning_start')),
  code_hash text not null,
  expires_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','verified','consumed','expired','cancelled')),
  latitude double precision,
  longitude double precision,
  accuracy_m double precision,
  distance_m double precision,
  device_id text,
  photo_path text,
  photo_captured boolean not null default false,
  review_required boolean not null default false,
  verification_note text,
  verified_at timestamptz,
  consumed_at timestamptz,
  created_by text not null,
  created_at timestamptz not null default now(),
  constraint hotel_attendance_verification_subject_check check (
    (subject_type='employee' and employee_id is not null and staff_member_id is null) or
    (subject_type='staff' and staff_member_id is not null and employee_id is null)
  )
);

create index if not exists hotel_attendance_verifications_code_hash_idx on public.hotel_attendance_verifications(code_hash);
create index if not exists hotel_attendance_verifications_hotel_created_idx on public.hotel_attendance_verifications(hotel_id,created_at desc);
create index if not exists hotel_attendance_verifications_pending_idx on public.hotel_attendance_verifications(status,expires_at) where status='pending';
create index if not exists hotel_attendance_verifications_employee_idx on public.hotel_attendance_verifications(employee_id) where employee_id is not null;
create index if not exists hotel_attendance_verifications_staff_idx on public.hotel_attendance_verifications(staff_member_id) where staff_member_id is not null;
alter table public.hotel_attendance_verifications enable row level security;

alter table public.hotel_shifts add column if not exists attendance_verification_id uuid references public.hotel_attendance_verifications(id);
alter table public.hotel_staff_attendance add column if not exists attendance_verification_id uuid references public.hotel_attendance_verifications(id);
create index if not exists hotel_shifts_attendance_verification_idx on public.hotel_shifts(attendance_verification_id);
create index if not exists hotel_staff_attendance_verification_idx on public.hotel_staff_attendance(attendance_verification_id);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('attendance-selfies','attendance-selfies',false,262144,array['image/jpeg'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
