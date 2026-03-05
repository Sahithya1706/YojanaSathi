import React, { useState } from "react";

const ManageSchemes = () => {

  const [schemes,setSchemes] = useState(
    JSON.parse(localStorage.getItem("schemes")) || []
  )

  const [newScheme,setNewScheme] = useState("")

  const addScheme = () => {

    const updated = [...schemes,newScheme]

    setSchemes(updated)

    localStorage.setItem("schemes",JSON.stringify(updated))

    setNewScheme("")

  }

  const deleteScheme = (index) => {

    const updated = schemes.filter((_,i)=>i !== index)

    setSchemes(updated)

    localStorage.setItem("schemes",JSON.stringify(updated))

  }

  return (

    <div className="p-10 bg-blue-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Manage Government Schemes
      </h1>

      <div className="flex gap-4 mb-8">

        <input
          className="border p-3 rounded w-96"
          placeholder="Add new scheme"
          value={newScheme}
          onChange={(e)=>setNewScheme(e.target.value)}
        />

        <button
          onClick={addScheme}
          className="bg-blue-700 text-white px-6 rounded"
        >
          Add
        </button>

      </div>

      <div className="bg-white shadow rounded">

        {schemes.map((s,i)=>(
          <div
            key={i}
            className="flex justify-between p-4 border-b"
          >
            <span>{s}</span>

            <button
              onClick={()=>deleteScheme(i)}
              className="text-red-500"
            >
              Delete
            </button>

          </div>
        ))}

      </div>

    </div>
  );
};

export default ManageSchemes;