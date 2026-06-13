import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

const Profile = () => {

  const {
    user,
    setUser,
  } = useAuth();

  const token =
    localStorage.getItem("token");

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [formData, setFormData] =
    useState({
      firstName:
        user?.firstName || "",

      lastName:
        user?.lastName || "",
    });



  const handleChange = (e) => {

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));

    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));

  };



  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        setErrors({});

        const res =
          await axios.put(
            `${import.meta.env.VITE_BASE_URL}user/profile/update`,
            formData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        toast.success(
          "Profile updated successfully"
        );

        setUser(
          res.data.user
        );

      } catch (error) {

        const backendErrors =
          error?.response?.data?.errors;

        if (
          backendErrors
        ) {

          const formattedErrors =
            {};

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
            error?.response?.data
              ?.message ||
              "Failed to update profile"
          );

        }

      } finally {

        setLoading(false);

      }

    };



  return (
    <div className="max-w-3xl mx-auto">

      <div className="bg-white rounded-2xl shadow p-8">

        <h1 className="text-3xl font-bold mb-8">
          My Profile
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >

          {/* First Name */}

          <div>

            <label className="block mb-2 font-medium">
              First Name
            </label>

            <input
              type="text"
              name="firstName"
              value={
                formData.firstName
              }
              onChange={
                handleChange
              }
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

            <label className="block mb-2 font-medium">
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              value={
                formData.lastName
              }
              onChange={
                handleChange
              }
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

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              value={
                user?.email || ""
              }
              disabled
              className="w-full border rounded-lg p-3 bg-gray-100"
            />

          </div>

          {/* Role */}

          <div>

            <label className="block mb-2 font-medium">
              Role
            </label>

            <input
              type="text"
              value={
                user?.role || ""
              }
              disabled
              className="w-full border rounded-lg p-3 bg-gray-100 capitalize"
            />

          </div>

          <button
            type="submit"
            disabled={
              loading
            }
            className="w-full bg-black text-white py-3 rounded-lg"
          >

            {loading
              ? "Updating..."
              : "Update Profile"}

          </button>

        </form>

      </div>

    </div>
  );
};

export default Profile;