import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AppFooter from "components/ui/AppFooter";
import Icon from "components/AppIcon";
import LanguageSelector from "components/ui/LanguageSelector";
import { useLanguage } from "context/LanguageContext";
import { deleteUserById, getUsers, toggleUserBan } from "utils/auth";
import { SCHEME_CATEGORIES } from "admin/constants/schemeCategories";
import { getSchemesFromStorage, saveSchemesToStorage } from "admin/utils/schemeStorage";

const TABS = [
  { id: "overview", label: "Overview", icon: "BarChart3" },
  { id: "scheme-console", label: "Scheme Console", icon: "ClipboardList" },
  { id: "applications", label: "Applications", icon: "FileText" },
  { id: "users-roles", label: "Users & Roles", icon: "Users" },
  { id: "support-queue", label: "Support Queue", icon: "LifeBuoy" },
  { id: "notifications", label: "Notifications", icon: "BellRing" },
  { id: "audit", label: "Audit & Compliance", icon: "ShieldCheck" },
  { id: "integrations", label: "Integrations", icon: "Plug" },
];

const APPLICATION_STATUSES = ["applied", "under review", "approved", "rejected"];
const ROLE_OPTIONS = ["admin", "citizen"];
const SCHEME_STATUSES = ["draft", "published"];
const PIE_COLORS = ["#2563EB", "#0891B2", "#0D9488", "#16A34A", "#CA8A04", "#DC2626", "#7C3AED"];

const USER_ROLE_STORAGE_KEY = "adminUserRoles";
const APPLICATIONS_STORAGE_KEY = "adminApplications";
const AUDIT_STORAGE_KEY = "adminAuditLogs";
const INTEGRATIONS_STORAGE_KEY = "adminIntegrations";
const SUPPORT_QUEUE_STORAGE_KEY = "adminSupportQueue";
const NOTIFICATIONS_STORAGE_KEY = "adminBroadcastHistory";

const INITIAL_SCHEME_FORM = {
  title: "",
  ministry: "",
  category: "General",
  status: "draft",
  targetBeneficiaries: "Citizens",
  summary: "",
  officialLink: "",
  applyLink: "",
};

const INITIAL_INTEGRATION_SETTINGS = {
  schemesApiBaseUrl: "https://api.myscheme.gov.in",
  statusApiBaseUrl: "https://status.india.gov.in",
  smsProviderKey: "",
  twoFactorRequired: true,
  auditLogsEnabled: true,
  piiMasked: true,
};

const INITIAL_AUDIT_LOGS = [
  {
    id: "audit-1",
    time: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    actor: "admin@yojanasathi.gov",
    action: "admin.scheme.publish",
    entity: "scheme:pm-kisan",
  },
  {
    id: "audit-2",
    time: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    actor: "admin@yojanasathi.gov",
    action: "auth.admin.login",
    entity: "session:control-room",
  },
  {
    id: "audit-3",
    time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    actor: "admin@yojanasathi.gov",
    action: "auth.admin.2fa.requested",
    entity: "session:control-room",
  },
];

