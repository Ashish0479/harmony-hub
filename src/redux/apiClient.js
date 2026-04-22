const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5500";
const AUTH_STORAGE_KEY = "hostelhub_auth";
const CSRF_HEADER_NAME = "X-CSRF-Token";
const CSRF_SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
let csrfTokenCache = null;

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
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const normalizedMethod = method.toUpperCase();
  const needsCsrf = !CSRF_SAFE_METHODS.has(normalizedMethod);

  const requestHeaders = { ...headers };
  if (!isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (needsCsrf) {
    const csrfToken = await getCsrfToken();
    requestHeaders[CSRF_HEADER_NAME] = csrfToken;
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    method: normalizedMethod,
    credentials: "include",
    headers: requestHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (response.status === 403 && needsCsrf) {
    csrfTokenCache = null;
    const freshToken = await getCsrfToken();
    requestHeaders[CSRF_HEADER_NAME] = freshToken;

    response = await fetch(`${API_BASE_URL}${path}`, {
      method: normalizedMethod,
      credentials: "include",
      headers: requestHeaders,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      signal,
    });
  }

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

async function getCsrfToken() {
  if (csrfTokenCache) {
    return csrfTokenCache;
  }

  const response = await fetch(`${API_BASE_URL}/csrf-token`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to initialize CSRF protection");
  }

  const payload = await parseResponse(response);
  const token = payload?.data?.csrfToken;

  if (!token) {
    throw new Error("Invalid CSRF token response");
  }

  csrfTokenCache = token;
  return csrfTokenCache;
}

export function getErrorMessage(error) {
  if (!error) return "Something went wrong";
  return error.message || "Something went wrong";
}
