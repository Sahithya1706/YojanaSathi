import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "context/LanguageContext";
import AppFooter from "components/ui/AppFooter";
import SchemeForm from "admin/components/SchemeForm";
import SchemesTable from "admin/components/SchemesTable";
import { SCHEME_CATEGORIES } from "admin/constants/schemeCategories";
import { getSchemesFromStorage, saveSchemesToStorage } from "admin/utils/schemeStorage";

const ManageSchemes = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState(getSchemesFromStorage);
  const [editingScheme, setEditingScheme] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const persistSchemes = (updatedSchemes) => {
    setSchemes(updatedSchemes);
    saveSchemesToStorage(updatedSchemes);
  };

  const handleCreateScheme = (payload) => {
    const nextScheme = {
      id: `scheme-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persistSchemes([nextScheme, ...schemes]);
  };

  const handleUpdateScheme = (payload) => {
    if (!editingScheme) return;

    const updated = schemes.map((scheme) =>
      scheme?.id === editingScheme.id
        ? {
            ...scheme,
            ...payload,
            updatedAt: new Date().toISOString(),
          }
        : scheme
    );

    persistSchemes(updated);
    setEditingScheme(null);
  };

  const handleDeleteScheme = (targetScheme) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this scheme?");
    if (!confirmDelete) return;

    const updated = schemes.filter((scheme) => scheme?.id !== targetScheme?.id);
    persistSchemes(updated);
  };

  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const passesCategory =
        categoryFilter === "All" || (scheme?.category || "General") === categoryFilter;

      const keyword = searchText.trim().toLowerCase();
      const searchableText = [
        scheme?.name,
        scheme?.category,
        scheme?.ministry,
        scheme?.benefit,
        scheme?.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const passesSearch = keyword.length === 0 || searchableText.includes(keyword);
      return passesCategory && passesSearch;
    });
  }, [schemes, categoryFilter, searchText]);

  return (
    <div className="p-10 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("admin.manageGovSchemes")}</h1>
        <div className="flex gap-3">
          <Link to="/admin/dashboard" className="bg-white border px-4 py-2 rounded hover:bg-gray-50">
            Dashboard
          </Link>
          <button
            onClick={() => navigate("/admin/users")}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Manage Users
          </button>
        </div>
      </div>

      <SchemeForm
        initialData={editingScheme}
        onSubmit={editingScheme ? handleUpdateScheme : handleCreateScheme}
        onCancel={() => setEditingScheme(null)}
      />

      <div className="bg-white rounded-xl shadow p-4 mb-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="border rounded px-3 py-2"
          placeholder="Search schemes..."
        />

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="All">All Categories</option>
          {SCHEME_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="flex items-center text-sm text-gray-600">
          Showing {filteredSchemes.length} of {schemes.length} schemes
        </div>
      </div>

      <SchemesTable
        schemes={filteredSchemes}
        onEdit={(scheme) => setEditingScheme(scheme)}
        onDelete={handleDeleteScheme}
      />

      <AppFooter minimal />
    </div>
  );
};

export default ManageSchemes;
