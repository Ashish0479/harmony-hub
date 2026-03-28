const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5500";
const AUTH_STORAGE_KEY = "hostelhub_auth";

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : {};
}

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {}, signal } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error?.message ||
      payload?.error?.reason ||
      "Request failed";

    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;

    if (response.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    throw error;
  }

  return payload;
}

export function getErrorMessage(error) {
  if (!error) return "Something went wrong";
  return error.message || "Something went wrong";
}
