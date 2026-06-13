import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import EditUserModal from "../components/EditUserModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });

  const token = localStorage.getItem("token");

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "User created successfully"
      );

      setShowCreateModal(false);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "user",
      });

      fetchUsers();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create user"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("User deleted");

      fetchUsers();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  const handleRoleChange = async (
    id,
    currentRole
  ) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}user/role/${id}`,
        {
          role:
            currentRole === "admin"
              ? "user"
              : "admin",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Role updated");

      fetchUsers();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update role"
      );
    }
  };

  const handleEdit = (user) => {

  setEditingUser(user);

  setShowEditModal(true);

};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        Loading Users...
      </div>
    );
  }

  return (
    <div>

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <h1 className="text-3xl font-bold">
          Users
        </h1>

        <button
          onClick={() =>
            setShowCreateModal(true)
          }
          className="bg-black text-white px-5 py-3 rounded-lg"
        >
          + Create User
        </button>

      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow overflow-x-auto">

        <table className="w-full min-w-[700px]">

          <thead className="bg-blue-300">

            <tr>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user._id}
                className="border-t"
              >

                <td className="p-4">
                  {user?.firstName}{" "}
                  {user?.lastName}
                </td>

                <td className="p-4">
                  {user?.email}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user?.role === "admin"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user?.role}
                  </span>

                </td>

                <td className="p-4">

                  <div className="flex gap-2 flex-wrap">

                    <button
                        onClick={() => handleEdit(user)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() =>
                        handleRoleChange(
                            user._id,
                            user.role
                        )
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                        Role
                    </button>

                    <button
                        onClick={() =>
                        handleDelete(user._id)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                        Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Create a user modal */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Create User
              </h2>

              <button
                onClick={() =>
                  setShowCreateModal(false)
                }
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleCreateUser}
              className="space-y-4"
            >

              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              >
                <option value="user">
                  User
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg"
              >
                Create User
              </button>

            </form>

          </div>

        </div>

      )}



      {
        showEditModal &&
        editingUser && (

            <EditUserModal
            user={editingUser}
            onClose={() => {

                setShowEditModal(false);
                setEditingUser(null);

            }}
            onSuccess={fetchUsers}
            />

        )
       }

    </div>
  );
};

export default Users;