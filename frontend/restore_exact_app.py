import sys

app_code = """import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// App functionality imports
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import JudgeDashboard from "./pages/JudgeDashboard";
import CreateEvent from "./pages/CreateEvent";
import AddTeam from "./pages/AddTeam";
import AddJudge from "./pages/AddJudge";
import Leaderboard from "./pages/Leaderboard";

// AWS Amplify imports
import { Authenticator, SelectField, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/login" element={<Navigate to="/admin" replace />} />

      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/create-event" element={<ProtectedRoute allowedRole="admin"><CreateEvent /></ProtectedRoute>} />
      <Route path="/add-team" element={<ProtectedRoute allowedRole="admin"><AddTeam /></ProtectedRoute>} />
      <Route path="/add-judge" element={<ProtectedRoute allowedRole="admin"><AddJudge /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute allowedRole="admin"><Leaderboard /></ProtectedRoute>} />
      
      <Route path="/judge" element={<ProtectedRoute allowedRole="judge"><JudgeDashboard /></ProtectedRoute>} />
    </Routes>
  );
}

// Background utility to sync Amplify auth with our local auth state
function AuthSynchronizer({ amplifyUser }) {
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (amplifyUser && !isAuthenticated) {
      const userRole = amplifyUser.attributes?.["custom:role"]?.toLowerCase() ||
                       amplifyUser.signInUserSession?.idToken?.payload?.["custom:role"]?.toLowerCase() ||
                       "admin";

      login(userRole, amplifyUser.username || "AWS_User");
    }
  }, [amplifyUser, isAuthenticated, login]);

  return null;
}

function App() {
  const components = {
    SignUp: {
      FormFields() {
        const { validationErrors } = useAuthenticator();

        return (
          <>
            <Authenticator.SignUp.FormFields />
            <SelectField
              label="Role"
              name="custom:role"
              descriptiveText="Select your role (Admin or Judge)"
              hasError={!!validationErrors?.['custom:role']}
              errorMessage={validationErrors?.['custom:role']}
            >
              <option value="admin">Admin</option>
              <option value="judge">Judge</option>
            </SelectField>
          </>
        );
      }
    }
  };

  return (
    <Authenticator
      components={components}
      signUpAttributes={["email", "name", "given_name", "family_name"]}
      formFields={{
        signUp: {
          email: { order: 1 },
          name: { order: 2, label: "Full Name", required: true },
          given_name: { order: 3, label: "First Name", required: false },
          family_name: { order: 4, label: "Last Name", required: false }
        },
      }}
    >
      {({ signOut, user }) => (
        <BrowserRouter>
          <AuthProvider>
            <AuthSynchronizer amplifyUser={user} />

            <div className="fixed bottom-4 right-4 z-50 text-right">
                <div className="bg-slate-900 border border-slate-700 shadow-xl rounded-xl p-4 flex flex-col gap-2">
                    <span className="text-emerald-400 font-bold text-xs">AWS User: {user?.username}</span>
                    <span className="text-emerald-500 font-medium text-[10px] uppercase">
                        Role: {user?.attributes?.["custom:role"] || "N/A"}
                    </span>
                    <button onClick={signOut} className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-1.5 px-4 rounded-lg transition-colors text-sm shadow-md">
                        Sign Out AWS Session
                    </button>
                </div>
            </div>

            <Toaster position="top-right" />
            <AppRoutes />

          </AuthProvider>
        </BrowserRouter>
      )}
    </Authenticator>
  );
}

export default App;
"""

with open(r'e:\Vcc\frontend\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(app_code)
