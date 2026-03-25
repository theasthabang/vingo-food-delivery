import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

function UsegetCurrentUser() {
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
        if (error.response?.status === 401) {
          // ✅ user not logged in → normal case
          dispatch(setUserData(null));
        } else {
          console.error("Fetch user error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { loading }; // 👈 important
}

export default UsegetCurrentUser;