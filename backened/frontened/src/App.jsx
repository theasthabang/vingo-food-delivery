import React, { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { ClipLoader } from "react-spinners";
import { setLocation } from "./redux/mapSlice";

// 🔥 Lazy loaded pages
const SignUp        = lazy(() => import("./pages/SignUp"));
const SignIn        = lazy(() => import("./pages/SignIn"));
const ForgotPassword = lazy(() => import("./pages/Forgot_paswd"));
const Home          = lazy(() => import("./pages/Home"));
const CreateEditShop = lazy(() => import("./pages/CreateEditShop"));
const AddItem       = lazy(() => import("./pages/AddItem"));
const EditItem      = lazy(() => import("./pages/EditItem"));
const CartPage      = lazy(() => import("./pages/CartPage"));
const CheckOut      = lazy(() => import("./pages/CheackOut"));
const OrderPlaced   = lazy(() => import("./pages/OrderPlaced"));
const MyOrders      = lazy(() => import("./pages/MyOrders"));
const TrackOrderPage = lazy(() => import("./pages/TrackOrderPage"));
const Shop          = lazy(() => import("./pages/Shop"));

// ✅ Hooks — all called unconditionally (each guards itself internally)
import useGetCurrentUser from "./hook/UsegetCurrentUser";
import useGetCity        from "./hook/UseGetCity";
import useGetMyshop      from "./hook/useGetMyShop";
import useGetShopByCity  from "./hook/useGetShopByCity";
import useGetItemsByCity from "./hook/useGetItemByCity";
import useGetMyOrders    from "./hook/useGetMyOrder";
import useUpdateLocation from "./hook/useUpdateLocation";

export const serverUrl = import.meta.env.VITE_API_URL;

// ── Full-screen loader shown while auth state is being resolved ──
const AuthLoader = () => (
  <div style={{
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    background: "#f8f8f9",
    fontFamily: "Inter, sans-serif",
  }}>
    <ClipLoader size={36} color="#1a3c2e" />
    <span style={{ fontSize: "0.82rem", color: "#aaa", fontWeight: 600 }}>
      Loading mealHunt…
    </span>
  </div>
);

function App() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // ── Auth: resolves loading state ──────────────────────────────
  // loading = true until we know if user is logged in or not
  const { loading } = useGetCurrentUser();

  // ── All data hooks — called unconditionally (Rules of Hooks) ──
  // Each hook has: if (!userData) return   inside it
  useUpdateLocation();
  useGetCity();
  useGetMyshop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();

  // ── Geolocation ───────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }));
      },
      (error) => console.warn("Location access denied:", error.message)
    );
  }, [dispatch]);

  // ── Socket ────────────────────────────────────────────────────
  useEffect(() => {
    if (!userData) return;

    const socket = io(serverUrl, {
      autoConnect: true,
      auth: { token: localStorage.getItem("token") },
    });

    socket.on("connect", () => {
      socket.emit("identity", { userId: userData._id });
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket connection error:", err.message);
    });

    return () => socket.disconnect();
  }, [userData]);

  // ── Block routes until we know auth state ─────────────────────
  // Prevents logged-in users from flashing /signin on refresh
  if (loading) return <AuthLoader />;

  return (
    <Suspense fallback={<AuthLoader />}>
      <Routes>

        {/* ── Public routes ── */}
        <Route path="/signup"          element={!userData ? <SignUp />         : <Navigate to="/" replace />} />
        <Route path="/signin"          element={!userData ? <SignIn />         : <Navigate to="/" replace />} />
        <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to="/" replace />} />

        {/* ── Private routes ── */}
        <Route path="/"                    element={userData ? <Home />          : <Navigate to="/signin" replace />} />
        <Route path="/create-edit-shop"    element={userData ? <CreateEditShop /> : <Navigate to="/signin" replace />} />
        <Route path="/add-item"            element={userData ? <AddItem />        : <Navigate to="/signin" replace />} />
        <Route path="/edit-item/:itemId"   element={userData ? <EditItem />       : <Navigate to="/signin" replace />} />
        <Route path="/cart"                element={userData ? <CartPage />       : <Navigate to="/signin" replace />} />
        <Route path="/checkout"            element={userData ? <CheckOut />       : <Navigate to="/signin" replace />} />
        <Route path="/order-placed"        element={userData ? <OrderPlaced />    : <Navigate to="/signin" replace />} />
        <Route path="/my-orders"           element={userData ? <MyOrders />       : <Navigate to="/signin" replace />} />
        <Route path="/track-order/:orderId" element={userData ? <TrackOrderPage /> : <Navigate to="/signin" replace />} />
        <Route path="/shop/:shopId"        element={userData ? <Shop />           : <Navigate to="/signin" replace />} />

      </Routes>
    </Suspense>
  );
}

export default App;