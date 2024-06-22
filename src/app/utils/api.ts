const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TokenResponse {
  access: string;
  refresh: string;
}

const refreshToken = async (refreshToken: string): Promise<string> => {
  const response = await fetch(`${API_URL}/api/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (response.ok) {
    const data: TokenResponse = await response.json();
    localStorage.setItem("access_token", data.access);
    return data.access;
  } else {
    throw new Error("Failed to refresh token");
  }
};

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

const fetchWithAuth = async (
  url: string,
  options: FetchOptions = {}
): Promise<any> => {  
    let response = await fetch(`${url}`, {
        ...options,
        headers: {
            ...options.headers,
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    });

  if (response.status === 401) {
    const newAccessToken = await refreshToken(
      localStorage.getItem("refresh_token") as string
    );
    response = await fetch(`${url}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

export { fetchWithAuth };
