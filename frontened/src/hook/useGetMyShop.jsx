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
    if (!userData?._id) return; // ✅ only run if user exists

    const fetchShop = async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-my`,
          { withCredentials: true }
        );

        dispatch(setMyShopData(result.data));
      } catch (error) {
        if (error.response?.status === 404) {
          // ✅ user has no shop yet (normal case)
          dispatch(setMyShopData(null));
        } else if (error.response?.status === 401) {
          console.warn("Unauthorized - please login");
        } else {
          console.error(
            "Fetch shop error:",
            error?.response?.data || error.message
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [userData?._id]); // ✅ important fix

  return { loading };
}

export default useGetMyShop;