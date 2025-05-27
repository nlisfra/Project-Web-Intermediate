const API_URL = "https://story-api.dicoding.dev/v1";

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data.loginResult;
}

export async function getStories(token) {
  const response = await fetch(`${API_URL}/stories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch stories");
  }

  return data.listStory;
}

export async function postStory(token, formData) {
  const response = await fetch(`${API_URL}/stories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal mengirim cerita");
  }

  return result;
}

export async function registerUser(name, email, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Registrasi gagal");
  }

  return result;
}
