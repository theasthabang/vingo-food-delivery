import React, { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setLocation } from "./redux/mapSlice";

// 🔥 Lazy load pages
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const ForgotPassword = lazy(() => import("./pages/Forgot_paswd"));
const Home = lazy(() => import("./pages/Home"));
const CreateEditShop = lazy(() => import("./pages/CreateEditShop"));
const AddItem = lazy(() => import("./pages/AddItem"));
const EditItem = lazy(() => import("./pages/EditItem"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckOut = lazy(() => import("./pages/CheackOut"));
const OrderPlaced = lazy(() => import("./pages/OrderPlaced"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const TrackOrderPage = lazy(() => import("./pages/TrackOrderPage"));
const Shop = lazy(() => import("./pages/Shop"));

// Hooks
import useGetCurrentUser from "./hook/UsegetCurrentUser";
import useGetCity from "./hook/UseGetCity";
import useGetMyshop from "./hook/useGetMyShop";
import useGetShopByCity from "./hook/useGetShopByCity";
import useGetItemsByCity from "./hook/useGetItemByCity";
import useGetMyOrders from "./hook/useGetMyOrder";
import useUpdateLocation from "./hook/useUpdateLocation";

export const serverUrl = import.meta.env.VITE_API_URL;

function App() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // ✅ Always fetch user
  useGetCurrentUser();

  // ✅ Only run when logged in
  if (userData) {
    useUpdateLocation();
    useGetCity();
    useGetMyshop();
    useGetShopByCity();
    useGetItemsByCity();
    useGetMyOrders();
  }

  // 📍 Location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }));
      },
      (error) => console.log("Location denied", error)
    );
  }, [dispatch]);

  // 🔌 Socket (optimized)
  useEffect(() => {
    if (!userData) return;

    const socketInstance = io(serverUrl, {
      autoConnect: true,
      auth: {
        token: localStorage.getItem("token"), // ✅ use token instead of cookies
      },
    });

    socketInstance.on("connect", () => {
      socketInstance.emit("identity", { userId: userData._id });
    });

    return () => socketInstance.disconnect();
  }, [userData]);

  return (
    <Suspense fallback={<div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>}>
      <Routes>

        {/* Public */}
        <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />

        {/* Private */}
        <Route path="/" element={userData ? <Home /> : <Navigate to="/signin" />} />
        <Route path="/create-edit-shop" element={userData ? <CreateEditShop /> : <Navigate to="/signin" />} />
        <Route path="/add-item" element={userData ? <AddItem /> : <Navigate to="/signin" />} />
        <Route path="/edit-item/:itemId" element={userData ? <EditItem /> : <Navigate to="/signin" />} />
        <Route path="/cart" element={userData ? <CartPage /> : <Navigate to="/signin" />} />
        <Route path="/checkout" element={userData ? <CheckOut /> : <Navigate to="/signin" />} />
        <Route path="/order-placed" element={userData ? <OrderPlaced /> : <Navigate to="/signin" />} />
        <Route path="/my-orders" element={userData ? <MyOrders /> : <Navigate to="/signin" />} />
        <Route path="/track-order/:orderId" element={userData ? <TrackOrderPage /> : <Navigate to="/signin" />} />
        <Route path="/shop/:shopId" element={userData ? <Shop /> : <Navigate to="/signin" />} />

      </Routes>
    </Suspense>
  );
}

export default App;