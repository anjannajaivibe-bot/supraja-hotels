alter table hotel_checklist_entries
  add column if not exists cash_handover_amount numeric(12,2);

comment on column hotel_checklist_entries.cash_handover_amount is
  'Cash amount handed over when the shift-end cash reconciliation checklist item is completed. Zero is valid and must be explicitly entered.';

create index if not exists hotel_checklist_entries_cash_handover_idx
  on hotel_checklist_entries(hotel_id, checklist_date desc)
  where cash_handover_amount is not null;
