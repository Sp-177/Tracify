import { useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = (setUsersData, userId, familyId) => {
  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");

      // Join family room
      socket.emit("joinFamily", { userId, familyId });
    });

    // Listen for location updates from family members
    socket.on("usersData", (updatedUsers) => {
      console.log("Received updated family locations:", updatedUsers);
      setUsersData(Object.values(updatedUsers)); // Convert object to array
    });

    // Get geolocation and send updates every 5 seconds
    const sendLocationUpdate = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("updateLocation", { userId, familyId, latitude, longitude });
          },
          (error) => console.error("Geolocation error:", error),
          { enableHighAccuracy: true }
        );
      }
    };

    const interval = setInterval(sendLocationUpdate, 5000);

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [setUsersData, userId, familyId]);
};


export { useSocket }