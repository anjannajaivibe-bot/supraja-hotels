// Daily checks belong to a calendar date; shift checks belong to the whole shift,
// including entries saved before midnight during a night shift.
export function checklistScopeFilter(date: string, shiftIds: string[]) {
  const clauses = [`and(checklist_type.eq.daily,checklist_date.eq.${date},scope_key.eq.daily:${date})`];
  if (shiftIds.length) {
    clauses.push(`shift_id.in.(${shiftIds.join(",")})`);
    clauses.push(`scope_key.in.(${shiftIds.map((id) => `shift:${id}`).join(",")})`);
  }
  return `&or=${encodeURIComponent(`(${clauses.join(",")})`)}`;
}
