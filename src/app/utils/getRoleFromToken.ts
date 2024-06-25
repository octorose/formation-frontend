import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  role: string;
  // Add other properties if needed
}

export const getRoleFromToken = (): string | null => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return null;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
