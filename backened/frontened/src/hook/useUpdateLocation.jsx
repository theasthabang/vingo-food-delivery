import axios from "axios";
import { useEffect, useRef } from "react";
import { serverUrl } from "../App";
import { useSelector, useDispatch } from "react-redux";
import { setLocation } from "../redux/mapSlice";

const THROTTLE_MS = 15000; // 15 seconds

function useUpdateLocation() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const lastSentTime = useRef(0); // ✅ persists across renders

  useEffect(() => {
    if (!userData?._id) return;

    if (!navigator.geolocation) {
      console.warn("Geolocation not supported by this browser."); // ✅
      return;
    }

    const updateLocation = async (lat, lon) => {
      try {
        await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Location update error:", error?.response?.data || error.message);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastSentTime.current < THROTTLE_MS) return; // ✅ ref-based throttle
        lastSentTime.current = now;

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // ✅ Update Redux so other components stay in sync
        dispatch(setLocation({ lat, lon }));

        // ✅ Update backend
        updateLocation(lat, lon);
      },
      (error) => {
        console.error("Watch position error:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,   // ✅ don't hang forever
        maximumAge: 30000 // ✅ accept 30s cached position
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId); // ✅ cleanup
    };
  }, [userData?._id, dispatch]);
}

export default useUpdateLocation;