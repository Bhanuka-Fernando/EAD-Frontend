import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleGate from "./auth/RoleGate";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BackofficeDashboard from "./pages/BackofficeDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import Unauthorized from "./pages/Unauthorized";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },

  {
    element: <ProtectedRoute />, // requires a valid token
    children: [
      { path: "/dashboard", element: <Dashboard /> },

      {
        element: <RoleGate allowed={["Backoffice"]} />,
        children: [
          { path: "/backoffice", element: <BackofficeDashboard /> },
          { path: "/register", element: <Register /> },
        ],
      },
      {
        element: <RoleGate allowed={["Operator"]} />,
        children: [
          { path: "/operator", element: <OperatorDashboard /> },
        ],
      },

      { path: "/unauthorized", element: <Unauthorized /> },
    ],
  },

  { path: "*", element: <Login /> }
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
