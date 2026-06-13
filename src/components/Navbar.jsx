import React from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = ({
  setSidebarOpen,
}) => {

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const handleLogout = () => {

    logout();

    toast.success("Logged out");

    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">

      <div className="h-16 px-4 md:px-6 flex items-center justify-between">

        {/* Left */}

        <div className="flex items-center gap-3">

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div>

            <h2 className="font-semibold text-lg">
              Welcome, {user?.firstName}
            </h2>

            <p className="text-xs text-slate-500 capitalize">
              {user?.role}
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
          >
            Logout
          </button>

        </div>

      </div>

    </header>
  );
};

export default Navbar;