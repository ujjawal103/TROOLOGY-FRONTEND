import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Home = () => {

  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");



  useEffect(() => {

    if (!token || !user?._id) return;

    const fetchData = async () => {

      try {

        if (user.role === "admin") {

          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}dashboard/stats`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setStats(res.data.stats);

        } else {

          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}project`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setProjects(res.data.projects);
        }

      } catch (error) {

        toast.error(
          error?.response?.data?.message ||
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, [user?._id, user?.role]);



  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <h1 className="text-xl font-semibold">
          Loading Dashboard...
        </h1>
      </div>
    );
  }




  if (user.role === "admin") {

    const cards = [
      {
        title: "Total Users",
        value: stats?.totalUsers || 0,
      },
      {
        title: "Total Projects",
        value: stats?.totalProjects || 0,
      },
      {
        title: "Pending Projects",
        value: stats?.pendingProjects || 0,
      },
      {
        title: "In Progress",
        value: stats?.inProgressProjects || 0,
      },
      {
        title: "Completed",
        value: stats?.completedProjects || 0,
      },
      {
        title: "Ending Soon Within 7 Days",
        value: stats?.endingSoonProjects || 0,
      },
    ];

    return (
      <div>

        <h1 className="text-3xl font-bold mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              <h2 className="text-gray-500 text-sm">
                {card.title}
              </h2>

              <h1 className="text-4xl font-bold mt-3">
                {card.value}
              </h1>

            </div>
          ))}

        </div>

      </div>
    );
  }



  

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        My Dashboard
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

        <h2 className="text-gray-500">
          Assigned Projects
        </h2>

        <h1 className="text-4xl font-bold mt-2">
          {projects.length}
        </h1>

      </div>

      <div className="grid gap-4">

        {projects.map((project) => (

          <div
            key={project._id}
            className="bg-white rounded-2xl p-5 shadow"
          >

            <div className="flex justify-between items-center">

              <div>

                <h2 className="font-bold text-lg">
                  {project.title}
                </h2>

                <p className="text-gray-500 mt-1">
                  {project.description}
                </p>

              </div>

              <span className="px-3 py-1 rounded-full text-sm bg-slate-100">
                {project.status}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Home;