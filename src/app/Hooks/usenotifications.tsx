import { useEffect, useRef, useState, useCallback } from "react";
import { refreshToken } from "@/utils/RefreshToken";

const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [groups, setGroups] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = useCallback(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found in local storage");
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket is already connected");
      return;
    }

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/?token=${token}`
    );

    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      setIsConnected(true);
      if (groups.length > 0) {
        socket.send(JSON.stringify({ action: "subscribe", groups: groups }));
      }
    };

    socket.onmessage = async (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data); // Add this line for debugging
      if (data.groups) {
        console.log("Groups received:", data.groups);
        setGroups(data.groups);
      } else if (data.notification_type === "role_notification") {
        console.log("Role notification received:", data.message);
        setNotifications((prev) => [...prev, data.message]);
      } else if (data.notification) {
        console.log("Notification received:", data.notification);
        if (data.notification.type === "absence_declaration") {
          const formattedMessage = (
            `Absence Declaration:\n` +
            `Employee: ${data.notification.personnel}\n` +
            `Date: ${data.notification.date}\n` +
            `Reason: ${data.notification.reason}\n`
          );

          setNotifications((prev) => [...prev, formattedMessage]);
        } else {
          setNotifications((prev) => [...prev, data.notification]);
        }
      } else if (
        data.error &&
        data.error.includes("Token is invalid or expired")
      ) {
        const refreshResult = await refreshToken(
          localStorage.getItem("refresh_token")
        );
        if (refreshResult.ok) {
          localStorage.setItem("access_token", refreshResult.access);
          socket.close(); // Close the current socket
          connectWebSocket(); // Reconnect with new token
        } else {
          console.error("Failed to refresh token");
          // Handle failed refresh (e.g., redirect to login)
        }
      }
    };

    socket.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log(`WebSocket connection closed, code: ${event.code}`);
      setIsConnected(false);
      if (event.code !== 1000) {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect WebSocket...");
          connectWebSocket();
        }, 5000);
      }
    };
  }, []); // Remove groups from dependency array

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
      }
    };
  }, [connectWebSocket]);

  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN && groups.length > 0) {
      wsRef.current.send(
        JSON.stringify({ action: "subscribe", groups: groups })
      );
    }
  }, [groups]);

  const closeWebSocket = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close(1000, "Client disconnected");
    }
  };

  return { notifications, isConnected, groups, closeWebSocket };
};

export default useNotifications;
