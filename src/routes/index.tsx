import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { BusinessListPage } from "../pages/BusinessListPage";
import { EditBusinessPage } from "../pages/EditBusinessPage";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { NewBusinessPage } from "../pages/NewBusinessPage";
import { RegisterPage } from "../pages/RegisterPage";
import { TryPage } from "../pages/TryPage";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/busniness/try/:uuid" element={<TryPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/busninessList" element={<BusinessListPage />} />
          <Route path="/newbusniness" element={<NewBusinessPage />} />
          <Route path="/busniness/:uuid" element={<EditBusinessPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
