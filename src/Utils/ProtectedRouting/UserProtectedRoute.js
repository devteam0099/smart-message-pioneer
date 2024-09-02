import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { handleLocalStorageClear } from "../helper";

const UserProtectedRoute = () => {
  const auth = document.cookie.includes("auth_session");
  const role = atob(localStorage.getItem("role"));
  console.log({ auth, role });
  if (!auth || !role) {
    handleLocalStorageClear();
    return <Navigate to="/" />;
  }

  if (role === "USER!" && auth) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default UserProtectedRoute;
