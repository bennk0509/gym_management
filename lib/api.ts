export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiGet(path: string) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiPost(path: string, data: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let errorMessage = `Added failed (${res.status})`;

    try {
      const data = await res.json();
      if (data?.message) {
        errorMessage = data.message;
      }
    } catch {
      // fallback nếu body không phải JSON
    }

    throw new Error(errorMessage);
  }
  return res.json();
}

export async function apiDelete(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      let errorMessage = `Delete failed (${res.status})`;
  
      try {
        // đọc nội dung JSON từ backend nếu có
        const data = await res.json();
        if (data?.message) {
          errorMessage = data.message; // lấy message từ NestJS
        }
      } catch {
        // fallback nếu body không phải JSON
      }
  
      throw new Error(errorMessage);
    }
    return res.json();
}

export async function apiPut(endpoint: string, data: any) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let errorMessage = `Edited failed (${res.status})`;

    try {
      const data = await res.json();
      if (data?.message) {
        errorMessage = data.message;
      }
    } catch {
      // fallback nếu body không phải JSON
    }

    throw new Error(errorMessage);
  }
  return res.json();
}

export async function apiPatch(endpoint: string, data: any) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = `Edited failed (${res.status})`;

    try {
      const body = await res.json();
      if (body?.message) {
        errorMessage = body.message; // NestJS error message
      }
    } catch {
      // Non-JSON fallback
    }

    throw new Error(errorMessage);
  }

  return res.json();
}