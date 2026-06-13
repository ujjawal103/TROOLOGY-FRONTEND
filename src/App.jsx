import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import MyProjects from "./pages/MyProjects";

import Users from "./pages/Users";
import Projects from "./pages/Projects";

import PublicRoute from "./pages/PublicRoute";
import ProtectedRoute from "./pages/ProtectedRoute";
import UserProtectedRoute from "./pages/UserProtectedRoute";
import AdminProtectedRoute from "./pages/AdminProtectedRoute";

import DashboardLayout from "./layouts/DashboardLayout";

const App = () => {
  return (
    <>
      <Routes>

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<Home />}
          />

          <Route
            path="profile"                //   http://localhost:5173/profile
            element={<Profile />}
          />

          <Route
            path="my-projects"
            element={
              <UserProtectedRoute>
                <MyProjects />
              </UserProtectedRoute>
            }
          />
















          <Route
            path="users"
            element={
              <AdminProtectedRoute>
                <Users />
              </AdminProtectedRoute>
            }
          />


          <Route
            path="projects"
            element={
              <AdminProtectedRoute>
                <Projects />
              </AdminProtectedRoute>
            }
          />

        </Route>

      </Routes>

      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </>
  );
};

export default App;