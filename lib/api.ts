export const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

// ===========================
// GET
// ===========================
export async function apiGet(path: string) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ===========================
// POST
// ===========================
export async function apiPost(path: string, data: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let error = `Added failed (${res.status})`;

    try {
      const msg = await res.json();
      if (msg?.message) error = msg.message;
    } catch {}

    throw new Error(error);
  }

  return res.json();
}

// ===========================
// DELETE
// ===========================
export async function apiDelete(path: string) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    let msg = `Delete failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

// ===========================
// PUT
// ===========================
export async function apiPut(path: string, data: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`Edited failed (${res.status})`);

  return res.json();
}

// ===========================
// PATCH
// ===========================
export async function apiPatch(path: string, data: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`Edited failed (${res.status})`);

  return res.json();
}
