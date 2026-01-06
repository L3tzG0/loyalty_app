import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Rewards from "./pages/Rewards";
import Tenants from "./pages/Tenants";
import Profile from "./pages/Profile";
import More from "./pages/More";
import FooterNav from "./components/Navbar";
import Info from "./pages/Info";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import TransactionHistory from "./pages/transactionHistory";

import { Toaster } from "react-hot-toast";
// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import Feedback from "./pages/Feedback";
import AdminUserFeedback from "./pages/admin/AdminUserFeedback";
import AdminUserFeedbackDetail from "./pages/admin/AdminUserFeedbackDetail";
import AdminNav from "./components/AdminNavbar";
import ScrollToTop from "./components/ScrollToTop";
import AdminTenant from "./pages/admin/AdminTenant";
import AdminAddTenant from "./pages/admin/AdminAddTenant";
import AdminTenantDetail from "./pages/admin/AdminTenantDetail";
import AdminReward from "./pages/admin/AdminReward";
import AdminAddReward from "./pages/admin/AdminAddReward";
import AdminRewardDetail from "./pages/admin/AdminRewardDetail";
import AdminPromotion from "./pages/admin/AdminPromotion";
import AdminAddPromotion from "./pages/admin/AdminAddPromotion";
import AdminPromotionDetail from "./pages/admin/AdminPromotionDetail";

export default function App() {

    {/* Footer navigation bar (not shown on login) */}
    const location = useLocation(); // 👈 this makes the path reactive
    const hideFooterOn = ["/", "/signup", "/reset-password"];
    const isAdminRoute = location.pathname.startsWith("/admin");

    const shouldShowFooter = !hideFooterOn.includes(location.pathname) && !isAdminRoute;

    return (
    <div className="flex flex-col bg-[#121212] min-h-screen text-[#F5F5F5]">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1E1E1E",
            color: "#F5F5F5",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
        />
      
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/more" element={<More />} />
        <Route path="/info" element={<Info />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/feedback" element={<Feedback />} />

        {/* ADMIN PAGES */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
              <AdminNav />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <AdminProtectedRoute>
              <AdminUserDetail />
              <AdminNav />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <AdminProtectedRoute>
              <AdminUserFeedback />
              <AdminNav />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/feedback/:id"
          element={
            <AdminProtectedRoute>
              <AdminUserFeedbackDetail />
              <AdminNav />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/tenants"
          element={
            <AdminProtectedRoute>
              <AdminTenant />
              <AdminNav />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/tenants/form"
          element={
            <AdminProtectedRoute>
              <AdminAddTenant />
              <AdminNav />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/tenants/:id"
          element={
            <AdminProtectedRoute>
              <AdminTenantDetail />
              <AdminNav />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/rewards"
          element={
            <AdminProtectedRoute>
              <AdminReward />
              <AdminNav />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/rewards/form"
          element={
            <AdminProtectedRoute>
              <AdminAddReward />
              <AdminNav />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/rewards/:id"
          element={
            <AdminProtectedRoute>
              <AdminRewardDetail />
              <AdminNav />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/promotions"
          element={
            <AdminProtectedRoute>
              <AdminPromotion />
              <AdminNav />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/promotions/form"
          element={
            <AdminProtectedRoute>
              <AdminAddPromotion />
              <AdminNav />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/promotions/:id"
          element={
            <AdminProtectedRoute>
              <AdminPromotionDetail />
              <AdminNav />
            </AdminProtectedRoute>
          }
        />
      </Routes>

      {shouldShowFooter && <FooterNav />}    
      </div>
  );
}
