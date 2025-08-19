const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * A helper function for making API requests.
 * @param endpoint The API endpoint to call (e.g., '/auth/login').
 * @param options The options for the fetch request.
 * @returns The JSON response from the API.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Throw an error with the message from the API, or a default one
    throw new Error(data.message || 'An API error occurred.');
  }

  return data;
}
