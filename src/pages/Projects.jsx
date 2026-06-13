import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

import ProjectCard from "../components/ProjectCard";
import ProjectDetailsModal from "../components/ProjectDetailsModal";
import CreateProjectModal from "../components/CreateProjectModal";
import EditProjectModal from "../components/EditProjectModal";

const Projects = () => {

  const { user } = useAuth();

  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [showCreateModal, setShowCreateModal] =
    useState(false);



  const fetchProjects = async () => {

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}project`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(res.data.projects || []);

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to fetch projects"
      );

    }

  };



  const fetchUsers = async () => {

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.users || []);

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to fetch users"
      );

    }

  };



  useEffect(() => {

    const loadData = async () => {

      try {

        await Promise.all([
          fetchProjects(),
          fetchUsers(),
        ]);

      } finally {

        setLoading(false);

      }

    };

    loadData();

  }, []);


 const handleEditClick = (project) => {

  setSelectedProject(null);

  setEditingProject(project);

  setShowEditModal(true);

};


  const handleDeleteProject = async (
    projectId
  ) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Project deleted successfully"
      );

      setSelectedProject(null);

      fetchProjects();

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to delete project"
      );

    }

  };



  const handleStatusUpdate = async (
    projectId,
    status
  ) => {

    try {

      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}project/status/${projectId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Project status updated"
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

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Projects
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all project activities
          </p>

        </div>

        {user?.role === "admin" && (

          <button
            onClick={() =>
              setShowCreateModal(true)
            }
            className="bg-black text-white px-5 py-3 rounded-lg"
          >
            + Create Project
          </button>

        )}

      </div>



      {/* Empty State */}

      {projects.length === 0 && (

        <div className="bg-white rounded-2xl p-10 text-center shadow">

          <h2 className="text-xl font-semibold">
            No Projects Found
          </h2>

          <p className="text-gray-500 mt-2">
            Create your first project.
          </p>

        </div>

      )}



      {/* Grid */}

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



      {/* Create Modal */}

      {showCreateModal && (

        <CreateProjectModal
          users={users}
          onClose={() =>
            setShowCreateModal(false)
          }
          onSuccess={fetchProjects}
        />

      )}



      {/* Details Modal */}

      {selectedProject && (

        <ProjectDetailsModal
          project={selectedProject}
          currentUser={user}
          onClose={() =>
            setSelectedProject(null)
          }
          onDelete={handleDeleteProject}
          onEdit={handleEditClick}
          onStatusUpdate={
            handleStatusUpdate
          }
        />

      )}


      {/* Edit Modal */}

        {showEditModal && editingProject && (

        <EditProjectModal
            project={editingProject}
            users={users}
            onClose={() => {

            setShowEditModal(false);
            setEditingProject(null);

            }}
            onSuccess={() => {

            fetchProjects();

            setShowEditModal(false);
            setEditingProject(null);

            }}
        />
        )}

    </div>
  );
};

export default Projects;