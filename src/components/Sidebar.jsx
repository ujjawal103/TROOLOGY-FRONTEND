import React from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {

  const { user } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-black text-white"
        : "hover:bg-slate-100"
    }`;

  return (
    <>
      {/* Overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72
          bg-white border-r border-slate-200
          transform transition-transform duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >

        {/* Header */}

        <div className="flex items-center justify-between p-6 border-b">

          <div>
            <h1 className="text-2xl font-bold">
              TaskFlow
            </h1>

            <p className="text-sm text-slate-500">
              Project Management
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={22} />
          </button>

        </div>

        {/* Navigation */}

        <div className="p-4">

          <nav className="space-y-2">

            <NavLink
              to="/"
              onClick={() => setSidebarOpen(false)}
              className={navLinkClass}
            >
              Dashboard
            </NavLink>

            {user?.role === "admin" && (
              <>
                <NavLink
                  to="/users"
                  onClick={() => setSidebarOpen(false)}
                  className={navLinkClass}
                >
                  Users
                </NavLink>

                <NavLink
                  to="/projects"
                  onClick={() => setSidebarOpen(false)}
                  className={navLinkClass}
                >
                  Projects
                </NavLink>
              </>
            )}

            {user?.role === "user" && (
              <>
              <NavLink
                to="/my-projects"
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass}
              >
                My Projects
              </NavLink>


              <NavLink
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className={navLinkClass}
            >
              Profile
            </NavLink>
              </>
            )}

            

          </nav>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;