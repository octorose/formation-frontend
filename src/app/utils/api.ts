
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
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      const newAccessToken = await refreshToken(
        localStorage.getItem("refresh_token") as string
      );
      const newResponse = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
      if (!newResponse.ok) {
        throw new Error("Failed to fetch data");
      }
      return newResponse.json();
    }

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return response.json();
  } catch (error: any) {
    // Specify 'any' for the error type
    throw new Error(`Fetch request failed: ${(error as Error).message}`);
  }
};

const postWithAuth = async (
  url: string,
  data: any,
  options: FetchOptions = {}
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      method: "POST",
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      const newAccessToken = await refreshToken(
        localStorage.getItem("refresh_token") as string
      );
      const newResponse = await fetch(`${API_URL}${url}`, {
        ...options,
        method: "POST",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!newResponse.ok) {
        throw new Error("Failed to fetch data");
      }
      return newResponse.json();
    }

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return response.json();
  } catch (error: any) {
    throw new Error(`POST request failed: ${(error as Error).message}`);
  }
};

const deleteWithAuth = async (
  url: string,
  options: FetchOptions = {}
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      method: "DELETE",
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      const newAccessToken = await refreshToken(
        localStorage.getItem("refresh_token") as string
      );
      const newResponse = await fetch(`${API_URL}${url}`, {
        ...options,
        method: "DELETE",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
      if (!newResponse.ok) {
        throw new Error("Failed to fetch data");
      }
      return newResponse.json();
    }

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return response.json();
  } catch (error: any) {
    // Specify 'any' for the error type
    throw new Error(`DELETE request failed: ${(error as Error).message}`);
  }
};

const putWithAuth = async (
  url: string,
  data: any,
  options: FetchOptions = {}
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      method: "PUT",
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      const newAccessToken = await refreshToken(
        localStorage.getItem("refresh_token") as string
      );
      const newResponse = await fetch(`${API_URL}${url}`, {
        ...options,
        method: "PUT",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${newAccessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!newResponse.ok) {
        throw new Error("Failed to fetch data");
      }
      return newResponse.json();
    }

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return response.json();
  } catch (error: any) {
    // Specify 'any' for the error type
    throw new Error(`PUT request failed: ${(error as Error).message}`);
  }
};

export { fetchWithAuth, postWithAuth, deleteWithAuth, putWithAuth };
