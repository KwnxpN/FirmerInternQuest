import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.tsx";
import Login from "@/pages/Login.tsx";
import Logs from "@/pages/Logs.tsx";
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Logs />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" richColors />
    </AuthProvider>
  )
}

export default App