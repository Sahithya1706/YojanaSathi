import React from "react";
import Icon from "components/AppIcon";

const ChatbotButton = ({ chatOpen, onToggle, label }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[220] flex items-center gap-2">
      {!chatOpen && (
        <span className="hidden md:inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-md">
          {label}
        </span>
      )}

      <button
        type="button"
        onClick={onToggle}
        className="h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-xl transition duration-200 hover:scale-105"
        aria-label={label}
        aria-expanded={chatOpen}
      >
        <span className="flex items-center justify-center">
          <Icon name={chatOpen ? "X" : "MessageCircle"} size={24} />
        </span>
      </button>
    </div>
  );
};

export default ChatbotButton;
