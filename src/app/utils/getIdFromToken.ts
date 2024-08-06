import { jwtDecode } from "jwt-decode";
interface DecodedToken {
  user_id: number;
  // Add other properties if needed
}
export const getIdFromToken = (): number | null => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        return null;
    }
    
    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.user_id;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
    };
