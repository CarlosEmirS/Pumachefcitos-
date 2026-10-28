const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  const response = await fetch(API_URL + path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Ocurrió un error al comunicarse con el servidor.");
  return data;
}

export function getPlaces(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) searchParams.set(key, value);
  });
  const query = searchParams.toString();
  return request("/places" + (query ? "?" + query : ""));
}

export function getPlace(id) { return request("/places/" + id); }
export function register(payload) { return request("/auth/register", { method:"POST", body:JSON.stringify(payload) }); }
export function login(payload) { return request("/auth/login", { method:"POST", body:JSON.stringify(payload) }); }
export function submitReview(payload, token) {
  return request("/reviews", {
    method:"POST",
    headers:{ Authorization:"Bearer " + token },
    body:JSON.stringify(payload),
  });
}
