import React from "react";

const SchemesTable = ({ schemes, onEdit, onDelete }) => {
  if (!schemes?.length) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center text-gray-600">
        No schemes found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full">
        <thead className="bg-blue-100">
          <tr>
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Category</th>
            <th className="text-left p-4">Ministry</th>
            <th className="text-left p-4">Benefit</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schemes.map((scheme) => (
            <tr key={scheme?.id} className="border-t">
              <td className="p-4">
                <p className="font-semibold text-gray-800">{scheme?.name || "-"}</p>
                {scheme?.description && (
                  <p className="text-xs text-gray-500 mt-1">{scheme.description}</p>
                )}
              </td>
              <td className="p-4">
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  {scheme?.category || "General"}
                </span>
              </td>
              <td className="p-4">{scheme?.ministry || "-"}</td>
              <td className="p-4">{scheme?.benefit || "-"}</td>
              <td className="p-4">
                <button
                  onClick={() => onEdit(scheme)}
                  className="bg-amber-500 text-white px-3 py-1 rounded mr-2 hover:bg-amber-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(scheme)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchemesTable;

