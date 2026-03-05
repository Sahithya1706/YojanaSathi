import React, { useState } from "react";

const ManageUsers = () => {

  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  const deleteUser = (id) => {

    const confirmDelete = window.confirm("Delete this user?");

    if (!confirmDelete) return;

    const updatedUsers = users.filter((u) => u.id !== id);

    setUsers(updatedUsers);

    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <div className="p-10 bg-blue-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-8">
        Registered Users
      </h1>

      {users.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center">
          No users registered yet
        </div>
      ) : (

        <table className="w-full bg-white shadow rounded overflow-hidden">

          <thead className="bg-blue-100">

            <tr>

              <th className="p-4 text-left">#</th>

              <th className="text-left">Name</th>

              <th className="text-left">Email</th>

              <th className="text-left">Phone</th>

              <th className="text-left">State</th>

              <th className="text-left">Registered</th>

              <th className="text-left">Action</th>

            </tr>

          </thead>

          <tbody>

            {users.map((u, i) => (

              <tr key={u.id || i} className="border-t">

                <td className="p-4">{i + 1}</td>

                <td>{u.name}</td>

                <td>{u.email}</td>

                <td>{u.phone || "-"}</td>

                <td>{u.state || "-"}</td>

                <td>{u.registeredAt || "-"}</td>

                <td>

                  <button
                    onClick={() => deleteUser(u.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
};

export default ManageUsers;