const INITIAL_SUPPORT_QUEUE = [
  {
    id: "sq-101",
    requester: "Amit Verma",
    issue: "Application status not updating for PMAY.",
    priority: "high",
    status: "open",
    raisedAt: new Date(Date.now() - 1000 * 60 * 170).toISOString(),
  },
  {
    id: "sq-102",
    requester: "Seema Patil",
    issue: "Scheme document upload failed for Ayushman card.",
    priority: "medium",
    status: "in progress",
    raisedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "sq-103",
    requester: "District Officer",
    issue: "Need export for state-wise application report.",
    priority: "low",
    status: "open",
    raisedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
];

const safeJsonParse = (raw, fallback) => {
  try {
    const parsed = JSON.parse(raw || "null");
    return parsed ?? fallback;
  } catch (_error) {
    return fallback;
  }
};

const toArray = (value) => (Array.isArray(value) ? value : []);

const getUserSavedSchemesCount = (user) => {
  if (Array.isArray(user?.savedSchemes)) return user.savedSchemes.length;
  if (Array.isArray(user?.savedSchemeIds)) return user.savedSchemeIds.length;
  return Number(user?.savedSchemesCount || 0);
};

const getUserLastActivityTimestamp = (user) => {
  const candidates = [user?.lastActiveAt, user?.lastLoginAt, user?.updatedAt, user?.createdAt]
    .map((value) => Date.parse(value || ""))
    .filter((value) => Number.isFinite(value));
  return candidates.length ? Math.max(...candidates) : 0;
};

const normalizeSchemeForConsole = (scheme, index) => {
  const title = scheme?.title || scheme?.name || `Scheme ${index + 1}`;
  const targetBeneficiaries = scheme?.targetBeneficiaries
    || (Array.isArray(scheme?.occupation) && scheme.occupation.length > 0 ? scheme.occupation.join(", ") : "Citizens");
  const summary = scheme?.summary || scheme?.description || scheme?.benefit || "";
  const officialLink = scheme?.officialLink || scheme?.portalUrl || scheme?.applyLink || "";
  const applyLink = scheme?.applyLink || scheme?.portalUrl || officialLink || "";

  return {
    ...scheme,
    id: scheme?.id || `scheme-${index}-${Date.now()}`,
    title,
    name: title,
    ministry: scheme?.ministry || "",
    category: scheme?.category || "General",
    status: SCHEME_STATUSES.includes(scheme?.status) ? scheme.status : "published",
    targetBeneficiaries,
    summary,
    description: summary,
    benefit: scheme?.benefit || summary,
    officialLink,
    applyLink,
    portalUrl: scheme?.portalUrl || applyLink || officialLink || "",
    occupation: Array.isArray(scheme?.occupation) ? scheme.occupation : ["any"],
    states: Array.isArray(scheme?.states) ? scheme.states : ["all"],
    incomeLimit: Number(scheme?.incomeLimit || 1000000),
    minAge: Number(scheme?.minAge || 0),
    gender: scheme?.gender || "any",
    createdAt: scheme?.createdAt || new Date().toISOString(),
    updatedAt: scheme?.updatedAt || new Date().toISOString(),
  };
};

const getSchemeLabel = (entry, schemeMap) => {
  if (!entry) return "";
  if (typeof entry === "string") return schemeMap.get(entry)?.title || entry;

  const byId = schemeMap.get(entry?.id || entry?.schemeId || entry?.slug || "");
  if (byId?.title) return byId.title;
  return entry?.name || entry?.schemeName || entry?.title || "";
};

const buildApplicationsFromUsers = (users, schemes) => {
  const schemeMap = new Map(schemes.map((scheme) => [String(scheme.id), scheme]));
  const results = [];

  users.forEach((user, userIndex) => {
    const applicantId = String(user?._id || user?.email || `user-${userIndex}`);
    const applicantName = user?.name || user?.email || `Applicant ${userIndex + 1}`;
    const state = user?.state || "Unknown";
    const userApplications = toArray(user?.applications);

    if (userApplications.length > 0) {
      userApplications.forEach((application, appIndex) => {
        const schemeLabel = getSchemeLabel(application, schemeMap)
          || schemeMap.get(String(application?.schemeId || ""))?.title
          || "General Welfare Scheme";

        results.push({
          id: application?._id || `${applicantId}-app-${appIndex}`,
          applicantId,
          applicant: applicantName,
          scheme: schemeLabel,
          status: APPLICATION_STATUSES.includes(application?.status) ? application.status : "applied",
          submittedDate: application?.submittedDate || application?.createdAt || user?.createdAt || new Date().toISOString(),
          state,
        });
      });
      return;
    }

    const savedSchemes = toArray(user?.savedSchemes);
    savedSchemes.slice(0, 2).forEach((saved, savedIndex) => {
      const schemeLabel = getSchemeLabel(saved, schemeMap) || "General Welfare Scheme";
      results.push({
        id: `${applicantId}-saved-${savedIndex}`,
        applicantId,
        applicant: applicantName,
        scheme: schemeLabel,
        status: "applied",
        submittedDate: user?.updatedAt || user?.createdAt || new Date().toISOString(),
        state,
      });
    });
  });

  if (results.length === 0 && schemes.length > 0) {
    return schemes.slice(0, 3).map((scheme, index) => ({
      id: `mock-app-${index}`,
      applicantId: `demo-${index}`,
      applicant: `Demo Applicant ${index + 1}`,
      scheme: scheme.title,
      status: APPLICATION_STATUSES[index % APPLICATION_STATUSES.length],
      submittedDate: new Date(Date.now() - index * 1000 * 60 * 60 * 24).toISOString(),
      state: "Maharashtra",
    }));
  }

  return results.sort((a, b) => Date.parse(b.submittedDate || "") - Date.parse(a.submittedDate || ""));
};

const formatDateTime = (value) => {
  const timestamp = Date.parse(value || "");
  if (!Number.isFinite(timestamp)) return "-";
  return new Date(timestamp).toLocaleString();
};

const SectionCard = ({ title, subtitle, children }) => (
  <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-100 px-5 py-4">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
    <div className="p-5">{children}</div>
  </section>
);

const MetricCard = ({ title, value, description, icon, accent }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <div className="mb-3 flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <div className={`rounded-lg p-2 ${accent}`}>
        <Icon name={icon} size={16} />
      </div>
    </div>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="mt-1 text-xs text-slate-500">{description}</p>
  </article>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [schemes, setSchemes] = useState(() =>
    getSchemesFromStorage().map((scheme, index) => normalizeSchemeForConsole(scheme, index))
  );
  const [schemeForm, setSchemeForm] = useState(INITIAL_SCHEME_FORM);
  const [editingSchemeId, setEditingSchemeId] = useState("");
  const [schemeSearch, setSchemeSearch] = useState("");
  const [schemeCategoryFilter, setSchemeCategoryFilter] = useState("All");
  const [schemeNotice, setSchemeNotice] = useState("");

  const [applications, setApplications] = useState(() =>
    safeJsonParse(localStorage.getItem(APPLICATIONS_STORAGE_KEY), [])
  );
  const [applicationNotice, setApplicationNotice] = useState("");

  const [userRoles, setUserRoles] = useState(() =>
    safeJsonParse(localStorage.getItem(USER_ROLE_STORAGE_KEY), {})
  );

  const [supportQueue, setSupportQueue] = useState(() =>
    safeJsonParse(localStorage.getItem(SUPPORT_QUEUE_STORAGE_KEY), INITIAL_SUPPORT_QUEUE)
  );

  const [selectedSchemeId, setSelectedSchemeId] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [broadcastNotice, setBroadcastNotice] = useState("");
  const [broadcastHistory, setBroadcastHistory] = useState(() =>
    safeJsonParse(localStorage.getItem(NOTIFICATIONS_STORAGE_KEY), [])
  );

  const [auditLogs, setAuditLogs] = useState(() =>
    safeJsonParse(localStorage.getItem(AUDIT_STORAGE_KEY), INITIAL_AUDIT_LOGS)
  );

  const [integrationSettings, setIntegrationSettings] = useState(() =>
    safeJsonParse(localStorage.getItem(INTEGRATIONS_STORAGE_KEY), INITIAL_INTEGRATION_SETTINGS)
  );
  const [integrationNotice, setIntegrationNotice] = useState("");

  const persistSchemes = (nextSchemes) => {
    setSchemes(nextSchemes);
    saveSchemesToStorage(nextSchemes.map((scheme) => ({
      ...scheme,
      name: scheme.title,
      description: scheme.summary,
      benefit: scheme.benefit || scheme.summary,
      portalUrl: scheme.applyLink || scheme.officialLink || scheme.portalUrl || "",
      applyLink: scheme.applyLink || "",
      officialLink: scheme.officialLink || "",
      updatedAt: new Date().toISOString(),
    })));
  };

  const appendAuditLog = (action, entity, actor = "admin@yojanasathi.gov") => {
    setAuditLogs((prev) => [
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        time: new Date().toISOString(),
        actor,
        action,
        entity,
      },
      ...prev,
    ].slice(0, 250));
  };

  useEffect(() => {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(USER_ROLE_STORAGE_KEY, JSON.stringify(userRoles));
  }, [userRoles]);

  useEffect(() => {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(integrationSettings));
  }, [integrationSettings]);

  useEffect(() => {
    localStorage.setItem(SUPPORT_QUEUE_STORAGE_KEY, JSON.stringify(supportQueue));
  }, [supportQueue]);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(broadcastHistory));
  }, [broadcastHistory]);

  useEffect(() => {
    const refreshUsers = async () => {
      try {
        setLoadingUsers(true);
        const data = await getUsers();
        setUsers(Array.isArray(data) ? data : []);
        setUsersError("");
      } catch (error) {
        setUsers([]);
        setUsersError(error?.response?.data?.message || error?.message || "Failed to load users.");
      } finally {
        setLoadingUsers(false);
      }
    };

    refreshUsers();
    window.addEventListener("focus", refreshUsers);
    return () => window.removeEventListener("focus", refreshUsers);
  }, []);

  useEffect(() => {
    if (users.length === 0) return;

    setUserRoles((prev) => {
      const merged = { ...prev };
      users.forEach((user) => {
        const key = String(user?._id || user?.email || "");
        if (!key || merged[key]) return;
        merged[key] = user?.role === "admin" ? "admin" : "citizen";
      });
      return merged;
    });
  }, [users]);

  useEffect(() => {
    if (applications.length > 0 || users.length === 0) return;
    const seeded = buildApplicationsFromUsers(users, schemes);
    setApplications(seeded);
  }, [applications.length, users, schemes]);

  const schemeMap = useMemo(
    () => new Map(schemes.map((scheme) => [String(scheme.id), scheme])),
    [schemes]
  );

  const countedViewedSchemes = useMemo(() => {
    const counter = {};

    users.forEach((user) => {
      const viewedArrays = [user?.viewedSchemes, user?.viewedSchemeIds, user?.recentViews];
      viewedArrays.forEach((value) => {
        toArray(value).forEach((entry) => {
          const key = getSchemeLabel(entry, schemeMap);
          if (!key) return;
          counter[key] = (counter[key] || 0) + 1;
        });
      });

      if (user?.schemeViews && typeof user.schemeViews === "object" && !Array.isArray(user.schemeViews)) {
        Object.entries(user.schemeViews).forEach(([schemeKey, views]) => {
          const key = getSchemeLabel(schemeKey, schemeMap);
          const count = Number(views);
          counter[key] = (counter[key] || 0) + (Number.isFinite(count) ? count : 1);
        });
      }
    });

    return Object.entries(counter)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [users, schemeMap]);

  const countedSavedSchemes = useMemo(() => {
    const counter = {};

    users.forEach((user) => {
      const savedArrays = [user?.savedSchemes, user?.savedSchemeIds];
      savedArrays.forEach((value) => {
        toArray(value).forEach((entry) => {
          const key = getSchemeLabel(entry, schemeMap);
          if (!key) return;
          counter[key] = (counter[key] || 0) + 1;
        });
      });
    });

    return Object.entries(counter)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [users, schemeMap]);

  const mostViewedSchemesChart = useMemo(() => {
    if (countedViewedSchemes.length > 0) return countedViewedSchemes.slice(0, 8);
    return schemes.slice(0, 6).map((scheme, index) => ({ name: scheme.title, count: 6 - index }));
  }, [countedViewedSchemes, schemes]);

  const mostSavedSchemesChart = useMemo(() => {
    if (countedSavedSchemes.length > 0) return countedSavedSchemes.slice(0, 8);
    return schemes.slice(0, 6).map((scheme, index) => ({ name: scheme.title, count: 5 - index }));
  }, [countedSavedSchemes, schemes]);

  const categoryPopularityChart = useMemo(() => {
    const counter = {};
    const byName = new Map(schemes.map((scheme) => [scheme.title.toLowerCase(), scheme]));

    countedSavedSchemes.forEach((entry) => {
      const matched = byName.get(entry.name.toLowerCase());
      const category = matched?.category || "General";
      counter[category] = (counter[category] || 0) + entry.count;
    });

    if (Object.keys(counter).length === 0) {
      schemes.forEach((scheme) => {
        counter[scheme.category || "General"] = (counter[scheme.category || "General"] || 0) + 1;
      });
    }

    return Object.entries(counter)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [countedSavedSchemes, schemes]);

  const regionalDemandChart = useMemo(() => {
    const counter = {};

    applications.forEach((application) => {
      const state = application?.state || "Unknown";
      counter[state] = (counter[state] || 0) + 1;
    });

    if (Object.keys(counter).length === 0) {
      users.forEach((user) => {
        const state = user?.state || "Unknown";
        counter[state] = (counter[state] || 0) + 1;
      });
    }

    return Object.entries(counter)
      .map(([name, demand]) => ({ name, demand }))
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 8);
  }, [applications, users]);

  const totalUsers = users.length;
  const activeUsers30d = useMemo(() => {
    const now = Date.now();
    const thirtyDays = 1000 * 60 * 60 * 24 * 30;
    return users.filter((user) => {
      const timestamp = getUserLastActivityTimestamp(user);
      return timestamp > 0 && now - timestamp <= thirtyDays;
    }).length;
  }, [users]);

  const usersWithApplications = useMemo(() => {
    const uniqueApplicants = new Set(applications.map((application) => application?.applicantId).filter(Boolean));
    return uniqueApplicants.size;
  }, [applications]);

  const conversionRate = totalUsers > 0
    ? `${((usersWithApplications / totalUsers) * 100).toFixed(1)}%`
    : "0.0%";

  const mostViewed = countedViewedSchemes[0] || { name: "-", count: 0 };
  const mostSaved = countedSavedSchemes[0] || { name: "-", count: 0 };
  const topCategory = categoryPopularityChart[0] || { name: "-", value: 0 };

  const dashboardMetrics = [
    {
      title: "Users",
      value: totalUsers.toLocaleString("en-IN"),
      description: "Total registered citizens",
      icon: "Users",
      accent: "bg-blue-50 text-blue-700",
    },
    {
      title: "Active Users (30d)",
      value: activeUsers30d.toLocaleString("en-IN"),
      description: "Users active in last 30 days",
      icon: "UserCheck",
      accent: "bg-cyan-50 text-cyan-700",
    },
    {
      title: "Conversion Rate",
      value: conversionRate,
      description: "Users with at least one application",
      icon: "Percent",
      accent: "bg-violet-50 text-violet-700",
    },
    {
      title: "Total Applications",
      value: applications.length.toLocaleString("en-IN"),
      description: "Applications across all schemes",
      icon: "FileCheck2",
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Most Viewed Scheme",
      value: mostViewed.count.toLocaleString("en-IN"),
      description: mostViewed.name || "No view data yet",
      icon: "Eye",
      accent: "bg-amber-50 text-amber-700",
    },
    {
      title: "Most Saved Scheme",
      value: mostSaved.count.toLocaleString("en-IN"),
      description: mostSaved.name || "No save data yet",
      icon: "BookmarkCheck",
      accent: "bg-indigo-50 text-indigo-700",
    },
    {
      title: "Top Category",
      value: topCategory.value.toLocaleString("en-IN"),
      description: topCategory.name || "General",
      icon: "Layers",
      accent: "bg-rose-50 text-rose-700",
    },
  ];

  const filteredSchemes = useMemo(() => {
    const keyword = schemeSearch.trim().toLowerCase();
    return schemes.filter((scheme) => {
      const passesCategory = schemeCategoryFilter === "All" || scheme.category === schemeCategoryFilter;
      if (!keyword) return passesCategory;
      const searchable = [scheme.title, scheme.ministry, scheme.category, scheme.summary]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return passesCategory && searchable.includes(keyword);
    });
  }, [schemeCategoryFilter, schemeSearch, schemes]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const handleSchemeInputChange = (event) => {
    const { name, value } = event.target;
    setSchemeForm((prev) => ({ ...prev, [name]: value }));
    if (schemeNotice) setSchemeNotice("");
  };

  const resetSchemeEditor = () => {
    setEditingSchemeId("");
    setSchemeForm(INITIAL_SCHEME_FORM);
  };

  const handleSchemeSubmit = (event) => {
    event.preventDefault();
    const title = schemeForm.title.trim();
    if (!title) {
      setSchemeNotice("Title is required to save the scheme.");
      return;
    }

    const occupation = schemeForm.targetBeneficiaries
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);

    const basePayload = {
      title,
      name: title,
      ministry: schemeForm.ministry.trim(),
      category: schemeForm.category,
      status: schemeForm.status,
      targetBeneficiaries: schemeForm.targetBeneficiaries.trim() || "Citizens",
      summary: schemeForm.summary.trim(),
      description: schemeForm.summary.trim(),
      benefit: schemeForm.summary.trim(),
      officialLink: schemeForm.officialLink.trim(),
      applyLink: schemeForm.applyLink.trim(),
      portalUrl: schemeForm.applyLink.trim() || schemeForm.officialLink.trim(),
      occupation: occupation.length > 0 ? occupation : ["any"],
      states: ["all"],
      incomeLimit: 1000000,
      minAge: 0,
      gender: "any",
      requiresLandOwnership: false,
      requiresStudent: false,
      updatedAt: new Date().toISOString(),
    };

    if (editingSchemeId) {
      const updated = schemes.map((scheme) =>
        String(scheme.id) === String(editingSchemeId) ? { ...scheme, ...basePayload } : scheme
      );
      persistSchemes(updated);
      setSchemeNotice("Scheme updated successfully.");
      appendAuditLog(`admin.scheme.${basePayload.status === "published" ? "publish" : "draft"}`, `scheme:${editingSchemeId}`);
      resetSchemeEditor();
      return;
    }

    const nextScheme = {
      id: `admin-scheme-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...basePayload,
    };

    persistSchemes([nextScheme, ...schemes]);
    setSchemeNotice("Scheme added to console.");
    appendAuditLog(`admin.scheme.${basePayload.status === "published" ? "publish" : "draft"}`, `scheme:${nextScheme.id}`);
    resetSchemeEditor();
  };

  const handleEditScheme = (scheme) => {
    setEditingSchemeId(scheme.id);
    setSchemeForm({
      title: scheme.title || scheme.name || "",
      ministry: scheme.ministry || "",
      category: scheme.category || "General",
      status: scheme.status || "draft",
      targetBeneficiaries: scheme.targetBeneficiaries || "Citizens",
      summary: scheme.summary || scheme.description || "",
      officialLink: scheme.officialLink || "",
      applyLink: scheme.applyLink || "",
    });
    setActiveTab("scheme-console");
  };

  const handleDeleteScheme = (schemeId) => {
    if (!window.confirm("Delete this scheme from console?")) return;
    const updated = schemes.filter((scheme) => String(scheme.id) !== String(schemeId));
    persistSchemes(updated);
    setSchemeNotice("Scheme deleted.");
    appendAuditLog("admin.scheme.delete", `scheme:${schemeId}`);
    if (String(editingSchemeId) === String(schemeId)) resetSchemeEditor();
  };

  const handleSchemeStatusChange = (scheme, status) => {
    const updated = schemes.map((item) =>
      String(item.id) === String(scheme.id) ? { ...item, status, updatedAt: new Date().toISOString() } : item
    );
    persistSchemes(updated);
    appendAuditLog(`admin.scheme.${status === "published" ? "publish" : "draft"}`, `scheme:${scheme.id}`);
  };

  const handleApplicationStatusChange = (applicationId, nextStatus) => {
    setApplications((prev) =>
      prev.map((application) =>
        String(application.id) === String(applicationId) ? { ...application, status: nextStatus } : application
      )
    );
    setApplicationNotice(`Application ${applicationId} updated to ${nextStatus}.`);
    appendAuditLog("admin.application.status.update", `application:${applicationId}:${nextStatus}`);
  };

  const getRoleForUser = (user) => {
    const key = String(user?._id || user?.email || "");
    return userRoles[key] || (user?.role === "admin" ? "admin" : "citizen");
  };

  const handleRoleChange = (user, nextRole) => {
    const key = String(user?._id || user?.email || "");
    setUserRoles((prev) => ({ ...prev, [key]: nextRole }));
    appendAuditLog("admin.user.role.update", `user:${key}:${nextRole}`);
  };

  const handleToggleBan = async (user) => {
    try {
      const updatedUser = await toggleUserBan(user?._id, !Boolean(user?.banned));
      setUsers((prev) =>
        prev.map((item) => (String(item?._id) === String(updatedUser?._id) ? updatedUser : item))
      );
      appendAuditLog("admin.user.ban.toggle", `user:${user?._id}:${!Boolean(user?.banned)}`);
    } catch (error) {
      setUsersError(error?.response?.data?.message || error?.message || "Unable to update ban status.");
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(`Delete user ${user?.email || user?._id}?`);
    if (!confirmed) return;
    try {
      await deleteUserById(user?._id);
      setUsers((prev) => prev.filter((item) => String(item?._id) !== String(user?._id)));
      appendAuditLog("admin.user.delete", `user:${user?._id}`);
    } catch (error) {
      setUsersError(error?.response?.data?.message || error?.message || "Unable to delete user.");
    }
  };

  const handleSupportStatusChange = (ticketId, nextStatus) => {
    setSupportQueue((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: nextStatus } : ticket))
    );
    appendAuditLog("admin.support.status.update", `ticket:${ticketId}:${nextStatus}`);
  };

  const sendBroadcast = (kind) => {
    const selectedScheme = schemes.find((scheme) => String(scheme.id) === String(selectedSchemeId));
    if (!selectedScheme) {
      setBroadcastNotice("Select a scheme before sending a broadcast.");
      return;
    }

    const fallbackMessages = {
      deadline: `Deadline alert: Apply for ${selectedScheme.title} before the closing date.`,
      announcement: `New scheme announcement: ${selectedScheme.title} is now available in the portal.`,
      savedUpdate: `Saved scheme update: ${selectedScheme.title} has new eligibility details.`,
    };

    const message = notificationMessage.trim() || fallbackMessages[kind];
    const payload = {
      id: `broadcast-${Date.now()}`,
      time: new Date().toISOString(),
      type: kind,
      scheme: selectedScheme.title,
      message,
    };

    setBroadcastHistory((prev) => [payload, ...prev].slice(0, 100));
    setBroadcastNotice(`Broadcast sent for ${selectedScheme.title}.`);
    appendAuditLog("admin.notification.broadcast", `scheme:${selectedScheme.id}:${kind}`);
    setNotificationMessage("");
  };

  const handleIntegrationInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setIntegrationSettings((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (integrationNotice) setIntegrationNotice("");
  };

  const handleSaveIntegrations = (event) => {
    event.preventDefault();
    setIntegrationNotice("Integration settings saved.");
    appendAuditLog("admin.integration.settings.update", "integrations:gov-connectors");
  };

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <SectionCard title="Most Viewed Schemes" subtitle="Top scheme page views by citizens">
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={mostViewedSchemesChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Most Saved Schemes" subtitle="Schemes with highest save intent">
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={mostSavedSchemesChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#16A34A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Category Popularity" subtitle="Demand distribution by category">
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={categoryPopularityChart}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={48}
                paddingAngle={3}
              >
                {categoryPopularityChart.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Regional Demand" subtitle="Application demand by region">
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={regionalDemandChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="demand" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );

  const renderSchemeConsoleTab = () => (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <SectionCard
        title={editingSchemeId ? "Edit Scheme" : "Add Scheme"}
        subtitle="Create, update, publish or keep schemes in draft"
      >
        <form onSubmit={handleSchemeSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              name="title"
              value={schemeForm.title}
              onChange={handleSchemeInputChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Scheme title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Ministry</label>
              <input
                type="text"
                name="ministry"
                value={schemeForm.ministry}
                onChange={handleSchemeInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Ministry / Department"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
              <select
                name="category"
                value={schemeForm.category}
                onChange={handleSchemeInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                {SCHEME_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <select
                name="status"
                value={schemeForm.status}
                onChange={handleSchemeInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                {SCHEME_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Target Beneficiaries</label>
              <input
                type="text"
                name="targetBeneficiaries"
                value={schemeForm.targetBeneficiaries}
                onChange={handleSchemeInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="farmer, student, unemployed"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Summary</label>
            <textarea
              name="summary"
              value={schemeForm.summary}
              onChange={handleSchemeInputChange}
              className="min-h-[88px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Short policy summary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Official Website Link</label>
              <input
                type="url"
                name="officialLink"
                value={schemeForm.officialLink}
                onChange={handleSchemeInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="https://official.gov.in"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Apply Link</label>
              <input
                type="url"
                name="applyLink"
                value={schemeForm.applyLink}
                onChange={handleSchemeInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="https://apply.gov.in"
              />
            </div>
          </div>

          {schemeNotice && (
            <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">{schemeNotice}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              {editingSchemeId ? "Update Scheme" : "Add Scheme"}
            </button>
            <button
              type="button"
              onClick={resetSchemeEditor}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </form>
      </SectionCard>

      <div className="xl:col-span-8 space-y-4">
        <SectionCard title="Scheme Register" subtitle="Manage publish state, links and metadata">
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={schemeSearch}
              onChange={(event) => setSchemeSearch(event.target.value)}
              placeholder="Search by title, category or ministry"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <select
              value={schemeCategoryFilter}
              onChange={(event) => setSchemeCategoryFilter(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {SCHEME_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="flex items-center rounded-lg border border-slate-200 px-3 text-sm text-slate-500">
              Showing {filteredSchemes.length} of {schemes.length} schemes
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-3 py-3">Title</th>
                  <th className="px-3 py-3">Ministry</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Target Beneficiaries</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchemes.map((scheme) => (
                  <tr key={scheme.id} className="border-t border-slate-100">
                    <td className="px-3 py-3">
                      <p className="font-semibold text-slate-800">{scheme.title}</p>
                      {scheme.officialLink && (
                        <a
                          href={scheme.officialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block text-xs text-blue-700 hover:underline"
                        >
                          Official Portal
                        </a>
                      )}
                    </td>
                    <td className="px-3 py-3 text-slate-700">{scheme.ministry || "-"}</td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                        {scheme.category}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          scheme.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {scheme.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{scheme.targetBeneficiaries}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEditScheme(scheme)}
                          className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteScheme(scheme.id)}
                          className="rounded-lg bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() =>
                            handleSchemeStatusChange(scheme, scheme.status === "published" ? "draft" : "published")
                          }
                          className="rounded-lg bg-blue-700 px-2 py-1 text-xs font-medium text-white hover:bg-blue-800"
                        >
                          {scheme.status === "published" ? "Move to Draft" : "Publish"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );

  const renderApplicationsTab = () => (
    <SectionCard title="Applications" subtitle="Track and update citizen application statuses">
      {applicationNotice && (
        <p className="mb-3 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">{applicationNotice}</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-3 py-3">Applicant</th>
              <th className="px-3 py-3">Scheme</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Submitted Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="border-t border-slate-100">
                <td className="px-3 py-3 text-slate-700">{application.applicant}</td>
                <td className="px-3 py-3 text-slate-700">{application.scheme}</td>
                <td className="px-3 py-3">
                  <select
                    value={application.status}
                    onChange={(event) => handleApplicationStatusChange(application.id, event.target.value)}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  >
                    {APPLICATION_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3 text-slate-700">{formatDateTime(application.submittedDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">No applications found yet.</p>
        )}
      </div>
    </SectionCard>
  );

  const renderUsersRolesTab = () => (
    <SectionCard title="Users & Roles" subtitle="Manage users, role assignment and access scope">
      {loadingUsers && <p className="mb-3 text-sm text-slate-500">Loading users...</p>}
      {!loadingUsers && usersError && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{usersError}</p>
      )}
      {!loadingUsers && !usersError && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-3 py-3">User</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Saved Schemes</th>
                <th className="px-3 py-3">Access Scope</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const role = getRoleForUser(user);
                const savedCount = getUserSavedSchemesCount(user);
                const accessScope = user?.banned
                  ? "Suspended"
                  : role === "admin"
                    ? "Nationwide + admin controls"
                    : `Citizen (${user?.state || "All States"})`;

                return (
                  <tr key={user?._id || user?.email} className="border-t border-slate-100">
                    <td className="px-3 py-3">
                      <p className="font-medium text-slate-800">{user?.name || "-"}</p>
                      <p className="text-xs text-slate-500">{user?.email || "-"}</p>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={role}
                        onChange={(event) => handleRoleChange(user, event.target.value)}
                        className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium focus:border-blue-500 focus:outline-none"
                      >
                        {ROLE_OPTIONS.map((roleOption) => (
                          <option key={roleOption} value={roleOption}>{roleOption}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{savedCount}</td>
                    <td className="px-3 py-3 text-slate-700">{accessScope}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleToggleBan(user)}
                          className={`rounded-lg px-2 py-1 text-xs font-medium text-white ${
                            user?.banned ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"
                          }`}
                        >
                          {user?.banned ? "Unban User" : "Ban User"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="rounded-lg bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                        >
                          Delete User
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">No users available.</p>
          )}
        </div>
      )}
    </SectionCard>
  );

  const renderSupportQueueTab = () => (
    <SectionCard title="Support Queue" subtitle="Track operational support tickets for admin team">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-3 py-3">Ticket</th>
              <th className="px-3 py-3">Requester</th>
              <th className="px-3 py-3">Issue</th>
              <th className="px-3 py-3">Priority</th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {supportQueue.map((ticket) => (
              <tr key={ticket.id} className="border-t border-slate-100">
                <td className="px-3 py-3 text-slate-700">{ticket.id}</td>
                <td className="px-3 py-3 text-slate-700">{ticket.requester}</td>
                <td className="px-3 py-3 text-slate-700">{ticket.issue}</td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      ticket.priority === "high"
                        ? "bg-red-50 text-red-700"
                        : ticket.priority === "medium"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={ticket.status}
                    onChange={(event) => handleSupportStatusChange(ticket.id, event.target.value)}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  >
                    <option value="open">open</option>
                    <option value="in progress">in progress</option>
                    <option value="resolved">resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );

  const renderNotificationsTab = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <SectionCard title="Broadcast System" subtitle="Send campaign communication to citizens">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Select Scheme</label>
            <select
              value={selectedSchemeId}
              onChange={(event) => setSelectedSchemeId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select a scheme</option>
              {schemes.map((scheme) => (
                <option key={scheme.id} value={scheme.id}>{scheme.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Custom Message</label>
            <textarea
              value={notificationMessage}
              onChange={(event) => setNotificationMessage(event.target.value)}
              className="min-h-[100px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Type announcement details..."
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => sendBroadcast("deadline")}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Send Deadline Alerts
            </button>
            <button
              onClick={() => sendBroadcast("announcement")}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Announce New Scheme
            </button>
            <button
              onClick={() => sendBroadcast("savedUpdate")}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
            >
              Notify Saved Scheme Update
            </button>
          </div>

          {broadcastNotice && (
            <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">{broadcastNotice}</p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Recent Broadcasts" subtitle="Latest outbound admin announcements">
        <div className="space-y-3">
          {broadcastHistory.length === 0 && (
            <p className="text-sm text-slate-500">No broadcasts sent yet.</p>
          )}
          {broadcastHistory.map((item) => (
            <article key={item.id} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">{item.scheme}</p>
                <span className="text-xs uppercase text-slate-500">{item.type}</span>
              </div>
              <p className="text-sm text-slate-600">{item.message}</p>
              <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.time)}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  const renderAuditTab = () => (
    <SectionCard title="Audit & Compliance" subtitle="Immutable-style admin activity log">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-3 py-3">Time</th>
              <th className="px-3 py-3">Actor</th>
              <th className="px-3 py-3">Action</th>
              <th className="px-3 py-3">Entity</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-t border-slate-100">
                <td className="px-3 py-3 text-slate-700">{formatDateTime(log.time)}</td>
                <td className="px-3 py-3 text-slate-700">{log.actor}</td>
                <td className="px-3 py-3 font-mono text-xs text-slate-700">{log.action}</td>
                <td className="px-3 py-3 font-mono text-xs text-slate-700">{log.entity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );

  const renderIntegrationsTab = () => (
    <SectionCard title="Integrations Settings" subtitle="Configure external connectors and compliance controls">
      <form onSubmit={handleSaveIntegrations} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Government Schemes API Base URL</label>
          <input
            type="url"
            name="schemesApiBaseUrl"
            value={integrationSettings.schemesApiBaseUrl}
            onChange={handleIntegrationInputChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Government Status API Base URL</label>
          <input
            type="url"
            name="statusApiBaseUrl"
            value={integrationSettings.statusApiBaseUrl}
            onChange={handleIntegrationInputChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">SMS Provider Key</label>
          <input
            type="password"
            name="smsProviderKey"
            value={integrationSettings.smsProviderKey}
            onChange={handleIntegrationInputChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Enter provider API key"
          />
        </div>

        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Compliance Checklist</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="twoFactorRequired"
                checked={Boolean(integrationSettings.twoFactorRequired)}
                onChange={handleIntegrationInputChange}
              />
              2FA required
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="auditLogsEnabled"
                checked={Boolean(integrationSettings.auditLogsEnabled)}
                onChange={handleIntegrationInputChange}
              />
              Audit logs enabled
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="piiMasked"
                checked={Boolean(integrationSettings.piiMasked)}
                onChange={handleIntegrationInputChange}
              />
              User PII masked
            </label>
          </div>
        </div>

        {integrationNotice && (
          <p className="lg:col-span-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">{integrationNotice}</p>
        )}

        <div className="lg:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Save Integration Settings
          </button>
        </div>
      </form>
    </SectionCard>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "scheme-console":
        return renderSchemeConsoleTab();
      case "applications":
        return renderApplicationsTab();
      case "users-roles":
        return renderUsersRolesTab();
      case "support-queue":
        return renderSupportQueueTab();
      case "notifications":
        return renderNotificationsTab();
      case "audit":
        return renderAuditTab();
      case "integrations":
        return renderIntegrationsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 md:px-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm">
              <Icon name="Building2" size={20} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">YojanaSathi</p>
              <p className="text-xs text-slate-500">GovTech Admin Control Panel</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <Link to="/admin/dashboard" className="rounded-lg px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
              Dashboard
            </Link>
            <Link to="/admin/users" className="rounded-lg px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
              Users
            </Link>
            <Link to="/admin/schemes" className="rounded-lg px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
              Schemes
            </Link>
            <Link to="/admin/analytics" className="rounded-lg px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
              Analytics
            </Link>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
            <button className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-medium text-white shadow-sm">
              Admin Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              {t("admin.logout")}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <div className="mb-6 rounded-xl border border-slate-200 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 p-5 text-white shadow-sm">
          <p className="text-xs uppercase tracking-wide text-blue-100">Control Room</p>
          <h1 className="mt-1 text-2xl font-bold">{t("admin.dashboardTitle")}</h1>
          <p className="mt-1 text-sm text-blue-100">
            Monitor demand, govern scheme lifecycle, and manage platform operations from one panel.
          </p>
        </div>

        {usersError && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {usersError}
          </p>
        )}

        <section className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {dashboardMetrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </section>

        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex min-w-max flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon name={tab.icon} size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {renderActiveTab()}
      </main>

      <AppFooter minimal />
    </div>
  );
};

export default AdminDashboard;
