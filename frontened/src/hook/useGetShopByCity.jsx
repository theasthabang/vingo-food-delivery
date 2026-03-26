import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInMyCity } from "../redux/userSlice";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { currentCity, userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Guard — need both user and city
    if (!currentCity || !userData?._id) return;

    const fetchShops = async () => {
      setLoading(true);
      try {
        // ✅ Cache check with expiry
        const cached = sessionStorage.getItem(`shops-${currentCity}`);
        if (cached) {
          const { data, cachedAt } = JSON.parse(cached);
          if (Date.now() - cachedAt < CACHE_TTL) {
            dispatch(setShopsInMyCity(data));
            return; // ✅ finally handles setLoading(false)
          }
          // expired — fall through to fresh fetch
        }

        const result = await axios.get(
          `${serverUrl}/api/shop/get-by-city/${currentCity}`,
          { withCredentials: true }
        );

        dispatch(setShopsInMyCity(result.data));

        // ✅ Store with timestamp
        sessionStorage.setItem(
          `shops-${currentCity}`,
          JSON.stringify({ data: result.data, cachedAt: Date.now() })
        );

      } catch (error) {
        console.error("Fetch shops error:", error?.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [currentCity, dispatch]); // ✅ dispatch added

  return { loading };
}

export default useGetShopByCity;