import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  username: string;
  // Add other properties if needed
}

export const getUserNameFromToken = (): string | null => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return null;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.username;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};