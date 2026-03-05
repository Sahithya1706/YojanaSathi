import React from "react";

const SuggestionButtons = ({ suggestions = [], onSelect }) => {
  if (!suggestions.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.key}
          type="button"
          onClick={() => onSelect?.(suggestion)}
          className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
        >
          {suggestion.label}
        </button>
      ))}
    </div>
  );
};

export default SuggestionButtons;
