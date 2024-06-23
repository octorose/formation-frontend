

const refreshToken = async (refreshToken:any) => {
    const api = process.env.API_URL;
  try {
    const response = await fetch(`http://localhost:8000/api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (response.status === 200) {
      const responseBody = await response.json();
      const accessToken = responseBody.access;
      
      // Store the new access token in local storage or state
      return { ok: true, access: accessToken };
    }
    return { ok: false };
  } catch (error) {
    console.error("Failed to refresh token", error);
    return { ok: false };
  }
};

export { refreshToken };
