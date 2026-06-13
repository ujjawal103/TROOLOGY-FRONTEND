import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditUserModal = ({
  user,
  onClose,
  onSuccess,
}) => {

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

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

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      setErrors({});

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}user/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "User updated successfully"
      );

      onSuccess();

      onClose();

    } catch (error) {

      const backendErrors =
        error?.response?.data?.errors;

      if (backendErrors) {

        const formattedErrors = {};

        backendErrors.forEach((err) => {
          formattedErrors[err.path] =
            err.msg;
        });

        setErrors(formattedErrors);

      } else {

        toast.error(
          error?.response?.data?.message ||
          "Failed to update user"
        );

      }

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl w-full max-w-lg p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Edit User
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

          {/* First Name */}

          <div>

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName}
              </p>
            )}

          </div>

          {/* Last Name */}

          <div>

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName}
              </p>
            )}

          </div>

          {/* Email */}

          <div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            {loading
              ? "Updating..."
              : "Update User"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default EditUserModal;