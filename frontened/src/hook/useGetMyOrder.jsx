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
    if (!userData?._id) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          `${serverUrl}/api/order/my-orders`,
          { withCredentials: true }
        );
        dispatch(setMyOrders(result.data));
      } catch (error) {
        if (error?.response?.status === 401) {
          dispatch(setMyOrders([])); // ✅ clear stale orders on auth failure
        } else {
          console.error("Fetch orders error:", error?.response?.data || error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userData?._id, dispatch]); // ✅ dispatch added to deps

  return { loading };
}

export default useGetMyOrders;