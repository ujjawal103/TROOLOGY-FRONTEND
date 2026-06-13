import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditProjectModal = ({
  project,
  users,
  onClose,
  onSuccess,
}) => {

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    startDate: project?.startDate
      ? project.startDate.split("T")[0]
      : "",
    endDate: project?.endDate
      ? project.endDate.split("T")[0]
      : "",
    status: project?.status || "Pending",
    assignedUsers:
      project?.assignedUsers?.map(
        (user) => user._id
      ) || [],
  });

  const [attachments, setAttachments] =
    useState([]);

  const handleChange = (e) => {

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  const handleUserSelect = (e) => {

    const selectedUsers = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setFormData((prev) => ({
      ...prev,
      assignedUsers: selectedUsers,
    }));

  };

  const handleFileChange = (e) => {

    const files = Array.from(
      e.target.files
    );

    if (files.length > 3) {

      toast.error(
        "Maximum 3 attachments allowed"
      );

      return;
    }

    setAttachments(files);

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      setErrors({});

      const payload = new FormData();

      payload.append(
        "title",
        formData.title
      );

      payload.append(
        "description",
        formData.description
      );

      payload.append(
        "startDate",
        formData.startDate
      );

      payload.append(
        "endDate",
        formData.endDate
      );

      payload.append(
        "status",
        formData.status
      );

      formData.assignedUsers.forEach(
        (id) => {
          payload.append(
            "assignedUsers",
            id
          );
        }
      );

      attachments.forEach((file) => {
        payload.append(
          "attachments",
          file
        );
      });

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}project/${project._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Project updated successfully"
      );

      onSuccess();

      onClose();

    } catch (error) {

      const backendErrors =
        error?.response?.data?.errors;

      if (backendErrors) {

        const formattedErrors = {};

        backendErrors.forEach(
          (err) => {
            formattedErrors[
              err.path
            ] = err.msg;
          }
        );

        setErrors(
          formattedErrors
        );

      } else {

        toast.error(
          error?.response?.data?.message ||
          "Failed to update project"
        );

      }

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Edit Project
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Title */}

          <div>

            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title}
              </p>
            )}

          </div>

          {/* Description */}

          <div>

            <textarea
              name="description"
              placeholder="Project Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 h-32"
            />

            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description}
              </p>
            )}

          </div>

          {/* Dates */}

          <div className="grid md:grid-cols-2 gap-4">

            <div>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startDate}
                </p>
              )}

            </div>

            <div>

              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.endDate}
                </p>
              )}

            </div>

          </div>

          {/* Status */}

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >

            <option value="Pending">
              Pending
            </option>

            <option value="In-Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

          </select>

          {/* Users */}

          <div>

            <label className="block mb-2 font-medium">
              Assigned Users
            </label>

            <select
              multiple
              value={formData.assignedUsers}
              onChange={handleUserSelect}
              className="w-full border rounded-lg p-3 h-40"
            >

              {users
                ?.filter(
                  (user) =>
                    user.role === "user"
                )
                .map((user) => (

                  <option
                    key={user._id}
                    value={user._id}
                  >
                    {user.firstName}{" "}
                    {user.lastName}
                  </option>

                ))}

            </select>

          </div>

          {/* Existing Attachments */}

          <div>

            <h3 className="font-semibold mb-3">
              Current Attachments
            </h3>

            <div className="grid md:grid-cols-3 gap-3">

              {project?.attachments?.map(
                (attachment, index) => (

                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border rounded-lg p-3 text-blue-600"
                  >
                    Attachment {index + 1}
                  </a>

                )
              )}

            </div>

          </div>

          {/* New Attachments */}

          <div>

            <label className="block mb-2 font-medium">
              Upload New Attachments
            </label>

            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.webp"
              onChange={handleFileChange}
            />

            <p className="text-xs text-gray-500 mt-1">
              Maximum 3 files
            </p>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            {loading
              ? "Updating..."
              : "Update Project"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default EditProjectModal;