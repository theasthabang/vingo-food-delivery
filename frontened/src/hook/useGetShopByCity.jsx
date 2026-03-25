import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInMyCity } from "../redux/userSlice";

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentCity) return; // ✅ FIX: avoid undefined API call

    const fetchShops = async () => {
      setLoading(true);

      try {
        // ✅ Cache check (BIG performance boost)
        const cache = sessionStorage.getItem(`shops-${currentCity}`);
        if (cache) {
          dispatch(setShopsInMyCity(JSON.parse(cache)));
          setLoading(false);
          return;
        }

        const result = await axios.get(
          `${serverUrl}/api/shop/get-by-city/${currentCity}`,
          { withCredentials: true }
        );

        dispatch(setShopsInMyCity(result.data));

        // ✅ Save to cache
        sessionStorage.setItem(
          `shops-${currentCity}`,
          JSON.stringify(result.data)
        );

      } catch (error) {
        console.error(
          "Fetch shops error:",
          error?.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [currentCity]);

  return { loading };
}

export default useGetShopByCity;