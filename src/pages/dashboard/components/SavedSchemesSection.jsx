import React from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const categoryColors = {
  Pension: { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  Agriculture: { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  Education: { bg: "#FFF7ED", text: "#9A3412", border: "#FED7AA" },
  Women: { bg: "#FDF4FF", text: "#7E22CE", border: "#E9D5FF" },
  Employment: { bg: "#F0F9FF", text: "#0C4A6E", border: "#BAE6FD" },
  Health: { bg: "#FFF1F2", text: "#9F1239", border: "#FECDD3" },
};

const SavedSchemesSection = ({ schemes, onViewDetails, onRemoveBookmark }) => {
  const handleApply = (scheme) => {
    if (scheme?.portalUrl) {
      window.open(scheme.portalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    window.alert("Visit your nearest CSC center to apply.");
  };

  if (!schemes || schemes?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "var(--color-muted)" }}
        >
          <Icon name="BookmarkX" size={28} color="var(--color-muted-foreground)" />
        </div>
        <h3
          className="text-base font-semibold mb-1"
          style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}
        >
          No Saved Schemes Yet
        </h3>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Take the eligibility quiz and bookmark schemes you are interested in.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {schemes?.map((scheme) => {
        const colors = categoryColors?.[scheme?.category] || categoryColors?.["Employment"];
        return (
          <div
            key={scheme?.id}
            className="rounded-xl border p-4 flex flex-col gap-3 transition-all duration-200 hover:shadow-md"
            style={{
              background: "var(--color-card)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-2"
                  style={{
                    background: colors?.bg,
                    color: colors?.text,
                    border: `1px solid ${colors?.border}`,
                    fontFamily: "Nunito Sans, sans-serif",
                  }}
                >
                  {scheme?.category}
                </span>
                <h4
                  className="text-sm font-semibold line-clamp-2 leading-snug"
                  style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text-primary)" }}
                >
                  {scheme?.name}
                </h4>
              </div>
              <button
                onClick={() => onRemoveBookmark(scheme?.id)}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                style={{ background: "#FEF2F2" }}
                aria-label={`Remove ${scheme?.name} from saved schemes`}
                title="Remove bookmark"
              >
                <Icon name="BookmarkMinus" size={16} color="#DC2626" />
              </button>
            </div>
            {/* Ministry */}
            <p className="text-xs line-clamp-1" style={{ color: "var(--color-text-secondary)" }}>
              {scheme?.ministry}
            </p>
            {/* Benefit */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: "var(--color-muted)" }}
            >
              <Icon name="IndianRupee" size={14} color="var(--color-success)" />
              <div>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Benefit Amount
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--color-success)", fontFamily: "Poppins, sans-serif" }}
                >
                  {scheme?.benefit}
                </p>
              </div>
            </div>
            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              <Button
                variant="default"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                onClick={() => onViewDetails(scheme)}
                className="flex-1"
              >
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="ExternalLink"
                iconPosition="left"
                onClick={() => handleApply(scheme)}
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavedSchemesSection;
