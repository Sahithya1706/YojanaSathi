import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "components/AppIcon";
import { useLanguage } from "context/LanguageContext";
import ChatbotButton from "./ChatbotButton";
import ChatMessage from "./ChatMessage";
import {
  createGreetingMessage,
  createUserMessage,
  getBotReply,
  getChatbotCopy,
  getSuggestions,
} from "./ChatbotLogic";

const LANG_OPTIONS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
];

const ChatbotPanel = () => {
  const navigate = useNavigate();
  const { language: appLanguage, setLanguage: setAppLanguage } = useLanguage();

  const [chatOpen, setChatOpen] = useState(false);
  const [language, setLanguage] = useState(appLanguage || "en");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const copy = useMemo(() => getChatbotCopy(language), [language]);
  const suggestions = useMemo(() => getSuggestions(language), [language]);

  useEffect(() => {
    setLanguage(appLanguage || "en");
  }, [appLanguage]);

  useEffect(() => {
    if (!chatOpen || messages.length > 0) return;
    setMessages([createGreetingMessage(language)]);
  }, [chatOpen, language, messages.length]);

  useEffect(() => {
    if (!chatOpen) return;

    setMessages((current) => {
      if (current.length === 1 && current[0]?.isGreeting) {
        return [createGreetingMessage(language)];
      }
      return current;
    });
  }, [chatOpen, language]);

  useEffect(() => {
    if (!chatOpen) {
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [chatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const sendMessage = (text, forcedIntent = null) => {
    const trimmed = String(text || "").trim();
    if (!trimmed) return;

    setMessages((current) => [...current, createUserMessage(trimmed)]);
    setInputValue("");
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const selectedLanguage = language;

    typingTimeoutRef.current = setTimeout(() => {
      const botMessage = getBotReply({
        language: selectedLanguage,
        message: trimmed,
        intent: forcedIntent,
      });

      setMessages((current) => [...current, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion.label, suggestion.key);
  };

  const handleViewDetails = (scheme) => {
    if (scheme?.detailsPath) {
      navigate(scheme.detailsPath);
      return;
    }

    if (scheme?.applyLink) {
      window.open(scheme.applyLink, "_blank", "noopener,noreferrer");
    }
  };

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setAppLanguage?.(code);
  };

  return (
    <>
      <ChatbotButton
        chatOpen={chatOpen}
        onToggle={() => setChatOpen((open) => !open)}
        label={copy.chatLabel}
      />

      <button
        type="button"
        aria-label="Close chatbot"
        onClick={() => setChatOpen(false)}
        className={`fixed inset-0 z-[210] bg-black/30 transition-opacity ${
          chatOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-[220] flex h-screen w-full max-w-[420px] flex-col border-l border-border bg-popover shadow-2xl transition-transform duration-300 ${
          chatOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
        aria-label={copy.title}
      >
        <header className="border-b border-border px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-primary">{copy.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-text-secondary">
                <span>🌐 {copy.languageLabel}:</span>
                {LANG_OPTIONS.map((option, index) => (
                  <React.Fragment key={option.code}>
                    <button
                      type="button"
                      onClick={() => handleLanguageChange(option.code)}
                      className={`font-semibold ${
                        language === option.code ? "text-primary" : "text-text-secondary"
                      }`}
                    >
                      {option.label}
                    </button>
                    {index < LANG_OPTIONS.length - 1 && <span>|</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="rounded-md p-1 text-text-secondary transition hover:bg-muted"
              aria-label="Close panel"
            >
              <Icon name="X" size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              onViewDetails={handleViewDetails}
              actions={copy.actions}
            />
          ))}

          {isTyping && (
            <ChatMessage
              message={{ id: "typing", sender: "bot", text: copy.typing, typing: true }}
              suggestions={[]}
              actions={copy.actions}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-border p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={copy.inputPlaceholder}
              className="h-11 flex-1 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="h-11 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              {copy.send}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};

export default ChatbotPanel;
