export function parseOpeningCash(value: unknown): { amount: number; error?: never } | { error: string; amount?: never } {
  if (value == null || (typeof value === "string" && value.trim() === "")) {
    return { error: "Opening cash is mandatory. Enter 0 if there is no cash on hand." };
  }
  if (
    (typeof value !== "number" && typeof value !== "string") ||
    (typeof value === "string" && !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value.trim()))
  ) {
    return { error: "Opening cash must be a valid amount of 0 or more." };
  }
  const amount = Math.round(Number(value) * 100) / 100;
  if (!Number.isFinite(amount) || amount < 0 || Number(value) < 0 || amount > 9999999999.99) {
    return { error: "Opening cash must be a valid amount of 0 or more." };
  }
  return { amount };
}
