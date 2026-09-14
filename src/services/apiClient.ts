const AZURE_PROD_API_URL = 'https://formwellness-api-enajfpamcjcgfpfj.canadacentral-01.azurewebsites.net/api';
const LOCAL_DEV_API_URL = 'http://localhost:5000/api';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? AZURE_PROD_API_URL : LOCAL_DEV_API_URL);

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
  }

  const json: ApiResponse<T> = await response.json();
  if (!json.success) {
    throw new Error(json.message || 'API operation reported failure');
  }

  return json.data;
}
