// src/App.tsx
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import ContactPage from "./pages/ContactsPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import Spinner from "./components/Spinner";
import { setLoadingHandler } from "./api";

function AppRoutes() {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate("/contacts", { replace: true });
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleAuthSuccess} />} />
      <Route path="/signup" element={<SignupPage onSignup={handleAuthSuccess} />} />
      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <ContactPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<LoginPage onLogin={handleAuthSuccess} />} />
    </Routes>
  );
}

function AppContent() {
  const { loading, setLoading } = useLoading();

  // Hook the API loader into context
  useEffect(() => {
    setLoadingHandler(setLoading);
  }, [setLoading]);

  return (
    <>
      {loading && <Spinner />}
      <AppRoutes />
    </>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LoadingProvider>
  );
}
