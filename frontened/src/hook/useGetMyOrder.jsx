import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/userSlice";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userData?._id) return; // ✅ FIX: only run when user exists

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          `${serverUrl}/api/order/my-orders`,
          { withCredentials: true }
        );

        dispatch(setMyOrders(result.data));
      } catch (error) {
        if (error.response?.status === 401) {
          // ✅ normal: user not authenticated
          console.warn("Unauthorized - please login");
        } else {
          console.error(
            "Fetch orders error:",
            error?.response?.data || error.message
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userData?._id]); // ✅ better dependency

  return { loading };
}

export default useGetMyOrders;