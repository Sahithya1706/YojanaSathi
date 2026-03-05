import React from "react";
import Routes from "./Routes";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Routes />
    </LanguageProvider>
  );
}

export default App;
