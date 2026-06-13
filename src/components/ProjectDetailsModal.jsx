import React from "react";

const ProjectDetailsModal = ({
  project,
  onClose,
  onDelete,
  currentUser,
  onEdit,
  onStatusUpdate,
}) => {

  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            {project.title}
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>

        </div>

        <p className="text-gray-600 mb-6">
          {project.description}
        </p>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <h3 className="font-semibold mb-2">
              Status
            </h3>

            <p>{project.status}</p>

          </div>

          <div>

            <h3 className="font-semibold mb-2">
              Created By
            </h3>

            <p>
              {project.createdBy?.firstName}{" "}
              {project.createdBy?.lastName}
            </p>

          </div>

          <div>

            <h3 className="font-semibold mb-2">
              Start Date
            </h3>

            <p>
              {new Date(
                project.startDate
              ).toLocaleDateString()}
            </p>

          </div>

          <div>

            <h3 className="font-semibold mb-2">
              End Date
            </h3>

            <p>
              {new Date(
                project.endDate
              ).toLocaleDateString()}
            </p>

          </div>

        </div>

        {/* Users */}

        <div className="mt-8">

          <h3 className="font-semibold mb-3">
            Assigned Users
          </h3>

          <div className="space-y-2">

            {project.assignedUsers?.map((user) => (

              <div
                key={user._id}
                className="border rounded-lg p-3"
              >
                <p>
                  {user.firstName} {user.lastName}
                </p>

                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
              </div>

            ))}

          </div>

        </div>

        {/* Attachments */}

        <div className="mt-8">

          <h3 className="font-semibold mb-3">
            Attachments
          </h3>

          <div className="grid md:grid-cols-3 gap-4">

            {project.attachments?.map(
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

        {/* User Status Update */}

        {currentUser?.role === "user" && (

          <div className="mt-8">

            <select
              defaultValue={project.status}
              onChange={(e) =>
                onStatusUpdate(
                  project._id,
                  e.target.value
                )
              }
              className="border rounded-lg p-3"
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

          </div>

        )}

        {/* Admin Actions */}

        {currentUser?.role === "admin" && (

          <div className="mt-8 flex justify-end">

             <button
                onClick={() => onEdit(project)}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg"
            >
                Edit Project
            </button>

            <button
              onClick={() =>
                onDelete(project._id)
              }
              className="bg-red-500 text-white px-5 py-2 rounded-lg"
            >
              Delete Project
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default ProjectDetailsModal;