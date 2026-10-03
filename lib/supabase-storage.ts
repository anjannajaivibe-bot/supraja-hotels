function getStorageConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase storage environment variables are missing.");
  }
  return { url: url.replace(/\/$/, ""), serviceRoleKey };
}

function encodeObjectPath(path: string) {
  return path.split("/").filter(Boolean).map(encodeURIComponent).join("/");
}

export async function uploadAttendanceSelfie(path: string, bytes: Uint8Array) {
  const { url, serviceRoleKey } = getStorageConfig();
  return fetch(
    `${url}/storage/v1/object/attendance-selfies/${encodeObjectPath(path)}`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "image/jpeg",
        "x-upsert": "false",
      },
      body: bytes,
      cache: "no-store",
    },
  );
}

export async function downloadAttendanceSelfie(path: string) {
  const { url, serviceRoleKey } = getStorageConfig();
  return fetch(
    `${url}/storage/v1/object/authenticated/attendance-selfies/${encodeObjectPath(path)}`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    },
  );
}
