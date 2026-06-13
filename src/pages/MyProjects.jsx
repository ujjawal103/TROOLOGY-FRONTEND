import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

import ProjectCard from "../components/ProjectCard";
import ProjectDetailsModal from "../components/ProjectDetailsModal";

const MyProjects = () => {

  const { user } = useAuth();

  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedProject,
    setSelectedProject] =
    useState(null);



  const fetchProjects = async () => {

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}project`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setProjects(
        res.data.projects || []
      );

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to fetch projects"
      );

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchProjects();

  }, []);



  const handleStatusUpdate =
    async (projectId, status) => {

      try {

        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}project/status/${projectId}`,
          { status },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Status updated successfully"
        );

        fetchProjects();

      } catch (error) {

        toast.error(
          error?.response?.data?.message ||
          "Failed to update status"
        );

      }

    };



  if (loading) {

    return (
      <div className="flex justify-center items-center h-[60vh]">
        Loading Projects...
      </div>
    );

  }



  return (
    <div>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          My Projects
        </h1>

        <p className="text-gray-500 mt-1">
          Projects assigned to you
        </p>

      </div>



      {projects.length === 0 && (

        <div className="bg-white rounded-2xl p-10 text-center shadow">

          <h2 className="text-xl font-semibold">
            No Projects Assigned
          </h2>

          <p className="text-gray-500 mt-2">
            You currently don't have any assigned projects.
          </p>

        </div>

      )}



      {projects.length > 0 && (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {projects.map((project) => (

            <ProjectCard
              key={project._id}
              project={project}
              onClick={setSelectedProject}
            />

          ))}

        </div>

      )}



      {selectedProject && (

        <ProjectDetailsModal
          project={selectedProject}
          currentUser={user}
          onClose={() =>
            setSelectedProject(null)
          }
          onStatusUpdate={
            handleStatusUpdate
          }
        />

      )}

    </div>
  );
};

export default MyProjects;