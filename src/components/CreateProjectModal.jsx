import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateProjectModal = ({
  users,
  onClose,
  onSuccess,
}) => {

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedUsers: [],
  });

  const [attachments, setAttachments] = useState([]);

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

    const files = Array.from(e.target.files);

    if (files.length > 3) {
      toast.error("Maximum 3 attachments allowed");
      return;
    }

    setAttachments(files);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setErrors({});
    try {

      setLoading(true);

      const payload = new FormData();

      payload.append("title", formData.title);
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

      formData.assignedUsers.forEach((id) => {
        payload.append("assignedUsers", id);
      });

      attachments.forEach((file) => {
        payload.append("attachments", file);
      });

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}project`,
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
        "Project created successfully"
      );

      onSuccess();
      onClose();

    } catch (error) {

        const backendErrors =
            error?.response?.data?.errors;

        if (backendErrors) {

            const formattedErrors = {};

            backendErrors.forEach((err) => {
            formattedErrors[err.path] = err.msg;
            });

            setErrors(formattedErrors);

        } else {

            toast.error(
            error?.response?.data?.message ||
            "Failed to create project"
            );

  }

} finally {

      setLoading(false);

    }

  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Create Project
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
          className="space-y-4"
        >

          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
                {errors.title}
            </p>
            )}

          <textarea
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 h-32"
            required
          />

          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
                {errors.description}
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border rounded-lg p-3"
              required
            />

            {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">
                {errors.startDate}
            </p>
            )}

            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border rounded-lg p-3"
              required
            />
            {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">
                {errors.endDate}
            </p>
            )}

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Assign Users
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

            {errors.assignedUsers && (
            <p className="text-red-500 text-sm mt-1">
                {errors.assignedUsers}
            </p>
            )}

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Attachments
            </label>

            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.webp"
              onChange={handleFileChange}
              className="w-full"
            />

            <p className="text-xs text-gray-500 mt-1">
              Maximum 3 files allowed
            </p>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            {loading
              ? "Creating..."
              : "Create Project"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default CreateProjectModal;