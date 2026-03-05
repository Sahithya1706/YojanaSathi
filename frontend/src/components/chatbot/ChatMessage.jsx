import React from "react";
import Icon from "components/AppIcon";
import SuggestionButtons from "./SuggestionButtons";

const ChatMessage = ({
  message,
  suggestions,
  onSuggestionClick,
  onViewDetails,
  actions,
}) => {
  if (!message) return null;

  const isUser = message.sender === "user";

  if (message.typing) {
    return (
      <div className="mb-3 flex justify-start">
        <div className="rounded-2xl rounded-tl-md bg-card px-3 py-2 text-sm text-text-secondary shadow-sm">
          {message.text}
        </div>
      </div>
    );
  }

  const messageSuggestions = message?.suggestionKeys?.length
    ? suggestions.filter((item) => message.suggestionKeys.includes(item.key))
    : suggestions;

  return (
    <div className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[90%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        {!isUser && (
          <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-primary">
            <Icon name="Bot" size={14} /> AI
          </span>
        )}

        <div
          className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${
            isUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-tl-md bg-card text-card-foreground"
          }`}
        >
          {message.text}
        </div>

        {!!message.schemes?.length && (
          <div className="mt-2 flex w-full flex-col gap-2">
            {message.schemes.map((scheme) => (
              <div key={`${message.id}-${scheme.id}`} className="rounded-xl border border-border bg-white p-3">
                <p className="text-sm font-semibold text-text-primary">{scheme.name}</p>
                <p className="mt-1 text-xs text-text-secondary">{scheme.description}</p>

                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onViewDetails?.(scheme)}
                    className="rounded-md border border-primary/25 px-2.5 py-1 text-xs font-semibold text-primary"
                  >
                    {actions.viewDetails}
                  </button>

                  <a
                    href={scheme.applyLink || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground"
                  >
                    {actions.apply}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {message.showSuggestions && (
          <SuggestionButtons suggestions={messageSuggestions} onSelect={onSuggestionClick} />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
