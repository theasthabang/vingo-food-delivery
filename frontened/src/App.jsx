import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";  // capital S and capital I
import ForgotPassword from "./pages/Forgot_paswd";
import useGetCurrentUser from "./hook/UsegetCurrentUser";
import {  useSelector } from "react-redux";
import Home from "./pages/Home";
import useGetCity from "./hook/UseGetCity";
import useGetMyshop from "./hook/useGetMyShop";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import useGetShopByCity from "./hook/useGetShopByCity";
import useGetItemsByCity from "./hook/useGetItemByCity";
import CartPage from "./pages/CartPage";
import CheckOut from "./pages/CheackOut";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";
import useGetMyOrders from "./hook/useGetMyOrder";
import useUpdateLocation from "./hook/useUpdateLocation";
import TrackOrderPage from "./pages/TrackOrderPage";
import Shop from "./pages/Shop";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { setLocation } from "./redux/mapSlice";
import {  socket } from "./socket";
//import { setSocket } from './redux/userSlice'

export const serverUrl = import.meta.env.VITE_API_URL;

function App() {
   const { userData } = useSelector((state) => state.user); // ← was missing!
  const dispatch = useDispatch();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }));
      },
      (error) => console.log("Location denied", { error })
    );
  }, []);
  

  useEffect(() => {
    if (userData) {
      socket.emit("identity", { userId: userData._id });
    }
  }, [userData?._id]);
  useGetCurrentUser();
  useUpdateLocation();
  useGetCity();
  useGetMyshop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();

  useEffect(() => {
    const socketInstance = io(serverUrl, { withCredentials: true });
    //dispatch(setSocket(socketInstance));
    socketInstance.on("connect", () => {
      if (userData) {
        socketInstance.emit("identity", { userId: userData._id });
      }
    });
    return () => {
      socketInstance.disconnect();
    };
  }, [userData?._id]);

  return (
    <Routes>
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/create-edit-shop"
        element={userData ? <CreateEditShop /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/add-item"
        element={userData ? <AddItem /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/edit-item/:itemId"
        element={userData ? <EditItem /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/cart"
        element={userData ? <CartPage /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/checkout"
        element={userData ? <CheckOut /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/order-placed"
        element={userData ? <OrderPlaced /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/my-orders"
        element={userData ? <MyOrders /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/track-order/:orderId"
        element={userData ? <TrackOrderPage /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/shop/:shopId"
        element={userData ? <Shop /> : <Navigate to={"/signin"} />}
      />
    </Routes>
  );
}

export default App;
