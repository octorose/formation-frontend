const LanguageToggle = ({ language, toggleLanguage }:any) => {
  return (
    <div className="language-toggle" onClick={toggleLanguage}>
      <span>{language.toUpperCase()}</span>
    </div>
  );
};

export default LanguageToggle;
