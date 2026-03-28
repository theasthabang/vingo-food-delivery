import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";
import axios from "axios";
import { serverUrl } from "../App";

function useGetMyShop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Only run for logged-in owners
    if (!userData?._id || userData?.role !== "owner") return;

    const fetchShop = async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-my`,
          { withCredentials: true }
        );
        dispatch(setMyShopData(result.data));
      } catch (error) {
        if (error?.response?.status === 404) {
          dispatch(setMyShopData(null)); // no shop yet — normal
        } else if (error?.response?.status === 401) {
          dispatch(setMyShopData(null)); // ✅ clear stale data on auth failure
        } else {
          console.error("Fetch shop error:", error?.response?.data || error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [userData?._id, dispatch]); // ✅ dispatch added

  return { loading };
}

export default useGetMyShop;