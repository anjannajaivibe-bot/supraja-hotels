function getSupabaseConfig(table = "hotel_click_events") {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase tracking environment variables are missing.");
  }

  return {
    endpoint: `${url.replace(/\/$/, "")}/rest/v1/${table}`,
    serviceRoleKey,
  };
}

export async function supabaseRequest(
  searchParams: string,
  init: RequestInit = {},
  table = "hotel_click_events"
) {
  const { endpoint, serviceRoleKey } = getSupabaseConfig(table);

  return fetch(`${endpoint}${searchParams}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
}
