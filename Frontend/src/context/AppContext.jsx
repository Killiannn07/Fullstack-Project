import { createContext, useContext } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const appConfig = {
    logo: "/IAN Store.svg",
    logoAlt: "Ian Store Logo",
  };

  return (
    <AppContext.Provider value={appConfig}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
