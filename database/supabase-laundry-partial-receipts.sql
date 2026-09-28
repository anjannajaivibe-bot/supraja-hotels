create table if not exists hotel_laundry_receipts (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references hotel_laundry_batches(id) on delete cascade,
  item_id uuid not null references hotel_laundry_items(id) on delete cascade,
  received_date date not null,
  quantity_received integer not null default 0 check (quantity_received >= 0),
  rewash_qty integer not null default 0 check (rewash_qty >= 0),
  missing_qty integer not null default 0 check (missing_qty >= 0),
  damaged_qty integer not null default 0 check (damaged_qty >= 0),
  remarks text,
  recorded_by text not null,
  created_at timestamptz not null default now()
);
create index if not exists hotel_laundry_receipts_batch_idx on hotel_laundry_receipts(batch_id, received_date desc, created_at desc);
create index if not exists hotel_laundry_receipts_item_idx on hotel_laundry_receipts(item_id, received_date desc, created_at desc);
alter table hotel_laundry_receipts enable row level security;
comment on table hotel_laundry_receipts is 'Append-only laundry receipt transactions. Existing cumulative laundry history remains in hotel_laundry_items.';