import React, { createContext, useContext, useState } from 'react';

type NavigationContextType = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <NavigationContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

export default NavigationProvider; 