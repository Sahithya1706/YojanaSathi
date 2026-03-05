import React, { useEffect, useState } from "react";
import { SCHEME_CATEGORIES } from "admin/constants/schemeCategories";

const EMPTY_FORM = {
  name: "",
  category: "General",
  occupation: "any",
  state: "all",
  incomeLimit: "",
  minAge: "",
  gender: "any",
  requiresLandOwnership: false,
  requiresStudent: false,
  ministry: "",
  benefit: "",
  description: "",
  portalUrl: "",
};

const SchemeForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData?.name || "",
        category: initialData?.category || "General",
        occupation: Array.isArray(initialData?.occupation) ? initialData.occupation[0] : "any",
        state: Array.isArray(initialData?.states) ? initialData.states[0] : "all",
        incomeLimit: initialData?.incomeLimit ?? "",
        minAge: initialData?.minAge ?? "",
        gender: initialData?.gender || "any",
        requiresLandOwnership: Boolean(initialData?.requiresLandOwnership),
        requiresStudent: Boolean(initialData?.requiresStudent),
        ministry: initialData?.ministry || "",
        benefit: initialData?.benefit || "",
        description: initialData?.description || "",
        portalUrl: initialData?.portalUrl || "",
      });
      return;
    }

    setFormData(EMPTY_FORM);
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (formError) setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setFormError("Scheme name is required.");
      return;
    }

    if (!formData.category) {
      setFormError("Scheme category is required.");
      return;
    }

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      occupation: [formData.occupation],
      states: [formData.state],
      incomeLimit: Number(formData.incomeLimit || 1000000),
      minAge: Number(formData.minAge || 0),
      ministry: formData.ministry.trim(),
      benefit: formData.benefit.trim(),
      description: formData.description.trim(),
      portalUrl: formData.portalUrl.trim(),
    });

    if (!initialData) {
      setFormData(EMPTY_FORM);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        {initialData ? "Edit Scheme" : "Add New Scheme"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Scheme Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter scheme name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            {SCHEME_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ministry</label>
          <input
            type="text"
            name="ministry"
            value={formData.ministry}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Ministry or department"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Occupation</label>
          <select
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="any">Any</option>
            <option value="farmer">Farmer</option>
            <option value="student">Student</option>
            <option value="salaried">Salaried</option>
            <option value="self_employed">Self Employed</option>
            <option value="daily_wage">Daily Wage</option>
            <option value="unemployed">Unemployed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="all or state name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Income Limit</label>
          <input
            type="number"
            name="incomeLimit"
            value={formData.incomeLimit}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="300000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Minimum Age</label>
          <input
            type="number"
            name="minAge"
            value={formData.minAge}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="18"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="any">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="requiresLandOwnership"
              checked={formData.requiresLandOwnership}
              onChange={handleChange}
            />
            Requires Land
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="requiresStudent"
              checked={formData.requiresStudent}
              onChange={handleChange}
            />
            Student Only
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Benefit</label>
          <input
            type="text"
            name="benefit"
            value={formData.benefit}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Benefit details"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 min-h-[90px]"
            placeholder="Short scheme description"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Portal URL</label>
          <input
            type="url"
            name="portalUrl"
            value={formData.portalUrl}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="https://example.gov.in"
          />
        </div>
      </div>

      {formError && <p className="text-red-600 text-sm mt-3">{formError}</p>}

      <div className="flex gap-3 mt-5">
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
          {initialData ? "Update Scheme" : "Add Scheme"}
        </button>
        {initialData && (
          <button type="button" onClick={onCancel} className="border px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default SchemeForm;
