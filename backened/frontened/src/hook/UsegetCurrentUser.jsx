import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

function useGetCurrentUser() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/current`,
          { withCredentials: true }
        );
        dispatch(setUserData(result.data));
      } catch (error) {
        if (error?.response?.status === 401) {
          dispatch(setUserData(null)); // not logged in — expected
        } else {
          console.error("Fetch user error:", error);
          dispatch(setUserData(null)); // ✅ also clear on unexpected errors
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  return { loading };
}

export default useGetCurrentUser;