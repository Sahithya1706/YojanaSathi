import React, { useEffect, useState } from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import Input from "components/ui/Input";

const ProfileSection = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    state: user?.state || "",
    age: user?.age || "",
    occupation: user?.occupation || "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      state: user?.state || "",
      age: user?.age || "",
      occupation: user?.occupation || "",
    });
  }, [user]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e?.target?.value }));
  };

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      state: user?.state || "",
      age: user?.age || "",
      occupation: user?.occupation || "",
    });
    setIsEditing(false);
  };

  const profileFields = [
    { label: "Full Name", key: "name", icon: "User", type: "text" },
    { label: "Email Address", key: "email", icon: "Mail", type: "email" },
    { label: "Phone Number", key: "phone", icon: "Phone", type: "tel" },
    { label: "State", key: "state", icon: "MapPin", type: "text" },
    { label: "Age", key: "age", icon: "Calendar", type: "number" },
    { label: "Occupation", key: "occupation", icon: "Briefcase", type: "text" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{ background: "var(--color-primary)", color: "#FFFFFF", fontFamily: "Poppins, sans-serif" }}
            aria-hidden="true"
          >
            {user?.name ? user?.name?.charAt(0)?.toUpperCase() : "U"}
          </div>
          <div>
            <h3
              className="text-base font-semibold"
              style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}
            >
              {user?.name || "Citizen"}
            </h3>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              Member since {user?.memberSince || "March 2026"}
            </p>
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            iconName="Pencil"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>
      {/* Success message */}
      {saved && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-lg mb-4 text-sm"
          style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534" }}
          role="alert"
        >
          <Icon name="CheckCircle" size={16} color="#166534" />
          Profile updated successfully!
        </div>
      )}
      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {profileFields?.map((field) =>
          isEditing ? (
            <Input
              key={field?.key}
              label={field?.label}
              type={field?.type}
              value={formData?.[field?.key]}
              onChange={handleChange(field?.key)}
              placeholder={`Enter your ${field?.label?.toLowerCase()}`}
            />
          ) : (
            <div
              key={field?.key}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "var(--color-muted)", border: "1px solid var(--color-border)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--color-card)" }}
                aria-hidden="true"
              >
                <Icon name={field?.icon} size={16} color="var(--color-primary)" />
              </div>
              <div className="min-w-0">
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)", fontFamily: "Nunito Sans, sans-serif" }}
                >
                  {field?.label}
                </p>
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--color-text-primary)", fontFamily: "Source Sans Pro, sans-serif" }}
                >
                  {formData?.[field?.key] || "—"}
                </p>
              </div>
            </div>
          )
        )}
      </div>
      {/* Edit actions */}
      {isEditing && (
        <div className="flex gap-3 mt-6">
          <Button
            variant="default"
            size="default"
            iconName="Save"
            iconPosition="left"
            onClick={handleSave}
          >
            Save Changes
          </Button>
          <Button variant="outline" size="default" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
