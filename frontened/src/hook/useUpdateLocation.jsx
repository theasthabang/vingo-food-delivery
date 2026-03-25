import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useSelector } from "react-redux";

function useUpdateLocation() {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData?._id) return; // ✅ only run if logged in

    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    let watchId;

    const updateLocation = async (lat, lon) => {
      try {
        await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true }
        );
      } catch (error) {
        console.error(
          "Location update error:",
          error?.response?.data || error.message
        );
      }
    };

    let lastSentTime = 0;

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();

        // ✅ throttle: send every 15 seconds only
        if (now - lastSentTime < 15000) return;

        lastSentTime = now;

        updateLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (error) => {
        console.error("Location error:", error.message);
      },
      {
        enableHighAccuracy: true,
      }
    );

    // ✅ cleanup (VERY IMPORTANT)
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [userData?._id]);
}

export default useUpdateLocation;