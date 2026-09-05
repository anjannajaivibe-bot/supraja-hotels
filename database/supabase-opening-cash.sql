alter table hotel_checklist_entries
  add column if not exists opening_cash_amount numeric(12,2);

comment on column hotel_checklist_entries.opening_cash_amount is
  'Cash on hand recorded when the shift-start opening cash checklist item is completed. Zero is valid and must be explicitly entered.';

create index if not exists hotel_checklist_entries_opening_cash_idx
  on hotel_checklist_entries(hotel_id, checklist_date desc)
  where opening_cash_amount is not null;
