import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';

const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🇮🇳' },
];

const LanguageSelector = ({ currentLang = 'en', onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedLang = LANGUAGES?.find(l => l?.code === currentLang) || LANGUAGES?.[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef?.current && !containerRef?.current?.contains(e?.target)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e?.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleSelect = (code) => {
    onLanguageChange?.(code);
    setIsOpen(false);
  };

  return (
    <div className="lang-selector" ref={containerRef}>
      <button
        className="lang-btn"
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Language: ${selectedLang?.label}`}
      >
        <span aria-hidden="true">{selectedLang?.flag}</span>
        <span className="hidden sm:inline">{selectedLang?.nativeLabel}</span>
        <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={14} />
      </button>
      {isOpen && (
        <div className="lang-dropdown" role="listbox" aria-label="Select language">
          {LANGUAGES?.map(lang => (
            <button
              key={lang?.code}
              role="option"
              aria-selected={lang?.code === currentLang}
              className={`lang-option ${lang?.code === currentLang ? 'selected' : ''}`}
              onClick={() => handleSelect(lang?.code)}
            >
              <span aria-hidden="true">{lang?.flag}</span>
              <span>{lang?.nativeLabel}</span>
              <span className="text-xs text-muted-foreground ml-auto">{lang?.label}</span>
              {lang?.code === currentLang && (
                <Icon name="Check" size={14} color="var(--color-primary)" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;