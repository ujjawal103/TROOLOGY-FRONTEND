import React from "react";

const ProjectCard = ({
  project,
  onClick,
}) => {

  const statusColor = {
    "Pending":
      "bg-yellow-100 text-yellow-700",

    "In-Progress":
      "bg-blue-100 text-blue-700",

    "Completed":
      "bg-green-100 text-green-700",
  };

  return (
    <div
      onClick={() => onClick(project)}
      className="
        bg-white
        rounded-2xl
        shadow-md
        p-5
        cursor-pointer
        hover:shadow-xl
        transition
      "
    >

      <div className="flex justify-between items-start">

        <h2 className="font-bold text-lg">
          {project.title}
        </h2>

        <span
          className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${statusColor[project.status]}
          `}
        >
          {project.status}
        </span>

      </div>

      <p className="text-gray-500 mt-3 line-clamp-2">
        {project.description}
      </p>

      <div className="mt-5 flex justify-between text-sm text-gray-500">

        <span>
          👥 {project.assignedUsers?.length || 0}
        </span>

        <span>
          📎 {project.attachments?.length || 0}
        </span>

      </div>

    </div>
  );
};

export default ProjectCard;