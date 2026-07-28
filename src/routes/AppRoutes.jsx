import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { routesData } from "./routesData";
import DashLayout from "../layout/DashLayout/DashLayout";
import Loading from "../components/shared/Loading";
import Login from "../pages/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import usePermission from "../hooks/usePermission";

function RouteWrapper({ route }) {
  const { hasPermission } = usePermission();

  if (route.permission) {
    const permissions = Array.isArray(route.permission) ? route.permission : [route.permission];
    const hasAny = permissions.some(p => hasPermission(p));
    if (!hasAny) {
      return <Navigate to="/" replace />;
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      <route.component />
    </Suspense>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashLayout />}>
          {routesData?.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<RouteWrapper route={route} />}
            />
          ))}
        </Route>
      </Route>
    </Routes>
  );
}
